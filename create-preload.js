const u = require('./utilities');
const CreateManager = require("./create/CreateManager");
const { v4: uuidv4 } = require('uuid');
const StateAPI = require("./create/StateAPI");

// TODO
// RESULTS
// - More change logic 
// -- if x then y?
// -- using other qualities numbers?
// -- Change type random (set to a random # within range.)
// QUALITIES
// - Quality types (items vs attribues)?
// - Descriptions and labels.
// - Messages? 
// DOMAINS
// - Figure out event and card implementation. 

const api = new StateAPI("newworld.json");
const manager = new CreateManager(api);

// let activeStoryletForm;
window.addEventListener('DOMContentLoaded', () => {
  // populateQualityList();
  manager.populateSectionList();
  // activeStoryletForm = new StoryletForm({id: "new"});
  // let renderedStoryletForm = activeStoryletForm.render();
  // document.getElementById("storylet-form-container").append(renderedStoryletForm);
  // let newButton = u.create("button");
  // newButton.innerText = "+ Add New"
  // newButton.addEventListener("click", createNewQuality);
  // document.getElementById("new-quality-button-container").append(newButton)
});





function populateQualityList() {
  const qualitiesList = document.getElementById("qualities-list")
  u.removeChildren(qualitiesList);
  for (const quality of Object.values(worldState.qualities)) {
    const button = createItemButton(quality, "quality");
    qualitiesList.append(button);
  }
}

function createItemButton(data, type) {
  let button = u.create("button");
  button.classList.add("item-button");
  button.innerText = data.title || data.name;
  button.addEventListener("click", createAndPopulateForm.bind(null, data.id, type), );
  return button
}

function createNewQuality() {
  const id = uuidv4()

  let newQuality = {
    id,
    name: "New Quality",
    startvalue: 0,
    category: "",
    hidden: false,
  }

  worldState.qualities[id] = newQuality;
  populateQualityList();
}

function createQualityForm(data) {
  let children = [];
  
  let form = u.create("form");
  form.id = "quality-form";
  
  let idLabel = u.create("p");
  idLabel.innerText = `ID: ${data.id}`;
  children.push(idLabel);

  let nameLabel = u.create("label");
  nameLabel.htmlFor = "quality-name";
  nameLabel.innerText = "Name";
  children.push(nameLabel);

  let nameInput = u.create("input");
  nameInput.type = "text";
  nameInput.name = "quality-name";
  nameInput.id = "quality-name";
  nameInput.value = data.name;
  children.push(nameInput);

  let startLabel = u.create("label");
  startLabel.htmlFor = "quality-starting-value";
  startLabel.innerText = "Starting Value";
  children.push(startLabel);

  let startInput = u.create("input");
  startInput.type = "text";
  startInput.name = "quality-starting-value";
  startInput.id = "quality-starting-value";
  startInput.value = data.startvalue;
  children.push(startInput);
  
  let descriptionsContainer = u.create("div");
  descriptionsContainer.id = "quality-descriptions-container";
  children.push(descriptionsContainer);

  let labelsContainer = u.create("div");
  labelsContainer.id = "quality-labels-container";
  children.push(labelsContainer);
        
  let categoryLabel = u.create("label");
  categoryLabel.htmlFor = "quality-categorying";
  categoryLabel.innerText = "Category";
  children.push(categoryLabel);

  let categoryInput = u.create("input");
  categoryInput.type = "text";
  categoryInput.name = "quality-category";
  categoryInput.id = "quality-category";
  categoryInput.value = data.category;
  children.push(categoryInput);

  let hiddenLabel = u.create("label");
  hiddenLabel.htmlFor = "quality-hidden";
  hiddenLabel.innerText = "Hidden";
  children.push(hiddenLabel);
     
  let hiddenInput = u.create("input");
  hiddenInput.type = "checkbox";
  hiddenInput.name = "quality-hidden";
  hiddenInput.id = "quality-hidden";
  hiddenInput.checked = data.hidden;
  children.push(hiddenInput);
  
  let saveButton = u.create("button");
  saveButton.innerText = "Save";
  saveButton.type="submit";
  saveButton.addEventListener("click", saveForm);
  children.push(saveButton);

  u.appendChildren(form, children);

  return form;
}

function createAndPopulateForm(id, type, event) {
  if (type === "quality") {
    const oldForm = document.getElementById("quality-form");
    if (oldForm) {
      oldForm.remove();
    }
    const data = worldState.qualities[id]
    const form = createQualityForm(data);
    document.getElementById("qualities-container").append(form);
  }
  else if (type === "story") {
    const oldForm = document.getElementById("story-form");
    if (oldForm) {
      oldForm.remove();
    }
    const data = worldState.stories[id]
    const form = createStoryForm(data);
    document.getElementById("stories-container").append(form);
  }
  else if (type === "domain") {
    //TBD
  }
  else if (type === "action") {
    //TBD
  }
  else if (type === "event") {
    //TBD
  }
}