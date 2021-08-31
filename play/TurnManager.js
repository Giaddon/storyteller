/**  */



class TurnManager {
  constructor({state, result}) {
    this.state = state;
    this.result = result;
    this.displayChanges = [];
  }

  mainCycle() {
    for (const change of this.result.changes) {
      this.handleChange(change);
    }
    this.handleFlow(this.result.flow);
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

    this.displayChanges.push(change);

    // Add change to state so it can be used for the conclusionDisplay, 
    // which shows the results of changes to the player.
    //this.state.addChange(change);
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
    const HeaderDisplay = require("./HeaderDisplay");
    const OptionsDisplay = require("./OptionsDisplay");
    
    const header = new HeaderDisplay({state:this.state}).render();
    const options = new OptionsDisplay({state:this.state}).render();

    document.getElementById("header").replaceWith(header);
    document.getElementById("options-list").replaceWith(options);
  }


}

module.exports = TurnManager;