const u = require("../utilities");

class BackButton {
  constructor(mainCycle) {
    this.mainCycle = mainCycle;
  }

  render() {
    const backButton = u.create({tag:"button", content:"Go back", classes:["back-button"]});
    backButton.addEventListener("click", event => {
      event.preventDefault();
      this.mainCycle({changes:[], flow:"leave"});
    })
    return backButton;
  }
}

module.exports = BackButton;