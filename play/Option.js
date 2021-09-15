const u = require("../utilities");

class Option {
  constructor(state) {
    this.state = state;
  }

  render() {  
    if (this.visible === false) {
      return 
    }

    const optionElement = u.create({tag: "div", classes:["play-option"]});
    const titleElement = u.create({tag:"h1", content: this.title});
    const textElement = u.create({tag:"p", content:(this.buttonText || this.text)});
    const challengeContainer = u.create({tag:"div", classes:["play-option-challenge-container"]});
    const reqsContainer = u.create({tag:"div", classes:["play-option-reqs-container"]});

    optionElement.append(
      titleElement,
      textElement,
      challengeContainer,
      reqsContainer
    );
    
    for (const label of this.labels) {
      reqsContainer.append(label);
    }

    if (this.active) { 
      optionElement.setAttribute('tabindex', '0');
      optionElement.addEventListener('click', this.selectOption.bind(this));
    } else {
      optionElement.classList.add('play-option-disabled');
    }

    if (this.challenges) {
      for (const challenge of this.challenges) {
        const challengeIconContainer = u.create({tag:"div"});
        const challengeIcon = u.create({tag:"p", content:"⚠", classes: ["play-option-challenge-icon"]})
        const challengePhraseContainer = u.create({tag:"div"});
        const playerValue = this.state.getPlayerQuality(challenge.quality);
        const finalTarget = Number(challenge.target) + this.state.getPlayerQuality(challenge.modifier);
        const qualityLabel = this.state.getQuality(challenge.quality).name;
        const modifierLabel = this.state.getQuality(challenge.modifier).name;
        const floor = this.setFloor(challenge.difficulty);
        const step = (challenge.difficulty === "hard" ? 60 : 50) / finalTarget;
        const chance = Math.round(this.state.getPlayerQuality(challenge.quality) * step) + floor
        const challengePhrase = `This is a ${qualityLabel} ${modifierLabel ? `and ${modifierLabel}`: ""} challenge with target ${finalTarget}.\nYour ${qualityLabel} of ${playerValue} gives you a ${chance}% chance of success.`
        const challengeText = u.create({tag:"p", content: challengePhrase});
        challengeIconContainer.append(challengeIcon);
        challengePhraseContainer.append(challengeText)
        challengeContainer.append(challengeIconContainer, challengePhraseContainer);

        if (chance < 51) {
          challengeIcon.classList.add("play-challenge-hard")
        } else if (chance < 71) {
          challengeIcon.classList.add("play-challenge-med")
        } else {
          challengeIcon.classList.add("play-challenge-easy")
        }
      }
    } // end if challenge

    return optionElement;
  }

  selectOption() {
    const TurnManager = require("./TurnManager");
    const result = this.prepareResults()
    new TurnManager({
      state: this.state,
      result,
    })
  }

  prepareResults() {
    if (this.challenges && this.challenges.length > 0) {
      let passed = [];
      for (const challenge of this.challenges) {
        passed.push(this.attemptChallenge(challenge))
      }
      if (passed.includes(false)) {
        return {
          ...this.results.failure,
          challenge: {
            passed: false,
            challenges: this.challenges  
          }
        }
      } else {
        return {
          ...this.results.success,
          challenge: {
            passed: true,
            challenges: this.challenges  
          }
        }
      }
    } else {
      return this.results.neutral;
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

  evaluateReqs(reqs = this.reqs) {
    if (!reqs || reqs.qualities.length < 1) return {active: true, labels: []}
    let reqArray = [];
    let labels = [];
    if (reqs && reqs.qualities.length > 0) {
      for (const req of reqs.qualities) {
       
        const playerValue = this.state.getPlayerQuality(req.quality);
        const qualityData = this.state.getQuality(req.quality);
        const min = Number(req.min) < 0 ? -Infinity : Number(req.min);
        const max = Number(req.max) < 0 ? Infinity : Number(req.max);
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
          const newLabel = this.renderOptionReq({label, passed});
          labels.push(newLabel);
        }
      }
    }
    let active = false;
    if (reqArray.length > 0 && reqArray.every(passed => passed)) {
      active = true;
    }
    let visible = false;
    if (reqs.visibility === "always") {
      visible = true;
    } else if (reqs.visibility === "all") {
      if (reqArray.length > 0 && reqArray.every(passed => passed)) {
        visible = true;
      }
    } else if (reqs.visibility === "any") {
      if (reqArray.length > 0 && reqArray.some(passed => passed)) {
        visible = true;
      }
    }
    return {active, labels, visible};
  }

  renderOptionReq(reqData) {
    const req = u.create({tag:'div', classes:["play-option-req"]});
    const label = u.create({tag:'h1', content: reqData.label});
    req.appendChild(label);
  
    if (!reqData.passed) {
      req.classList.add('req-disabled');
    }
  
    return req;
  }

}

module.exports = Option