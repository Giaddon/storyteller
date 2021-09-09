const u = require("../utilities");
const Action = require("./Action");
const Storylet = require("./Storylet");

class OptionsDisplay {
  constructor({state}) {
    this.state = state;
  }

  render() {
    const activeContext = this.state.getContext();
    const contextType = activeContext.actions ? "storylet" : "domain";
    let options; 
    if (contextType === "storylet") {
      options = activeContext.actions;
    }
    else if (contextType === "domain") {
      options = [];
      for (const storyletId of activeContext.storylets) {
        options.push(this.state.getStorylet(storyletId));
      }
    } 

    const optionsList = u.create({
      tag: "div", 
      classes: ["play-options-list"], 
      id: "options-list",
    });
    for (const option of Object.values(options)) {
      const renderedOption = this.renderOption(option, contextType);
      if (renderedOption) {
        optionsList.append(renderedOption)
      }
    }
    return optionsList
  }

  renderOption(optionData, contextType) {
    const option = contextType === "storylet" ? new Action(optionData, this.state) : new Storylet(optionData, this.state);
    
    const optionElement = u.create({tag: "div", classes:["play-option"]});
    const titleElement = u.create({tag:"h1", content: option.title});
    const text = contextType === "domain" ? (option.text.split(".")[0] + ".") : option.text;
    const textElement = u.create({tag:"p", content:text});
    const challengeContainer = u.create({tag:"div", classes:["play-option-challenge-container"]});
    const reqsContainer = u.create({tag:"div", classes:["play-option-reqs-container"]});

    optionElement.append(titleElement);
    optionElement.append(textElement);
    optionElement.append(challengeContainer);
    optionElement.append(reqsContainer);
    
    const {active, labels, visible} = option.evaluateReqs(option.reqs)

    if (visible === false) {
      return 
    }

    for (const label of labels) {
      reqsContainer.append(label);
    }

    if (active) { 
      optionElement.setAttribute('tabindex', '0');
      optionElement.addEventListener('click', this.selectOption.bind(this, option));
    } else {
      optionElement.classList.add('play-option-disabled');
    }

    if (option.challenges) {
      for (const challenge of option.challenges) {
        const playerValue = this.state.getPlayerQuality(challenge.quality);
        const finalTarget = Number(challenge.target) + this.state.getPlayerQuality(challenge.modifier);
        const qualityLabel = this.state.getQuality(challenge.quality).name;
        const modifierLabel = this.state.getQuality(challenge.modifier).name;
        const floor = this.setFloor(challenge.difficulty);
        const step = (challenge.difficulty === "hard" ? 60 : 50) / finalTarget;
        const chance = Math.round(this.state.getPlayerQuality(challenge.quality) * step) + floor
        const challengePhrase = `This is a ${qualityLabel} ${modifierLabel ? `and ${modifierLabel}`: ""} challenge with target ${finalTarget}.\nYour ${qualityLabel} of ${playerValue} gives you a ${chance}% chance of success.`
        const challengeText = u.create({tag:"p", content: challengePhrase});
        challengeContainer.append(challengeText);
      }
    } // end if challenge

    return optionElement;
  }

  selectOption(option) {
    const TurnManager = require("./TurnManager");
    const result = this.prepareResults(option)
    new TurnManager({
      state: this.state,
      result,
    })
  }

  prepareResults(option) {
    if (option.challenges && option.challenges.length > 0) {
      let passed = [];
      for (const challenge of option.challenges) {
        passed.push(this.attemptChallenge(challenge))
      }
      if (passed.includes(false)) {
        return {
          ...option.results.failure,
          challenge: {
            passed: false,
            challenges: option.challenges  
          }
        }
      } else {
        return {
          ...option.results.success,
          challenge: {
            passed: true,
            challenges: option.challenges  
          }
        }
      }
    } else {
      return option.results.neutral;
    }
  }

  attemptChallenge({quality, modifier, difficulty, target}) {
    const finalTarget = Number(target) + this.state.getPlayerQuality(modifier);
    const floor = this.setFloor(difficulty);
    const step = (difficulty === "hard" ? 60 : 50) / finalTarget;
    const playerValue = Math.round(this.state.getPlayerQuality(quality) * step) + floor
    const result = Math.ceil(Math.random() * 100);
    console.log(playerValue >= result, `${playerValue} vs ${result}`)
    return playerValue >= result;
  }

  setFloor(difficulty) {
    if (difficulty === "easy") {
      return 50;
    } else if (difficulty === "med") {
      return 30;
    } else if (difficulty === "hard") {
      return 0;
    }
    throw new Error("No valid difficulty provided.")
  }

  // evaluateReqs(reqs) {
  //   if (!reqs) return {active: true, labels: []}
  //   if (reqs.qualities.length < 1) return {active: true, labels: []};
  //   let reqArray = [];
  //   let labels = [];
  //   if (reqs && reqs.qualities.length > 0) {
  //     for (const req of reqs.qualities) {
  //       const playerValue = this.state.getPlayerQuality(req.quality);
  //       const qualityData = this.state.getQuality(req.quality);
  //       const min = Number(req.min) || -Infinity;
  //       const max = Number(req.max) || Infinity;
  //       const passed = (playerValue >= min && playerValue <= max)
  //       reqArray.push(passed);
  //       if (qualityData.hidden !== true) {
  //         let label = "";
  //         if (min !== -Infinity) { 
  //           label += min.toString();
  //           label += " ≤ ";
  //         }
  //         label += qualityData.name;
  //         if (max !== Infinity) {
  //           label += " ≤ "
  //           label += max.toString();
  //         }
  //         const newLabel = this.renderOptionReq({label, passed});
  //         labels.push(newLabel);
  //       }
  //     }
  //   }
  //   let active = false;
  //   if (reqArray.length > 0 && reqArray.every(passed => passed)) {
  //       active = true;
  //     }
  //   return {active, labels};
  // }

  // renderOptionReq(reqData) {
  //   const req = u.create({tag:'div', classes:["option-req"]});
  //   const label = u.create({tag:'h1', content: reqData.label});
  //   req.appendChild(label);
  
  //   if (!reqData.passed) {
  //     req.classList.add('req-disabled');
  //   }
  
  //   return req;
  // }
}
module.exports = OptionsDisplay;