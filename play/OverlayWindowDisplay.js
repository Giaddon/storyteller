const u = require("../utilities");

class OverlayWindowDisplay {
  constructor() {

  }

  render() {
    const freeze = u.create({tag:"div", classes:["freeze-window"]});
    const listWindow = u.create({tag:"div", classes:["modal-window"]});
    freeze.append(listWindow);
    // const itemContainer = u.create({tag:"div", classes:["item-container"]})
    // listWindow.append(itemContainer);
    // const itemList = [];
    // for (const item of list) {
    //   const itemButton = u.create({tag:"button", content: item.name, classes:["add-button"]});
    //   itemButton.dataset.worldname = item.file;
    //   itemList.push(itemButton);
    //   itemContainer.append(itemButton);
    // }
    const closeButton = u.create({tag:"button", classes:["remove-button", "edge-button"], content: "Close"});
    closeButton.addEventListener("click", event => {freeze.remove()})
    listWindow.append(closeButton);
    
    return freeze;
  }
}

module.exports = OverlayWindowDisplay;