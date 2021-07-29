const u = require("../utilities");

class Context {
  constructor(prepareResults) {
    this.prepareResults = prepareResults
  }

  renderOptions(playerQualities, allQualities) {
    const type = this.actions ? "storylet" : "domain";
    const options = type === "storylet" ? this.actions : this.storylets

    const optionsList = u.create({tag:"div", class:["options-list"]})
    for (const option of Object.values(options)) {
      const renderedOption = this.renderOption(option, type, playerQualities, allQualities);
      if (renderedOption) {
        optionsList.append(renderedOption)
      }
    }
    return optionsList
  }

  renderOption(option, type, playerQualities, allQualities) {
    const optionElement = u.create({tag: "div", classes:["option"]});
    const titleElement = u.create({tag:"h1", content: option.title});
    const text = type === "storylet" ? (option.text.split(".")[0] + "...") : option.text;
    const textElement = u.create({tag:"p", content:text});
    const challengeContainer = u.create({tag:"div", classes:["option-challenge-container"]});
    const reqsContainer = u.create({tag:"div", classes:["option-reqs-container"]});

    optionElement.append(titleElement);
    optionElement.append(textElement);
    optionElement.append(challengeContainer);
    optionElement.append(reqsContainer);
    
    const {active, labels} = this.evaluateReqs(option.reqs, playerQualities, allQualities)

    for (const label of labels) {
      optionElement.querySelector(".option-reqs-container").append(label);
    }

    if (active) { 
      optionElement.setAttribute('tabindex', '0');
      optionElement.addEventListener('click', this.prepareResults.bind(null, option));
    } else {
      optionElement.classList.add('option-disabled');
    }

    if (option.challenges) {
      for (const challenge of option.challenges) {
        let playerValue = playerQualities[challenge.quality];
        let qualityLabel = allQualities[challenge.quality].name;
        let chance = challenge.difficulty - playerValue;
        if (chance > 6) {
          chance = 0;
        } else if (chance < 2) {
          chance = 100;  
        }
        else {
          chance = Math.round((1/6 * (6 - (chance - 1))) * 100);
        } 
        let challengePhrase = `This is a ${qualityLabel} challenge with difficulty ${challenge.difficulty}.\nYour ${qualityLabel} of ${playerValue} gives you a ${chance}% chance of success.`
        let challengeText = u.create({tag:"p", content: challengePhrase});
        optionElement.querySelector(".option-challenge-container").append(challengeText);
      }
    } // end if challenge

    return optionElement;
  }

  evaluateReqs(reqs, playerQualities, allQualities) {
    if (!reqs || reqs.qualities.length < 1) return {active: true, labels: []}
    let reqArray = [];
    let labels = [];
    for (const req of reqs.qualities) {
      const playerValue = playerQualities[req.quality] || 0;
      const qualityData = allQualities[req.quality];
      const min = Number(req.min) || -Infinity;
      const max = Number(req.max) || Infinity;
      const passed = (playerValue >= min && playerValue <= max)
      reqArray.push(passed);
      if (qualityData.hidden !== true) {
        let label = "";
        if (min !== -Infinity) { 
          label += min.toString();
          label += " ≤ ";
        }
        label += qualityData.name;
        if (max !== Infinity) {
          label += " ≤ "
          label += max.toString();
        }
      }
    }
    let active = false;
    if (reqArray.length > 0 && reqArray.every(passed => passed)) {
        active = true;
      }
    return {active, labels};
  }

}

module.exports = Context;