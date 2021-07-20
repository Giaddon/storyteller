const u = require("../utilities");
const schemas = require("./schemas");
const { v4: uuidv4 } = require('uuid');
const StoryletForm = require("./StoryletForm");

class CreateManager {
  constructor(api) {
    this.api = api;
    this.activeStoryletForm = null;
  }

  populateStoryletList() {
    const storyletListContainer = document.getElementById("item-list-container");
    let storyletList = document.createElement("div");
    storyletList.classList.add("item-list");
    storyletList.id = "storylet-list";
    storyletList.addEventListener("world", event => {
      storyletList.remove();
      this.populateStoryletList();
    });
    storyletListContainer.append(storyletList);
    
    let newActionButton = document.createElement("button");
    newActionButton.innerText = "+ New Storylet";
    newActionButton.classList.add("item-button");
    newActionButton.addEventListener("click", event => {
      event.preventDefault();
      const id = uuidv4();
      const newStorylet = {...schemas.storylet};
      newStorylet.id = id;
      this.api.addStorylet(id, newStorylet);
    })
    storyletList.append(newActionButton);

    for (const storylet of Object.values(this.api.getStorylets())) {
      const button = this.createItemButton(storylet, "story");
      button.addEventListener("click", event => {
        event.preventDefault();
        this.activeStoryletForm = new StoryletForm(this.api, storylet);
        let renderedStoryletForm = this.activeStoryletForm.render();
        u.removeChildren(document.getElementById("form-container"))
        document.getElementById("form-container").append(renderedStoryletForm);
      });
      storyletList.append(button);
    }
  }

  createItemButton(data, type) {
    let button = u.create("button");
    button.classList.add("item-button");
    button.innerText = data.title || data.name;
    return button
  }
}

module.exports = CreateManager;