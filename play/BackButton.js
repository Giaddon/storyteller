const u = require("../utilities");
const TurnManager = require("./TurnManager");

class BackButton {
  constructor(state) {
    this.state = state;
  }

  render() {
    if (this.state.isInStorylet() && !this.state.getContext().locked && this.state.getCurrentDomain()) {
      const backButton = u.create({
        tag:"button", 
        content:"⤺ Go back", 
        classes:["play-back-button"], 
        id: "back-button"
      });
      backButton.addEventListener("click", event => {
        event.preventDefault();
        new TurnManager({state:this.state, result:{changes:[], flow:"leave"}});
      })
      return backButton;
    } else {
      return u.create({tag:'div', id: 'back-button'});
    }
    
  }
}

module.exports = BackButton;