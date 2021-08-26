const u = require("../utilities");

class OptionsDisplay {
  constructor({openTravel}) {
    this.openTravel = openTravel;
  }

  render() {
    const toolbar = u.create({tag:"div", classes:["toolbar"]});
    const travelButton = u.create({tag:"button", content: "Travel"});
    travelButton.addEventListener("click", event => {
      event.preventDefault();
      this.openTravel();
    });
    toolbar.append(travelButton);

    return toolbar;
  }

  
}

module.exports = OptionsDisplay;