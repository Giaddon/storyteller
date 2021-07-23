const u = require("../utilities");
const schemas = require("../create/schemas");
const { v4: uuidv4 } = require('uuid');
const StoryletForm = require("../create/StoryletForm");
const QualityForm = require("../create/QualityForm");
const DomainForm = require("../create/DomainForm");

class CreateManager {
  constructor(api) {
    this.api = api;
    this.activeForm = null;
  }

  startupCreate() {
    const root = document.getElementById("root");
    u.removeChildren(root);
    
    const canvas = u.create({tag: "div", classes: ["canvas"], id: "canvas"});
    root.append(canvas);

    const sectionListContainer = u.create({tag: "div", classes: ["section-list-container"], id: "section-list-container"})
    const itemListContainer = u.create({tag: "div", classes: ["item-list-container"], id: "item-list-container"})
    const formContainer = u.create({tag: "div", classes: ["form-container"], id: "form-container"})

    canvas.append(sectionListContainer);
    canvas.append(itemListContainer);
    canvas.append(formContainer);

    this.populateSectionList();
  }

  populateSectionList() {
    const sectionListContainer = document.getElementById("section-list-container");
    let sectionList = document.createElement("div");
    sectionList.classList.add("item-list");
    sectionList.id = "section-list";
    sectionListContainer.append(sectionList);

    let qualitiesButton = document.createElement("button");
    qualitiesButton.innerText = "Qualities";
    qualitiesButton.classList.add("item-button");
    qualitiesButton.addEventListener("click", event => {
      event.preventDefault();
      this.populateItemList("qualities");
    })
    sectionList.append(qualitiesButton);

    let storyletsButton = document.createElement("button");
    storyletsButton.innerText = "Storylets";
    storyletsButton.classList.add("item-button");
    storyletsButton.addEventListener("click", event => {
      this.populateItemList("storylets");
    })
    sectionList.append(storyletsButton);

    let domainsButton = u.create({tag:"button", classes:["item-button"], content:"Domains"});
    domainsButton.addEventListener("click", event => {
      this.populateItemList("domains");
    })
    sectionList.append(domainsButton);
  }

  

  populateQualityList() {
    const listContainer = document.getElementById("item-list-container");
    u.removeChildren(listContainer);
    let list = document.createElement("div");
    list.classList.add("item-list");
    list.id = "quality-list";
    
    list.addEventListener("updatedWorld", event => {
      this.populateQualityList();
    });

    let newButton = document.createElement("button");
    newButton.innerText = "+ New Quality";
    newButton.classList.add("item-button");
    newButton.addEventListener("click", event => {
      event.preventDefault();
      const id = uuidv4();
      const newItem = {...schemas.quality};
      newItem.id = id;
      this.api.addQuality(id, newItem);
    })
    list.append(newButton);

    for (const quality of Object.values(this.api.getValue("qualities"))) {
      const button = this.createItemButton(quality);
      button.addEventListener("click", event => {
        event.preventDefault();
        const formContainer = document.getElementById("form-container");
        this.activeForm = new QualityForm(this.api, quality);
        let renderedForm = this.activeForm.render();
        u.removeChildren(formContainer)
        formContainer.append(renderedForm);
      });
      list.append(button);
    }
    listContainer.append(list);

  }

  populateStoryletList() {
    const storyletListContainer = document.getElementById("item-list-container");
    u.removeChildren(storyletListContainer);
    let storyletList = document.createElement("div");
    storyletList.classList.add("item-list");
    storyletList.id = "storylet-list";
    storyletList.addEventListener("updatedWorld", event => {
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
        this.activeForm = new StoryletForm(this.api, storylet);
        let renderedStoryletForm = this.activeForm.render();
        u.removeChildren(document.getElementById("form-container"))
        document.getElementById("form-container").append(renderedStoryletForm);
      });
      storyletList.append(button);
    }
  }

  populateItemList(type) {
    const items = this.api.getItems(type);
    const listContainer = document.getElementById("item-list-container");
    const formContainer = document.getElementById("form-container");
    u.removeChildren(listContainer);
    let itemList = u.create({tag: "div", classes:["item-list"], id:"item-list"});
    itemList.addEventListener("updatedWorld", event => {
      const {type} = event.detail;
      this.populateItemList(type);
    });
    listContainer.append(itemList);

    let label;
    let schemaKey;
    if (type === "storylets") label = "Storylet", schemaKey = "storylet";
    else if (type === "domains") label = "Domain", schemaKey = "domain";
    else if (type === "qualities") label = "Quality", schemaKey = "quality";

    let newItemButton = document.createElement("button");
    newItemButton.innerText = `+ New ${label}`;
    newItemButton.classList.add("item-button");
    newItemButton.addEventListener("click", event => {
      event.preventDefault();
      const id = uuidv4();
      const newItem = {...schemas[schemaKey]};
      newItem.id = id;
      this.api.saveItem(id, type, newItem);
    })
    itemList.append(newItemButton);

    for (const item of Object.values(items)) {
      const button = this.createItemButton(item);
      button.addEventListener("click", event => {
        event.preventDefault();
        let newForm;
        if (type === "storylets") newForm = new StoryletForm(this.api, item)
        else if (type === "domains") newForm = new DomainForm(this.api, item);
        else if (type === "qualities") newForm = new QualityForm(this.api, item);
        this.activeForm = newForm;
        let renderedForm = this.activeForm.render();
        u.removeChildren(formContainer)
        formContainer.append(renderedForm);
      });
      itemList.append(button);
    }

  }

  createItemButton(data) {
    let button = document.createElement("button");
    button.classList.add("item-button");
    button.innerText = data.title || data.name;
    return button
  }
}

module.exports = CreateManager;