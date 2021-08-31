const u = require("../utilities");

class ToolbarDisplay {
  constructor({openTravel, state}) {
    this.state = state;
    this.openTravel = openTravel;
  }

  render() {
    const activeContext = this.state.getContext();
    const destinations = this.state.getDestinations();
    const toolbar = u.create({tag:"div", classes:["toolbar"]});
    const travelButton = u.create({tag:"button", content: "Travel"});
    travelButton.addEventListener("click", event => {
      event.preventDefault();
      this.openTravel();
    });
    if (activeContext.locked || destinations.length < 1) {
      travelButton.disabled = true;
      travelButton.classList.add("disabled-button");
    }
    toolbar.append(travelButton);

    return toolbar;
  }

  
}

module.exports = ToolbarDisplay;