const CreateForm = require("./CreateForm");
const ActionForm = require("./ActionForm");
const ReqForm = require("./ReqForm");
const { v4: uuidv4 } = require('uuid');

class StoryletForm extends CreateForm {
  constructor(api, storylet) {
    super(api);
    this.id = storylet.id;
    this.title = storylet.title || "New Storylet";
    this.text = storylet.text || "Storylet text.";
    this.start = storylet.start;

    let qualities = [];
    for (const req of storylet.reqs.qualities) {
      qualities.push(new ReqForm(this.api, req, this.id, this.removeFromArray.bind(this, "reqs")))
    }
    
    this.reqs = {
      visibility: storylet.reqs.visibility || "always",
      qualities,
    };

    let actions = {};
    for (const action of (Object.values(storylet.actions))) {
      actions[action.id] = new ActionForm(this.api, action, this.removeChild.bind(this, "actions"))
    }

    this.actions = actions; 
  }

  render() {
    let form = document.createElement("form");
    form.id = "storylet-form";
    form.classList.add("active-form");
    
    let idLabel = document.createElement("p");
    idLabel.innerText = `ID: ${this.id}`;
    idLabel.classList.add("id-label");
    form.append(idLabel);

    let headerSection = document.createElement("div");
    headerSection.classList.add("form-section", "flex-column");
    form.append(headerSection);
    
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("remove-button", "delete-button")
    deleteButton.innerText = "Delete Storylet."
    deleteButton.addEventListener("click", event => {
      event.preventDefault();
      const confirmation = confirm("This will remove this storylet and associated actions from your world. It can't be undone.")
      if (confirmation) {
        this.deleteStorylet(this.id);
        form.remove();
      } else {
        return;
      }
    });
    headerSection.append(deleteButton);

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

    let {input: startInput, label: startLabel} = this.createInput(
      "checkbox", 
      "storylet", 
      "start", 
      this.start,
    );
    startInput.addEventListener("input", this.captureCheckbox.bind(this, "start"));
    headerSection.append(startLabel);
    headerSection.append(startInput);
    
    let visLabel = document.createElement("label");
    visLabel.innerText = "Visibility";
    visLabel.htmlFor = `storylet-${this.id}-visibility`;
    headerSection.append(visLabel); 

    let visSelect = document.createElement("select");
    visSelect.id = `storylet-${this.id}-visibility`;
    for (const visType of [
      {value: "always", label: "Always"}, 
      {value: "any", label: "Any"}, 
      {value: "all", label: "All"}
    ]) {
      let option = document.createElement("option");
      option.value = visType.value;
      option.text = visType.label;
      visSelect.add(option);
    }
    visSelect.value = this.reqs.visibility;
    visSelect.addEventListener("change", this.captureField.bind(this, "reqs visibility"));
    headerSection.append(visSelect);

    let reqsLabel = document.createElement("label");
    reqsLabel.innerText = "Quality Requirements";
    headerSection.append(reqsLabel); 

    let reqsContainer = document.createElement("div");
    reqsContainer.classList.add("item-container");
    headerSection.append(reqsContainer);

    let newReqButton = document.createElement("button");
    newReqButton.innerText = "+ New Requirement";
    newReqButton.classList.add("add-button");
    newReqButton.addEventListener("click", event => {
      event.preventDefault();
      const id = this.generateId();
      const reqData = {
        id
      }
      const newReq = new ReqForm(this.api, reqData, this.id, this.removeFromArray.bind(this, "reqs"));
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

    let actionSection = document.createElement("div");
    form.append(actionSection);

    let actionLabel = document.createElement("label");
    actionLabel.innerText = "Actions"
    actionSection.append(actionLabel);

    for (const action of Object.values(this.actions)) {
      const newActionElement = action.render();
      actionSection.append(newActionElement);
    }

    let newActionButton = document.createElement("button");
    newActionButton.innerText = "+ New Action";
    newActionButton.classList.add("add-button");
    newActionButton.addEventListener("click", event => {
      event.preventDefault();
      const id = this.generateId();
      const newActionData = {
        id,
        title: "New action",
        text: "Action text.",
        reqs: {
          visibility: "always",
          qualities: [],
        },
        challenges: [],
        results: {
          neutral: {
            title: "Neutral Result",
            text: "Result text.",
            flow: "return",
            changes: [],
          },
          success: {
            title: "Success Result",
            text: "Result text.",
            flow: "return",
            changes: [],
          },
          failure: {
            title: "Failure Result",
            text: "Result text.",
            flow: "return",
            changes: [],
          }
        },
      }
      const newAction = new ActionForm(this.api, newActionData, this.removeChild.bind(this, "actions"));
      this.actions[id] = newAction;
      const newActionElement = newAction.render();
      actionSection.append(newActionElement);
    })
    form.append(newActionButton);

    let savePillow = document.createElement("div");
    savePillow.classList.add("save-pillow");
    form.append(savePillow);
    let saveButton = document.createElement("button");
    saveButton.classList.add("save-button");
    saveButton.addEventListener("click", this.saveForm.bind(this));
    saveButton.innerText = "Save";
    savePillow.append(saveButton);

    return form;
  }

  saveForm(event) {
    event.preventDefault();
    console.log(this);
    let qualities = [];
    for (const req of this.reqs.qualities) {
      qualities.push(req.returnData());
    }
    let reqs = {
      visibility: this.reqs.visibility,
      qualities
    }
    
    let actions = {}
    for (const action of (Object.values(this.actions))) {
      actions[action.id] = action.returnData();
    }
    const storylet = {
      id: this.id,
      title: this.title,
      text: this.text,
      start: this.start,
      reqs,
      actions,
      results: {
        neutral: {
          flow: this.id,
          changes: [],
          title: "",
          text: "",
        }
      }
    }
    
    this.api.saveItem(this.id, "storylets", storylet);
  }

}

module.exports = StoryletForm;