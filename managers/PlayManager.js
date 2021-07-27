const u = require("../utilities");
const QualityDisplay = require("../play/QualityDisplay");
const OptionsDisplay = require("../play/OptionsDisplay");
const Quality = require("../play/Quality");
const DeckDisplay = require("../play/DeckDisplay");

class PlayManager {
  constructor(api) {
    this.api = api;
    this.qualityDisplay = null;
    this.optionsDisplay = null;
    this.decksDisplay = null;
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

    const decksContainer = u.create({tag: "div", classes:["decks-container"], id: "decks-container"});
    storyContainer.append(decksContainer);

    const optionsContainer = u.create({tag: "div", classes:["options-container"], id: "options-container"});
    storyContainer.append(optionsContainer);

    const start = this.api.getStart()
    const header = this.createHeader(start);

    this.decksDisplay = new DeckDisplay(this.api, this.prepareResults.bind(this));
    const renderedDecks = this.decksDisplay.render();
    decksContainer.append(renderedDecks);

    this.optionsDisplay = new OptionsDisplay(this.api, this.prepareResults.bind(this));
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
      console.log("returning");
    } else if (result.flow === "leave") {
      this.api.exitStorylet();
      location = this.api.getCurrentDomain();
      console.log("leaving", location);
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
    const decks = this.decksDisplay.render();
    const options = this.optionsDisplay.render();
    const qualities = this.qualityDisplay.render();
    
    this.renderGame(conclusion, header, decks, options, qualities)
  }

  // Clears dom and adds the supplied elements.
  renderGame(conclusion, header, decks, options, qualities) {
    const containers = this.clearGame();

    containers.qualitiesContainer.append(qualities);
    containers.headerContainer.append(header);
    containers.resultContainer.append(conclusion);
    containers.decksContainer.append(decks);
    containers.optionsContainer.append(options);

    document.getElementById("story-container").scroll(0, 0);
  }

  clearGame() {
    const qualitiesContainer = document.getElementById("qualities-container");
    const resultContainer = document.getElementById("result-container");
    const headerContainer = document.getElementById("header-container");
    const decksContainer = document.getElementById("decks-container");
    const optionsContainer = document.getElementById("options-container");

    for (const container of [
      qualitiesContainer, 
      resultContainer, 
      headerContainer, 
      decksContainer,
      optionsContainer
    ]) {
      u.removeChildren(container);
    }
    return {
      qualitiesContainer,
      resultContainer,
      headerContainer,
      decksContainer,
      optionsContainer
    }
  }

  // Fired when player selects an action or storylet. 
  // Determines what result to send to the main cycle.
  prepareResults(option) {
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
      this.mainCycle(option.results.neutral);
    }
  }

  attemptChallenge({quality, difficulty}) {
    const result = Math.ceil(Math.random() * 6) + this.api.getPlayerQuality(quality);
    console.log(result >= difficulty, `${result} vs ${difficulty}`)
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
        changedQualities[change.quality] = new Quality(this.api.getQuality(change.quality), this.api.getPlayerQuality(change.quality));
      }
    }
    if (result.challenge) {
      for (const challenge of result.challenge.challenges)
      changedQualities[challenge.quality] = new Quality(this.api.getQuality(challenge.quality), this.api.getPlayerQuality(challenge.quality));
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
        let outcomeText = "";
        if (change.type === "set") {
          outcomeText = `${qualities[qualityId].name} is now ${qualities[qualityId].label || Math.abs(change.value)}.`
        } else {
          let changePhrase = "";
          if (change.value > 0) {
            changePhrase = "increased by"
          } else {
            changePhrase = "decreased by"
          }
          outcomeText = `${qualities[qualityId].name} ${changePhrase} ${Math.abs(change.value)}.`
        }
 
        // TODO add text for removal / 0 or below.
        outcome.innerText = outcomeText;
        outcomes.append(outcome);
      }
    }
      if (outcomes.children.length > 0) {
        conclusion.append(outcomes);
      } else {
        outcomes.remove();
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