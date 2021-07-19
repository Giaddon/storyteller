const CreateForm = require("./CreateForm");
const ActionForm = require("./ActionForm");
const ReqForm = require("./ReqForm");
const { v4: uuidv4 } = require('uuid');

class StoryletForm extends CreateForm {
  constructor(storylet) {
    super();
    this.id = storylet.id;
    this.title = storylet.title || "New Storylet";
    this.text = storylet.text || "Storylet text.";
    this.button = storylet.button || {
      "title": "New Storylet",
      "text": "Button text.", 
    };
    this.reqs = storylet.reqs || {
      visibility: "always",
      qualities: [],
    };
    this.actions = storylet.actions || {}; 
  }

  render() {
    let form = document.createElement("form");
    form.id = "storylet-form";
    form.classList.add("storylet-form");
    
    let idLabel = document.createElement("p");
    idLabel.innerText = `ID: ${this.id}`;
    idLabel.classList.add("id-label");
    form.append(idLabel);

    let headerSection = document.createElement("div");
    headerSection.classList.add("form-section");
    form.append(headerSection);
    
    let headerLabel = document.createElement("label");
    headerLabel.innerText = "Storylet Header";
    headerSection.append(headerLabel);

    let {input: titleInput, label: titleLabel} = this.createInput(
      "text", 
      "storylet", 
      "title", 
      this.title,
    );
    titleInput.addEventListener("input", this.captureField.bind(this, "title"));
    headerSection.append(titleLabel);
    headerSection.append(titleInput);
  
    let {input: textInput, label: textLabel} = this.createInput(
      "textarea", 
      "storylet", 
      "text", 
      this.text,
    );
    textInput.addEventListener("input", this.captureField.bind(this, "text"));
    headerSection.append(textLabel);
    headerSection.append(textInput);

    let reqsLabel = document.createElement("label");
    reqsLabel.innerText = "Quality Requirements";
    headerSection.append(reqsLabel); 

    let reqsContainer = document.createElement("div");
    reqsContainer.classList.add("reqs-container");
    headerSection.append(reqsContainer);

    let newReqButton = document.createElement("button");
    newReqButton.innerText = "+ New Requirement";
    newReqButton.classList.add("add-req-button");
    newReqButton.addEventListener("click", event => {
      event.preventDefault();
      const id = uuidv4();
      const reqData = {
        id
      }
      const newReq = new ReqForm(reqData, this.id, this.removeReq.bind(this));
      this.reqs.qualities.push(newReq);
      const renderedReq = newReq.render();
      reqsContainer.append(renderedReq);
    })
    headerSection.append(newReqButton);
    
    if (this.reqs) {
      for (const req of this.reqs.qualities) {
        let reqElement = req.render();
        reqsContainer.append(reqElement);
      }
    }

    let buttonSection = document.createElement("div");
    buttonSection.classList.add("storylet-button");
    form.append(buttonSection);

    let buttonLabel = document.createElement("label");
    buttonLabel.innerText = "Storylet Button";
    buttonSection.append(buttonLabel);

    let {input: buttonTitleInput, label: buttonTitleLabel} = this.createInput(
      "text", 
      "storylet-button", 
      "title", 
      this.button.title,
    );
    buttonTitleInput.addEventListener("input", this.captureField.bind(this, "button title"));
    buttonSection.append(buttonTitleLabel);
    buttonSection.append(buttonTitleInput);

    let {input: buttonTextInput, label: buttonTextLabel} = this.createInput(
      "textarea", 
      "storylet-button", 
      "text", 
      this.button.text,
    );
    buttonTextInput.addEventListener("input", this.captureField.bind(this, "button text"));
    buttonSection.append(buttonTextLabel);
    buttonSection.append(buttonTextInput);
    
    let actionSection = document.createElement("div");
    form.append(actionSection);

    let actionLabel = document.createElement("label");
    actionLabel.innerText = "Actions"
    actionSection.append(actionLabel);

    for (const action of Object.values(this.actions)) {
      const newAction = createActionDiv(action);
      actionSection.append(newAction);
    }

    let newActionButton = document.createElement("button");
    newActionButton.innerText = "+ New Action";
    newActionButton.addEventListener("click", event => {
      event.preventDefault();
      const id = uuidv4();
      const newActionData = {
        id,
        button: {
          title: "New action",
          text: "Action text.",
        },
        reqs: {
          visibility: "always",
          qualities: [],
        },
        results: {
          title: "New result",
          text: "Result text.",
          changes: [],
        },
      }
      const newAction = new ActionForm(newActionData, this.removeChild.bind(this, "actions"));
      this.actions[id] = newAction;
      const newActionElement = newAction.render();
      actionSection.append(newActionElement);
    })
    actionSection.append(newActionButton);

    let saveButton = document.createElement("button");
    saveButton.addEventListener("click", this.saveForm.bind(this));
    saveButton.innerText = "Save";
    form.append(saveButton);

    return form;
  }

  saveForm(event) {
    event.preventDefault();
    console.log(this);
  }

}

module.exports = StoryletForm;