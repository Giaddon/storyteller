const u = require("../utilities");

class ConclusionDisplay {
  constructor(state) {
    this.state = state;
  }

  render(conclusionData, changes) {
    const Quality = require("./Quality");

    if (!conclusionData) {
      return u.create({tag:"div", id: "conclusion",});
    }

    const conclusion = u.create({
      tag: "div", 
      classes:["play-conclusion"],
      id: "conclusion",
    })

    if (conclusionData.title) {
      const title = u.create({tag:"h1", content: conclusionData.title})
      const text = u.create({tag: "p", content: conclusionData.text});
      conclusion.append(title, text);
    }

    const outcomes = u.create({tag: "div", classes: ["play-conclusion-outcomes"]});

    if (conclusionData.challenge) {
      if (conclusionData.challenge.passed) {
        outcomes.classList.add("play-challenge-passed");
      } else {
        outcomes.classList.add("play-challenge-failed");
      }
      // Not quite right we make is possible to use multiple challenges (uses same passed for all qualities).
      for (const challenge of conclusionData.challenge.challenges) {
        const quality = new Quality(this.state.getQuality(challenge.quality), this.state.getPlayerQuality(challenge.quality))
        const outcome = u.create({
          tag:"p", 
          content: `You ${conclusionData.challenge.passed ? "passed" : "failed"} a ${quality.name} challenge!`
        });
        outcomes.append(outcome);
      }
    }

    //const changes = this.state.getChanges();
    if (changes.length > 0) {      
      for (const change of changes) {
        const qualityData = this.state.getQuality(change.quality);
        const quality = new Quality(qualityData, this.state.getPlayerQuality(change.quality));
        if (quality.hidden) continue;
        const outcome = u.create({tag:"p"});
        let outcomeText = "";
        if (change.type === "set") {
          const newValue = (quality.max > 0 && change.value > quality.max) ? quality.max : Math.abs(change.value);
          outcomeText = `${quality.name} is now ${quality.label || newValue}.`
        } else if (change.type === "adjust") {
          let changePhrase = "";
          if (change.value > 0) {
            changePhrase = "increased by"
          } else {
            changePhrase = "decreased by"
          }
          outcomeText = `${quality.name} ${changePhrase} ${Math.abs(change.value)}.`
        } else if (change.type === "random") {
          outcomeText = `${quality.name} is now ${this.state.getPlayerQuality(change.quality)}.`
        }

        // TODO add text for removal / 0 or below.
        outcome.innerText = outcomeText;
        outcomes.append(outcome);
      }
    }
    //this.state.clearChanges();
    if (outcomes.children.length > 0) {
      conclusion.append(outcomes);
    } else {
      outcomes.remove();
    }
  

    if (outcomes.children.length > 0 || conclusionData.title) {
      const seperator = u.create({tag:"div", classes:["play-conclusion-seperator"]});
      conclusion.append(seperator);
    }
    return conclusion;
  }

}

module.exports = ConclusionDisplay;