/**  */

const u = require("../utilities");
const ConclusionDisplay = require("./ConclusionDisplay");
const DeckDisplay = require("./DeckDisplay");
const HeaderDisplay = require("./HeaderDisplay");
const ToolbarDisplay = require("./ToolbarDisplay");

class TurnManager {
  constructor({state, result}) {
    this.state = state;
    this.result = result;
    this.appliedChanges = [];
    this.conclusion = {};

    this.mainCycle();
  }

  mainCycle() {
    for (const change of this.result.changes) {
      this.handleChange(change);
    }
    
    this.handleFlow(this.result.flow);

    this.conclusion = {
      title: this.result.title,
      text: this.result.text,
      challenge: this.result.challenge,
    }

    this.state.saveGame();
    this.renderGame();
  }

  handleChange(change) {
    if (change.logic && change.logic.length > 0) {
      for (const {type, quality, min, max} of change.logic) {
        const playerValue = this.state.getPlayerQuality(quality);
        if (type === "if") {
          if (min <= playerValue && playerValue <= max) {
            return;
          }
        } else if (type === "unless") {
          if (!(min <= playerValue && playerValue <= max)) {
            return;
          }
        }
      }
    }

    switch (change.type) {
      case "set":
        this.state.setQuality(change.quality, change.value);
        break;
      case "adjust":
        this.state.adjustQuality(change.quality, change.value);
        break;
      case "random":
        this.state.randomizeQuality(change.quality, change.value);
        break;
      default:
        console.error('No valid change type found.');
    }

    this.appliedChanges.push(change);
  }

  handleFlow(flow) {
    if (flow === "return") {
      // we don't change context
      return;
    } else if (flow === "leave") {
      this.state.exitStorylet();
    } else {
      // if the flow is a context ID, we check domains first, then storylets. 
      let foundDomain = this.state.getDomain(flow);
      if (foundDomain) {
        this.state.enterDomain(flow);
      } else {
        this.state.enterStorylet(flow);
      }
    }
  }

  renderGame() {
    const OptionsDisplay = require("./OptionsDisplay");
    const QualityDisplay = require("./QualityDisplay");
    const BackButton = require("./BackButton");

    const conclusion = new ConclusionDisplay(this.state).render(this.conclusion, this.appliedChanges);
    const header = new HeaderDisplay({state:this.state}).render();
    const decks = new DeckDisplay(this.state).render();
    const options = new OptionsDisplay({state:this.state}).render();
    new QualityDisplay({state:this.state}).updateQualities(this.appliedChanges);
    const backButton = new BackButton(this.state).render()
    const toolbar = new ToolbarDisplay({state:this.state}).render();
    document.getElementById("toolbar").replaceWith(toolbar);

    document.getElementById("conclusion").style.animation = 'fade-out 0.4s forwards';
    document.getElementById("header").style.animation = 'fade-out 0.4s forwards';
    document.getElementById("decks").style.animation = 'fade-out 0.4s forwards';
    document.getElementById("options-list").style.animation = 'fade-out 0.4s forwards';
    document.getElementById("back-button").style.animation = 'fade-out 0.4s forwards';

    setTimeout(() => {
      document.getElementById("story-container").scroll(0, 0);
      document.getElementById("conclusion").replaceWith(conclusion);
      document.getElementById("header").replaceWith(header);
      document.getElementById("decks").replaceWith(decks);
      document.getElementById("options-list").replaceWith(options);
      document.getElementById("back-button").replaceWith(backButton);
    }, 400);
  }

}

module.exports = TurnManager;