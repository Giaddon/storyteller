const u = require("../utilities");
const QualityDisplay = require("../play/QualityDisplay");
const OptionsDisplay = require("../play/OptionsDisplay");

class PlayManager {
  constructor(api) {
    this.api = api;
    this.qualityDisplay = null;
    this.optionsDisplay = null;
  }

  startupPlay() {
    const root = document.getElementById("root");
    u.removeChildren(root);
    
    const canvas = u.create({tag: "div", classes: ["canvas"], id: "canvas"});
    root.append(canvas);

    const qualitiesContainer = u.create({tag: "div", classes: ["qualities-container"], id: "qualities-container"});
    canvas.append(qualitiesContainer);
    
    this.qualityDisplay = new QualityDisplay(this.api);
    const renderedQualities = this.qualityDisplay.render();
    qualitiesContainer.append(renderedQualities);

    const storyContainer = u.create({tag: "div", classes:["story-container"], id: "story-container"});
    canvas.append(storyContainer);

    const resultContainer = u.create({tag: "div", classes:["result-container"], id: "result-container"});
    storyContainer.append(resultContainer);

    const headerContainer = u.create({tag: "div", classes:["header-container"], id: "header-container"});
    storyContainer.append(headerContainer);

    const optionsContainer = u.create({tag: "div", classes:["options-container"], id: "options-container"});
    storyContainer.append(optionsContainer);

    const start = this.api.getStart()
    const header = this.createHeader(start);

    this.optionsDisplay = new OptionsDisplay(this.api, this.prepareResults);
    const renderedOptions = this.optionsDisplay.render();
    optionsContainer.append(renderedOptions)
    
    headerContainer.append(header);

  }

  // After the user selects an option, prepareResults packages the data in a result and
  // executes this function, which handles the changes, sets the text, and redraws the game.
  mainCycle(result = null) {
    console.log("Cycling with: ", result);
    for (const change of result.changes) {
      this.handleChange(change);
    }

    let location;
    if (result.flow === "return") {
      location = this.api.getCurrentStorylet()
      console.log("returning")
    } else {
      console.log("flowing")
      this.api.exitStorylet();
      location = this.api.enterDomain(result.flow);
      if (location === undefined) {
        location = this.api.enterStorylet(result.flow);
      }
    }

    const header = this.createHeader(location);
    const conclusion = this.prepareWindow(result)
    const options = this.optionsDisplay.render();
    const qualities = this.qualityDisplay.render();
    
    this.renderGame(conclusion, header, options, qualities)
  }

  // Clears dom and adds the supplied elements.
  renderGame(conclusion, header, options, qualities) {
    const containers = this.clearGame();

    containers.qualitiesContainer.append(qualities);
    containers.headerContainer.append(header);
    containers.resultContainer.append(conclusion);
    containers.optionsContainer.append(options);

    document.getElementById("story-container").scroll(0, 0);
  }

  clearGame() {
    const qualitiesContainer = document.getElementById("qualities-container");
    const resultContainer = document.getElementById("result-container");
    const headerContainer = document.getElementById("header-container");
    const optionsContainer = document.getElementById("options-container");

    for (const container of [qualitiesContainer, resultContainer, headerContainer, optionsContainer]) {
      u.removeChildren(container);
    }
    return {
      qualitiesContainer,
      resultContainer,
      headerContainer,
      optionsContainer
    }
  }


  createOptions(options) {
    const optionsList = u.create({tags:"div", classes:["options-list"]});
    for (const option of options) {
      const renderedOption = createOption(option);
      if (renderedOption) {
        optionsList.append(renderedOption);
      }
    }

    return optionsList;
  }

  createOption(option) {
    const optionDiv = u.create({tag:"div", classes:["option"]});
    const title = u.create({tag:"h1", content: option.title});
    const text = u.create({tag:"p", content: option.text});
    optionDiv.append(title);
    optionDiv.append(text);

    // let challengeContainer = document.createElement('div');
    // challengeContainer.classList.add("option-challenge-container");
    // option.appendChild(challengeContainer);
  
    // let reqsContainer = document.createElement('div');
    // reqsContainer.classList.add("option-reqs-container");
    // option.appendChild(reqsContainer);
    
    
    const {active, labels} = this.evaluateReqs(option.reqs)
  
    for (const label of labels) {
      optionElement.querySelector(".option-reqs-container").appendChild(label);
    }
  
    if (active) { 
      optionElement.setAttribute('tabindex', '0');
      optionElement.addEventListener('click', (event) => { selectOption(option) });
    } else {
      if (option.reqs.hidden) {
        optionElement.remove();
        return;
      }
      optionElement.classList.add('option-disabled');
    }
  
    if (option.challenge) {
      let playerValue = state.actions.getQuality(option.challenge.quality);
      if (playerValue === undefined) {
        playerValue = 0;
      } 
      let qualityLabel = state.actions.getQualityData(option.challenge.quality).label;
      let chance = option.challenge.difficulty - playerValue;
      if (chance > 6) {
        chance = 0;
      } else if (chance < 2) {
        chance = 100;  
      }
      else {
        chance = Math.round((1/6 * (6 - (chance - 1))) * 100);
      } 
      let challengePhrase = `This is a ${qualityLabel} challenge.\nYour ${qualityLabel} of ${playerValue} gives you a ${chance}% chance of success.`
      let challengeText = document.createElement("p");
      challengeText.innerText = challengePhrase;
      optionElement.querySelector(".option-challenge-container").appendChild(challengeText);
    } // end if challenge
  
    return optionElement;
  }



  // Fired when player selects an action or storylet. 
  // Determines what result to send to the main cycle.
  prepareResults(option) {
    console.log("preparing results")
    if (option.challenges && option.challenges.length > 0) {
      let passed = [];
      for (const challenge of option.challenges) {
        passed.push(this.attemptChallenge(challenge))
      }
      if (passed.every(outcome => outcome)) {
        this.mainCycle({
          ...option.results.success,
          challenge: {
            passed: true,
            challenges: option.challenges
          } 
        });
      } else {
        this.mainCycle({
          ...option.results.failure,
          challenge: {
            passed: false,
            challenges: option.challenges
          } 
        });
      }
    } else {
      console.log("preparing neutral")
      this.mainCycle(option.results.neutral);
    }
  }

  attemptChallenge({quality, difficulty}) {
    const result = Math.ceil(Math.random() * 6) + this.api.getPlayerQuality(quality);
    return result >= difficulty;
  }

  handleChange(change) {
    switch (change.type) {
      case 'set':
        this.api.setQuality(change.quality, change.value);
        break;
      case 'adjust':
        this.api.adjustQuality(change.quality, change.value);
        break;
      default:
        console.error('No valid change type found.');
    }
    //renderQuality(change.quality, state.actions.getQuality(change.quality));
  }

  // Prepares the result data or the action conclusion, returns the completed conclusion element.
  prepareWindow(result) {
    let changedQualities = {};
    const changes = result.changes;
    if (changes) {
      for (const change of changes) {
        changedQualities[change.quality] = this.api.getQuality(change.quality);
      }
    }
    if (result.challenge) {
      for (challenge of result.challenge.challenges)
      changedQualities[challenge.quality] = this.api.getQuality(challenge.quality);
    }

    return this.createConclusion(result, changedQualities)
  }

  // creates and returns the conclusion element for display. 
  createConclusion(result, qualities = {}) {
    const conclusion = u.create({tag: "div", classes:["conclusion"]})
    const conclusionTitle = u.create({tag:"h1", content: result.title})
    const conclusionText = u.create({tag: "p", content: result.text});
    const outcomes = u.create({tag: "div", classes: ["conclusion-outcomes"]});
    conclusion.append(conclusionTitle);
    conclusion.append(conclusionText);

    if (result.challenge) {
      if (result.challenge.passed) {
        outcomes.classList.add("challenge-passed");
      } else {
        outcomes.classList.add("challenge-failed");
      }
      // Not quite right if multiple challenges get added (uses same passed for all qualities).
      for (const challenge of result.challenge.challenges) {
        const outcome = u.create({
          tag:"p", 
          content: `You ${result.challenge.passed ? "passed" : "failed"} a ${qualities[challenge.quality].name} challenge!`
        });
        outcomes.append(outcome);
      }
    }

    if (result.changes.length > 0) {      
      for (const change of result.changes) {
        const qualityId = change.quality;
        if (qualities[qualityId].hidden) continue;
        const outcome = u.create({tag:"p"});
        let changePhrase = "";
        if (change.type === "set") {
          changePhrase = "is now"
        } else if (change.type === "adjust") {
          if (change.value > 0) {
            changePhrase = "increased by"
          } else {
            changePhrase = "decreased by"
          }
        }
        // TODO add text for removal / 0 or below.
        outcome.innerText = `${qualities[qualityId].name} ${changePhrase} ${Math.abs(change.value)}.`;
        outcomes.append(outcome);
      }

      //This won't be accurate once events are working.
      // if (result.flow === "return") {
      //   const outcome = u.create({tag:"p", content: `You are still in ${this.api.getCurrentStorylet().title}`});
      //   outcomes.append(outcome);
      // }
      
      if (outcomes.children.length < 1) {
        outcomes.remove();
      } else {
        conclusion.append(outcomes);
      }
    }

    const seperator = u.create({tag:"div", classes:["conclusion-seperator"]});
    conclusion.append(seperator);

    return conclusion;
  }



  createHeader(headerData) {
    let header = document.createElement("div");
    let title = document.createElement("h1");
    let text = document.createElement("p");
  
    header.classList.add("header");
    header.id = "header";
    title.innerText = headerData.title;
    text.innerText = headerData.text;
  
    header.appendChild(title);
    header.appendChild(text);
  
    return header;
  }

  renderQuality(qualityId, value) {  
    const quality = this.api.getQuality(qualityId);
    if (quality.hidden) return;
    
    let displayValue = value.toString();
    let displayDescription = '';
  
    if (quality.labels && quality.labels.length > 0) {
      const keys = quality.labels.sort((a, b) => a.value - b.value);
      displayValue = quality.labels[Math.min(value, keys[keys.length - 1])];
    }

    if (quality.descriptions) {
      const keys = quality.descriptions.sort((a, b) => a.value - b.value);
      displayDescription = quality.descriptions[Math.min(value, keys[keys.length - 1])];
    }
  
    const qualitiesContainer = document.getElementById('qualities-categories-container');
    const targetQuality = document.getElementById(`qual-${qualityId}`);
    if (targetQuality) {
      const parent = targetQuality.parentElement;
      if (!value) {
        targetQuality.remove();
        if (parent.classList.contains('quality-category') && parent.children.length < 2) {
          parent.remove();
        }
      } else targetQuality.firstElementChild.innerText = `${quality.label} • ${displayValue}`;
    }
    else {
      if (!value) return;
  
      let parent;
      const category = quality.category || 'Uncategorized';
      let targetCategory = document.getElementById(`cat-${category}`);
      if (targetCategory) {
        parent = targetCategory;
      }
      if (!parent) {
        const newCategory = document.createElement('div');
        const newCategoryTitle = document.createElement('h1');
        newCategory.id = `cat-${category}`;
        newCategory.classList.add('qualities-category');
        newCategoryTitle.classList.add('qualities-category-title');
        newCategoryTitle.innerText = category;
        newCategory.appendChild(newCategoryTitle);
        qualitiesContainer.appendChild(newCategory);
        parent = newCategory;
      }
      
      const newQuality = document.createElement('div');
      const newQualityTitle = document.createElement('p');
      newQualityTitle.classList.add('quality-title');
      newQualityTitle.innerText = `${quality.label} • ${displayValue}`
  
      newQuality.appendChild(newQualityTitle);
  
      if (displayDescription) {
        const newQualityDescription = document.createElement('p');
        newQualityDescription.innerHTML = displayDescription;
        newQualityDescription.classList.add('quality-description');
        newQuality.appendChild(newQualityDescription);
      }
  
      newQuality.classList.add('quality');
      newQuality.id = `qual-${qualityId}`;
  
      parent.appendChild(newQuality);
    }
  }

  createQualityCategory(category) {
    const newCategory = document.createElement('div');
    const newCategoryTitle = document.createElement('h1');
    newCategory.id = `cat-${category}`;
    newCategory.classList.add('qualities-category');
    newCategoryTitle.classList.add('qualities-category-title');
    newCategoryTitle.innerText = category;
    newCategory.appendChild(newCategoryTitle);

    return newCategory;
  }

  createQuality(id, label, value, description = "", ) {
    const newQuality = document.createElement('div');
    newQuality.classList.add('quality');
    newQuality.id = `qual-${id}`;
    
    const newQualityTitle = document.createElement('p');
    newQualityTitle.classList.add('quality-title');
    newQualityTitle.innerText = `${label} • ${value}`
    newQuality.appendChild(newQualityTitle);

    if (description) {
      const newQualityDescription = document.createElement('p');
      newQualityDescription.innerHTML = description;
      newQualityDescription.classList.add('quality-description');
      newQuality.appendChild(newQualityDescription);
    }

    return newQuality;
  }

}

module.exports = PlayManager