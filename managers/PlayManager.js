const u = require("../utilities");
const QualityDisplay = require("../play/QualityDisplay");
const OptionsDisplay = require("../play/OptionsDisplay");
const Quality = require("../play/Quality");
const DeckDisplay = require("../play/DeckDisplay");
const HeaderDisplay = require("../play/HeaderDisplay");
const ConclusionDisplay = require("../play/ConclusionDisplay");
const Storylet = require("../play/Storylet");

class PlayManager {
  constructor(api) {
    this.api = api;
    this.qualityDisplay = null;
    this.headerDisplay = null;
    this.conclusionDisplay = null;
    this.optionsDisplay = null;
    this.decksDisplay = null;
  }

  startupPlay() {
    // Sets the appropriate player context in state
    this.api.start();
    
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

    this.conclusionDisplay = new ConclusionDisplay(this.api);
    const renderedConclusion = this.conclusionDisplay.render();
    resultContainer.append(renderedConclusion);

    const headerContainer = u.create({tag: "div", classes:["header-container"], id: "header-container"});
    storyContainer.append(headerContainer);

    this.headerDisplay = new HeaderDisplay(this.api);
    const renderedHeader = this.headerDisplay.render();
    headerContainer.append(renderedHeader);

    const decksContainer = u.create({tag: "div", classes:["decks-container"], id: "decks-container"});
    storyContainer.append(decksContainer);

    this.decksDisplay = new DeckDisplay(this.api, this.prepareResults.bind(this));
    const renderedDecks = this.decksDisplay.render();
    decksContainer.append(renderedDecks);

    const optionsContainer = u.create({tag: "div", classes:["options-container"], id: "options-container"});
    storyContainer.append(optionsContainer);

    this.optionsDisplay = new OptionsDisplay(this.api, this.prepareResults.bind(this));
    const renderedOptions = this.optionsDisplay.render();
    optionsContainer.append(renderedOptions)

    console.log(this.api.isInStorylet(), this.api.getContext().locked, this.api.getCurrentDomain())
    if (this.api.isInStorylet() && !this.api.getContext().locked && this.api.getCurrentDomain()) {
      const backButton = u.create({tag:"button", content:"Back"});
      backButton.addEventListener("click", event => {
        event.preventDefault();
        this.mainCycle({changes:[], flow:"leave"});
      })
      document.getElementById("story-container").append(backButton);
    }
  }

  // After the user selects an option, prepareResults packages the data in a result and
  // executes this function, which handles the changes, sets the text, and redraws the game.
  mainCycle(result = null) {
    console.log("Cycling with: ", result);
    for (const change of result.changes) {
      this.handleChange(change);
    }

    if (result.flow === "return") {
      // we don't change context
    } else if (result.flow === "leave") {
      this.api.exitStorylet();
    } else {
      let foundDomain = this.api.getDomain(result.flow);
      if (foundDomain) {
        this.api.enterDomain(result.flow);
      } else {
        this.api.enterStorylet(result.flow);
      }
    }

    this.api.setResult(result);

    if (!this.api.isInStorylet()) {
      const activeDomain = this.api.getCurrentDomain();
      console.log("Checking events...", activeDomain.events);
      for (const eventId of activeDomain.events) {
        const event = new Storylet(this.api.getStorylet(eventId), this.api)
        if (event.active) {
          this.api.enterStorylet(eventId);
          break;
        }
      }
    }

    this.api.saveGame();

    console.log("Current context: ", this.api.getContext())
    const header = this.headerDisplay.render();
    const conclusion = this.conclusionDisplay.render();
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
    console.log(this.api.isInStorylet(), this.api.getContext().locked, this.api.getCurrentDomain())
    if (this.api.isInStorylet() && !this.api.getContext().locked && this.api.getCurrentDomain()) {
      const backButton = u.create({tag:"button", content:"Back"});
      backButton.addEventListener("click", event => {
        event.preventDefault();
        this.mainCycle({changes:[], flow:"leave"});
      })
      document.getElementById("story-container").append(backButton);
    }

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
    if (change.logic && change.logic.length > 0) {
      const passingArray = [];
      for (const {type, quality, min, max} of change.logic) {
        const playerValue = this.api.getPlayerQuality(quality);
        if (type === "if") {
          passingArray.push(min <= playerValue && playerValue <= max);
        } else if (type === "unless") {
          passingArray.push(!(min <= playerValue && playerValue <= max));
        }
      }
      if (!passingArray.every(test => test)) {
        return;
      } 
    }
    this.api.addChange(change);
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
  }

  // // Prepares the result data or the action conclusion, returns the completed conclusion element.
  // prepareWindow(result) {
  //   let changedQualities = {};
  //   const changes = result.changes;
  //   if (changes) {
  //     for (const change of changes) {
  //       changedQualities[change.quality] = new Quality(this.api.getQuality(change.quality), this.api.getPlayerQuality(change.quality));
  //     }
  //   }
  //   if (result.challenge) {
  //     for (const challenge of result.challenge.challenges)
  //     changedQualities[challenge.quality] = new Quality(this.api.getQuality(challenge.quality), this.api.getPlayerQuality(challenge.quality));
  //   }

  //   return this.createConclusion(result, changedQualities)
  // }

  // // creates and returns the conclusion element for display. 
  // createConclusion(result, qualities = {}) {
  //   const conclusion = u.create({tag: "div", classes:["conclusion"]})
  //   const conclusionTitle = u.create({tag:"h1", content: result.title})
  //   const conclusionText = u.create({tag: "p", content: result.text});
  //   const outcomes = u.create({tag: "div", classes: ["conclusion-outcomes"]});
  //   conclusion.append(conclusionTitle);
  //   conclusion.append(conclusionText);

  //   if (result.challenge) {
  //     if (result.challenge.passed) {
  //       outcomes.classList.add("challenge-passed");
  //     } else {
  //       outcomes.classList.add("challenge-failed");
  //     }
  //     // Not quite right if multiple challenges get added (uses same passed for all qualities).
  //     for (const challenge of result.challenge.challenges) {
  //       const outcome = u.create({
  //         tag:"p", 
  //         content: `You ${result.challenge.passed ? "passed" : "failed"} a ${qualities[challenge.quality].name} challenge!`
  //       });
  //       outcomes.append(outcome);
  //     }
  //   }

  //   if (result.changes.length > 0) {      
  //     for (const change of result.changes) {
  //       const qualityId = change.quality;
  //       if (qualities[qualityId].hidden) continue;
  //       const outcome = u.create({tag:"p"});
  //       let outcomeText = "";
  //       if (change.type === "set") {
  //         outcomeText = `${qualities[qualityId].name} is now ${qualities[qualityId].label || Math.abs(change.value)}.`
  //       } else {
  //         let changePhrase = "";
  //         if (change.value > 0) {
  //           changePhrase = "increased by"
  //         } else {
  //           changePhrase = "decreased by"
  //         }
  //         outcomeText = `${qualities[qualityId].name} ${changePhrase} ${Math.abs(change.value)}.`
  //       }
 
  //       // TODO add text for removal / 0 or below.
  //       outcome.innerText = outcomeText;
  //       outcomes.append(outcome);
  //     }
  //   }
  //     if (outcomes.children.length > 0) {
  //       conclusion.append(outcomes);
  //     } else {
  //       outcomes.remove();
  //     }
    

  //   const seperator = u.create({tag:"div", classes:["conclusion-seperator"]});
  //   conclusion.append(seperator);

  //   return conclusion;
  // }

}

module.exports = PlayManager