const u = require("../utilities");
const QualityDisplay = require("./QualityDisplay");
const OptionsDisplay = require("./OptionsDisplay");
const DeckDisplay = require("./DeckDisplay");
const HeaderDisplay = require("./HeaderDisplay");
const ConclusionDisplay = require("./ConclusionDisplay");
const ToolbarDisplay = require("./ToolbarDisplay");
const BackButton = require("./BackButton");

class PlayManager {
  constructor(state) {
    this.state = state;
  }

  // Initializes the play module's state, adds the containers to the webpage, and creates the "display"
  // objects that manage the play components.
  startup() {
    //this.state.start();
    
    const root = document.getElementById("root");
    u.removeChildren(root);
    
    //Canvas: parent div of the play module.
    const canvas = u.create({tag: "div", classes: ["play-canvas"], id: "canvas"});
    root.append(canvas);

    const qualitiesContainer = u.create({tag: "div", classes: ["play-qualities-container"], id: "qualities-container"});
    canvas.append(qualitiesContainer);
    
    qualitiesContainer.addEventListener("mouseenter", event => {
      qualitiesContainer.style.animation = 'fade-in 0.5s forwards';
    })

    qualitiesContainer.addEventListener("mouseleave", event => {
      setTimeout(() => {
        qualitiesContainer.style.animation = 'fade-out 0.5s forwards';
      }, 1000)
    })

    const qualities = new QualityDisplay({state:this.state}).render();
    qualitiesContainer.append(qualities);

    const storyContainer = u.create({tag: "div", classes:["play-story-container"], id: "story-container"});
    canvas.append(storyContainer);

    const resultContainer = u.create({tag: "div", classes:["result-container"], id: "result-container"});

    const conclusion = new ConclusionDisplay(this.state).render();
    resultContainer.append(conclusion);

    const headerContainer = u.create({tag: "div", classes:["header-container"], id: "header-container"});

    const header = new HeaderDisplay({state:this.state}).render();
    headerContainer.append(header);

    const decksContainer = u.create({tag: "div", classes:["decks-container"], id: "decks-container"});

    const decks = new DeckDisplay(this.state).render();
    decksContainer.append(decks);

    const optionsContainer = u.create({tag: "div", classes:["options-container"], id: "options-container"});
    
    const options = new OptionsDisplay({state:this.state}).render();
    optionsContainer.append(options);

    const buttonContainer = u.create({
      tag: "div",
      id: "button-container",
      classes: ["button-container"],
    })

    storyContainer.append(resultContainer, headerContainer, decksContainer, optionsContainer, buttonContainer);  

    const backButton = new BackButton(this.state).render();
    buttonContainer.append(backButton);
  
    const toolbarContainer = u.create({tag: "div", classes:["play-toolbar-container"]});
    canvas.append(toolbarContainer);

    toolbarContainer.addEventListener("mouseenter", event => {
      toolbarContainer.style.animation = 'fade-in 0.5s forwards';
    })

    toolbarContainer.addEventListener("mouseleave", event => {
      setTimeout(() => {
        toolbarContainer.style.animation = 'fade-out 0.5s forwards';
      }, 1000)
    })

    const toolbar = new ToolbarDisplay({state: this.state}).render();
    toolbarContainer.append(toolbar);
    
    setTimeout(() => {
      qualitiesContainer.style.animation = 'fade-out 0.5s forwards';
      toolbarContainer.style.animation = 'fade-out 0.5s forwards';
    }, 2000);

  }

  // This method is bound and passed into the options container. 
  // Fired when player selects an option. 
  // Determines what result to send to the main cycle.
  // prepareResults(option) {
  //   if (option.challenges && option.challenges.length > 0) {
  //     let passed = [];
  //     for (const challenge of option.challenges) {
  //       passed.push(this.attemptChallenge(challenge))
  //     }
  //     if (passed.every(outcome => outcome)) {
  //       this.mainCycle({
  //         ...option.results.success,
  //         challenge: {
  //           passed: true,
  //           challenges: option.challenges
  //         } 
  //       });
  //     } else {
  //       this.mainCycle({
  //         ...option.results.failure,
  //         challenge: {
  //           passed: false,
  //           challenges: option.challenges
  //         } 
  //       });
  //     }
  //   } else {
  //     this.mainCycle(option.results.neutral);
  //   }
  // }

  // // Returns a boolean indicating if the player passed a challenge.
  // // Currently, a challenge generates a random number between 1 and 6 (1d6), 
  // // adds it to the player's quality value, and compares it to difficulty value. 
  // // If the sum is equal or higher the player passes the challenge.
  // attemptChallenge({quality, difficulty}) {
  //   const result = Math.ceil(Math.random() * 6) + this.state.getPlayerQuality(quality);
  //   console.log(result >= difficulty, `${result} vs ${difficulty}`)
  //   return result >= difficulty;
  // }

  // // After the user selects an option, prepareResults packages the data in a result and
  // // executes this function, which handles the changes, sets the text, and redraws the game.
  // mainCycle(result = {changes: [],}) {
  //   console.log("Cycling with: ", result);
  //   for (const change of result.changes) {
  //     this.handleChange(change);
  //   }

  //   if (result.flow === "return") {
  //     // we don't change context
  //   } else if (result.flow === "leave") {
  //     this.state.exitStorylet();
  //   } else {
  //     // if the flow is a context ID, we check domains first, then storylets. 
  //     let foundDomain = this.state.getDomain(result.flow);
  //     if (foundDomain) {
  //       this.state.enterDomain(result.flow);
  //     } else {
  //       this.state.enterStorylet(result.flow);
  //     }
  //   }

  //   this.state.setConclusion({
  //     title: result.title,
  //     text: result.text,
  //     challenge: result.challenge,
  //   });

  //   if (!this.state.isInStorylet()) {
  //     const activeDomain = this.state.getCurrentDomain();
  //     console.log("Checking events...", activeDomain.events);
  //     for (const eventId of activeDomain.events) {
  //       const event = new Storylet(this.state.getStorylet(eventId), this.state)
  //       if (event.active) {
  //         this.state.enterStorylet(eventId);
  //         break;
  //       }
  //     }
  //   }

  //   this.state.saveGame();

  //   console.log("Current context: ", this.state.getContext())
  //   this.qualityDisplay.updateQualities();
  //   const header = this.headerDisplay.render();
  //   const conclusion = this.conclusionDisplay.render();
  //   const decks = this.decksDisplay.render();
  //   const options = this.optionsDisplay.render();
  //   //const qualities = this.qualityDisplay.render();
    

  //   this.renderGame(conclusion, header, decks, options)
  // }

  // // Clears dom and adds the supplied elements.
  // renderGame(conclusion, header, decks, options) {
  //   const containers = this.clearGame();

  //   //containers.qualitiesContainer.append(qualities);
  //   containers.headerContainer.append(header);
  //   containers.resultContainer.append(conclusion);
  //   containers.decksContainer.append(decks);
  //   containers.optionsContainer.append(options);
    
  //   if (this.state.isInStorylet() && !this.state.getContext().locked && this.state.getCurrentDomain()) {
  //     const backButton = new BackButton(this.mainCycle.bind(this));
  //     document.getElementById("options-container").append(backButton.render())
  //   }

  //   document.getElementById("story-container").scroll(0, 0);
  // }

  // clearGame() {
  //   //const qualitiesContainer = document.getElementById("qualities-container");
  //   const resultContainer = document.getElementById("result-container");
  //   const headerContainer = document.getElementById("header-container");
  //   const decksContainer = document.getElementById("decks-container");
  //   const optionsContainer = document.getElementById("options-container");

  //   for (const container of [
  //     resultContainer, 
  //     headerContainer, 
  //     decksContainer,
  //     optionsContainer
  //   ]) {
  //     u.removeChildren(container);
  //   }
  //   return {
  //     resultContainer,
  //     headerContainer,
  //     decksContainer,
  //     optionsContainer
  //   }
  // }

  // handleChange(change) {
  //   if (change.logic && change.logic.length > 0) {
  //     const passingArray = [];
  //     for (const {type, quality, min, max} of change.logic) {
  //       const playerValue = this.state.getPlayerQuality(quality);
  //       if (type === "if") {
  //         passingArray.push(min <= playerValue && playerValue <= max);
  //       } else if (type === "unless") {
  //         passingArray.push(!(min <= playerValue && playerValue <= max));
  //       }
  //     }
  //     if (!passingArray.every(test => test)) {
  //       return;
  //     } 
  //   }

  //   switch (change.type) {
  //     case 'set':
  //       this.state.setQuality(change.quality, change.value);
  //       break;
  //     case 'adjust':
  //       this.state.adjustQuality(change.quality, change.value);
  //       break;
  //     case 'random':
  //       this.state.randomizeQuality(change.quality, change.value);
  //       break;
  //     default:
  //       console.error('No valid change type found.');
  //   }

  //   // Add change to state so it can be used for the conclusionDisplay, 
  //   // which shows the results of changes to the player.
  //   this.state.addChange(change);
  // }

  // openTravel() {
  //   const overlay = this.overlayWindowDisplay.renderTravel();
  //   document.getElementById("root").prepend(overlay);
  // }

}

module.exports = PlayManager