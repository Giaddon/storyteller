const u = require("../utilities");
const OverlayWindowDisplay = require('./OverlayWindowDisplay');

class ToolbarDisplay {
  constructor({state}) {
    this.state = state;
  }

  render() {
    const activeContext = this.state.getContext();
    const destinations = this.state.getDestinations();
    const toolbar = u.create({tag:"div", classes:["play-toolbar"], id: "toolbar"});
    const travelButton = u.create({tag:"button", content: "Travel"});
    travelButton.addEventListener("click", event => {
      event.preventDefault();
      const overlay = new OverlayWindowDisplay({state: this.state}).renderTravel();
      document.getElementById("root").prepend(overlay);
    });
    if (
      this.state.isInStorylet() === true ||
      activeContext.locked === true ||
      destinations.length < 1
    ) {
      travelButton.disabled = true;
      travelButton.classList.add("play-disabled-button");
    }
    toolbar.append(travelButton);

    return toolbar;
  }

  
}

module.exports = ToolbarDisplay;