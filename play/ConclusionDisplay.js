const u = require("../utilities");
const Quality = require("./Quality");

class ConclusionDisplay {
  constructor(api) {
    this.api = api;
  }

  render() {
    const result = this.api.getResult();
    if (!result) {
      return document.createElement("div");
    }
    const conclusion = u.create({tag: "div", classes:["conclusion"]})
    const title = u.create({tag:"h1", content: result.title})
    const text = u.create({tag: "p", content: result.text});
    const outcomes = u.create({tag: "div", classes: ["conclusion-outcomes"]});
    conclusion.append(title);
    conclusion.append(text);

    if (result.challenge) {
      if (result.challenge.passed) {
        outcomes.classList.add("challenge-passed");
      } else {
        outcomes.classList.add("challenge-failed");
      }
      // Not quite right we make is possible to use multiple challenges (uses same passed for all qualities).
      for (const challenge of result.challenge.challenges) {
        const quality = new Quality(this.api.getQuality(challenge.quality), this.api.getPlayerQuality(challenge.quality))
        const outcome = u.create({
          tag:"p", 
          content: `You ${result.challenge.passed ? "passed" : "failed"} a ${quality.name} challenge!`
        });
        outcomes.append(outcome);
      }
    }

    const changes = this.api.getChanges();
    if (changes.length > 0) {      
      for (const change of changes) {
        const qualityData = this.api.getQuality(change.quality);
        const quality = new Quality(qualityData, this.api.getPlayerQuality(change.quality));
        if (quality.hidden) continue;
        const outcome = u.create({tag:"p"});
        let outcomeText = "";
        if (change.type === "set") {
          outcomeText = `${quality.name} is now ${quality.label || Math.abs(change.value)}.`
        } else {
          let changePhrase = "";
          if (change.value > 0) {
            changePhrase = "increased by"
          } else {
            changePhrase = "decreased by"
          }
          outcomeText = `${quality.name} ${changePhrase} ${Math.abs(change.value)}.`
        }

        // TODO add text for removal / 0 or below.
        outcome.innerText = outcomeText;
        outcomes.append(outcome);
      }
    }
    this.api.clearChanges();
    if (outcomes.children.length > 0) {
      conclusion.append(outcomes);
    } else {
      outcomes.remove();
    }
  

    if (outcomes.children.length > 0 || result.title) {
      const seperator = u.create({tag:"div", classes:["conclusion-seperator"]});
      conclusion.append(seperator);
    }
    return conclusion;
  }

}

module.exports = ConclusionDisplay;