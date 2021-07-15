const u = require('./utilities');
const { v4: uuidv4 } = require('uuid');

let worldState = {
  qualities: {
    coins: {
      id: "coins",
      name: "Coins",
      startvalue: 5,
      category: "Currency",
      hidden: false,
    }
  },
  domains: {},
  stories: {
    bazaar: {
      id: "bazaar",
      title: "Xylax Bazaar",
      text: "A thousand languages reverberate through the packed halls of the bazaar, but the dialect of barter is universal.",
      reqs: {},
      button: {
        title: "Browse Xylx Bazaar.",
        text: "If you want to make some money, trading at the bazaar is a great place to do it.",
      },
      actions: {
        loiter: {
          id: "loiter",
          button: {
            title: "Loiter suspiciously.",
            text: "There's no law against it, right?"
          },
          results: {
            conclusion: {
              title: "You're up to something...",
              text: "You fidget. You squirm. You lean against a beam then change your mind. Why are you sweating?"
            },
            changes: [
              {
                type: "adjust",
                quality: "suspicion",
                value: 1
              }
            ]
          }
        },
        "sellSpices": {
          "id": "sellSpices",
          "button": {
            "title": "Sell some spice.",
            "text": "A serpentine creature with three tounges is offering 100 credits per block of spice."
          },
          "challenge": {
            "quality": "cunning",
            "difficulty": 5 
          },
          "reqs": {
            "type": "all",
            "qualities": [
              {
                "quality": "spices",
                "min": 1
              }
            ]
          },
          "results": {
            "success": {
              "conclusion": {
                "title": "A successful transaction.",
                "text": "With a hiss, the creature stows the spice in a biological pouch."
              },
              "changes": [
                {
                  "type": "adjust",
                  "quality": "spices",
                  "value": -1
                },
                {
                  "type": "adjust",
                  "quality": "credits",
                  "value": 100
                }
              ]
            },  
            "failure": {
              "conclusion": {
                "title": "Theft!",
                "text": "You were so busy negotiating with the serpent that you didn't notice the others slithering up behind you until it was too late. They take your spice and leave."
              },
              "changes": [
                {
                  "type": "set",
                  "quality": "spices",
                  "value": 0
                }
              ]
            }
          } 
        },
      }
    }
  },
  events: {}
}

window.addEventListener('DOMContentLoaded', () => {
  // populateQualityList();
  populateStoryList();
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

function populateStoryList() {
  const storyList = document.getElementById("story-list")
  u.removeChildren(storyList);
  for (const story of Object.values(worldState.stories)) {
    const button = createItemButton(story, "story");
    storyList.append(button);
  }
}

function createItemButton(data, type) {
  let button = u.create("button");
  button.classList.add("item-button");
  button.innerText = data.title || data.name;
  button.addEventListener("click", createAndPopulateForm.bind(null, data, type), );
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

function createInput(inputType, formType, contentType, content, suffix) {
  let input;

  if (inputType === "text") {
    input = u.create("input");
    input.type = "text";
  }
  else if (inputType === "textarea") {
    input = u.create("textarea");
  }
  else if (inputType === "checkbox") {
    input = u.create("input");
    input.type = "checkbox";
  }
  input.name = `${formType}-${contentType}${suffix}`;
  input.id = `${formType}-${contentType}${suffix}`;
  input.classList.add(`${formType}-${contentType}`);

  if (inputType === "checkbox") {
    input.checked = content
  } else {
    input.value = content;
  }

  return input;
}

function createStoryForm(data) {
  let children = [];
  
  let form = u.create("form");
  form.id = "story-form";
  form.classList.add("story-form");
  
  let idLabel = u.create("p");
  idLabel.innerText = `ID: ${data.id}`;
  idLabel.classList.add("id-label");
  children.push(idLabel);

  let headerLabel = u.create("p");
  headerLabel.innerText = "Story Header";
  children.push(headerLabel);

  let headerSection = u.create("div");
  headerSection.classList.add("form-section");
  children.push(headerSection);

  let titleLabel = u.create("label");
  titleLabel.htmlFor = "story-title";
  titleLabel.innerText = "Title";
  headerSection.append(titleLabel);

  let titleInput = createInput("text", "story", "title", data.title);
  headerSection.append(titleInput);
 
  let textLabel = u.create("label");
  textLabel.htmlFor = "story-text";
  textLabel.innerText = "Text";
  headerSection.append(textLabel);

  let textInput = createInput("textarea", "story", "text", data.text);
  headerSection.append(textInput);

  let buttonLabel = u.create("p");
  buttonLabel.innerText = "Story Button";
  children.push(buttonLabel);

  let buttonSection = u.create("div");
  buttonSection.id = "story-button";
  buttonSection.classList.add("story-button");
  children.push(buttonSection);

  let buttonTitleLabel = u.create("label");
  buttonTitleLabel.htmlFor = "story-button-title";
  buttonTitleLabel.innerText = "Button Title";
  buttonSection.append(buttonTitleLabel);

  let buttonTitleInput = createInput("text", "story-button", "title", data.button.title);
  buttonSection.append(buttonTitleInput);

  let buttonTextLabel = u.create("label");
  buttonTextLabel.htmlFor = "story-button-text";
  buttonTextLabel.innerText = "Button Text";
  buttonSection.append(buttonTextLabel);

  let buttonTextInput = createInput("textarea", "story-button", "text", data.button.text);
  buttonSection.append(buttonTextInput);
  
  let actionLabel = u.create("p");
  actionLabel.innerText = "Story Actions"
  children.push(actionLabel);

  let actionSection = u.create("div");
  children.push(actionSection);

  let count = 0;
  for (const action of Object.values(data.actions)) {
    const newAction = createActionForm(action, count);
    count++;
    actionSection.append(newAction);
  }

  u.appendChildren(form, children);

  return form;
}

function createActionForm(data, count) {
  let children = [];
  
  let form = u.create("form");
  form.id = `action-form-${count}`;
  form.classList.add("action-form");

  let idLabel = u.create("p");
  idLabel.innerText = `ID: ${data.id}`;
  idLabel.classList.add("id-label");
  children.push(idLabel);

  let title = createInput("text", "action", "title", data.button.title, `-${count}`);
  children.push(title);

  let text = createInput("textarea", "action", "text", data.button.text, `-${count}`);
  children.push(text);

  u.appendChildren(form, children);

  return form 
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

function saveForm(formData, event) {
  from.preventDefault();
}

function createAndPopulateForm(data, type, event) {
  if (type === "quality") {
    const oldForm = document.getElementById("quality-form");
    if (oldForm) {
      oldForm.remove();
    }
    const form = createQualityForm(data);
    document.getElementById("qualities-container").append(form);
  }
  else if (type === "story") {
    const oldForm = document.getElementById("story-form");
    if (oldForm) {
      oldForm.remove();
    }
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
