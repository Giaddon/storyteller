const u = require("../utilities");


class OverlayWindowDisplay {
  constructor({state}) {
    this.state = state;
  }

  renderTravel() {
    const destinations = this.state.getDestinations();
    const freeze = u.create({tag:"div", classes:["freeze-window"]});
    const listWindow = u.create({tag:"div", classes:["modal-window"]});
    freeze.append(listWindow);
    const itemList = u.create({tag:"div", classes:["play-item-list"]})
    for (const destination of destinations) {
      const domainData = this.state.getDomain(destination);
      const itemButton = u.create({tag:"button", content: domainData.title, classes:["add-button"]});
      itemList.append(itemButton);
      itemButton.addEventListener("click", event => {
        const TurnManager = require("./TurnManager");

        freeze.remove()
        new TurnManager({state: this.state, result:{changes: [], flow: destination,}});
      })
    }
    const closeButton = u.create({tag:"button", classes:["remove-button", "edge-button"], content: "Close"});
    closeButton.addEventListener("click", event => {freeze.remove()})
    listWindow.append(itemList, closeButton);
    
    return freeze;
  }
}

module.exports = OverlayWindowDisplay;