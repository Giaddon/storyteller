const u = require("../utilities");
const TurnManager = require("./TurnManager");

class BackButton {
  constructor(state) {
    this.state = state;
  }

  render() {
    const backButton = u.create({
      tag:"button", 
      content:"Go back", 
      classes:["back-button"], 
      id: "back-button"
    });
    backButton.addEventListener("click", event => {
      event.preventDefault();
      new TurnManager({state:this.state, result:{changes:[], flow:"leave"}});
    })
    return backButton;
  }
}

module.exports = BackButton;