const CreateForm = require("./CreateForm");
const u = require("../utilities");

class QualityForm extends CreateForm {
  constructor(api, quality) {
    super(api);
    this.id = quality.id;
    this.name = quality.name || "New Quality";
    this.startvalue = quality.startvalue || 0;
    this.descriptions = quality.descriptions || [];
    this.labels = quality.labels || [];
    this.category = quality.category || "uncategorized"; 
    this.hidden = quality.hidden || false;
  }

  render() {  
    let form = document.createElement("form");
    form.id = "quality-form";
    form.classList.add("active-form");

    let idLabel = document.createElement("label");
    idLabel.innerText = `ID: ${this.id}`;
    idLabel.classList.add("id-label");
    form.append(idLabel);

    let qualityDiv = document.createElement("div");
    qualityDiv.classList.add("form-section");
    form.append(qualityDiv);

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("remove-button", "delete-button")
    deleteButton.innerText = "Delete Quality."
    deleteButton.addEventListener("click", event => {
      event.preventDefault();
      const confirmation = confirm("This will remove this quality from your world. Any requirements, changes, and challenges that rely on it will be removed as well. This can't be undone.")
      if (confirmation) {
        this.deleteQuality(this.id);
        form.remove();
      } else {
        return;
      }
    });
    qualityDiv.append(deleteButton);

    let {label: nameLabel, input: nameInput} = this.createInput(
      "text",
      "quality",
      "name",
      this.name,
    );
    nameInput.addEventListener("input", this.captureField.bind(this, "name"));
    qualityDiv.append(nameLabel);
    qualityDiv.append(nameInput);
  
    let {label: startLabel, input: startInput} = this.createInput(
      "number",
      "quality",
      "start-value",
      this.startvalue
    );
    startInput.addEventListener("input", this.captureField.bind(this, "startvalue"));
    qualityDiv.append(startLabel);
    qualityDiv.append(startInput);

    let descriptionsLabel = u.create({tag:"label", content: "Descriptions"});
    qualityDiv.append(descriptionsLabel);    
    
    let descriptionsContainer = u.create({tag: "div", classes: ["item-container"]});
    qualityDiv.append(descriptionsContainer);

    for (const description of Object.values(this.descriptions)) {
      let newDescription = this.renderChild("description", description);
      descriptionsContainer.append(newDescription);
    }

    let addDescriptionButton = u.create({tag: "button", classes:["add-button"], content:"+ Add Description"});
    addDescriptionButton.addEventListener("click", event => {
      event.preventDefault();
      const id = this.generateId();
      const newDescription = {
        id,
        value: 1,
        text: "Description text."
      }
      this.descriptions.push(newDescription);
      const renderedDescription = this.renderChild("description", newDescription);
      descriptionsContainer.append(renderedDescription);
    })
    qualityDiv.append(addDescriptionButton);

    qualityDiv.append(u.create({tag:"label", content: "Labels"}));   

    let labelsContainer = u.create({tag: "div", classes: ["item-container"]});
    qualityDiv.append(labelsContainer);
    
    for (const label of Object.values(this.labels)) {
      let newLabel = this.renderChild("label", label);
      labelsContainer.append(newLabel);
    }

    let addLabelButton = u.create({tag: "button", classes:["add-button"], content:"+ Add Label"});
    addLabelButton.addEventListener("click", event => {
      event.preventDefault();
      const id = this.generateId();
      const newLabel = {
        id,
        value: 1,
        text: "Label text."
      }
      this.labels.push(newLabel);
      const renderedLabel = this.renderChild("label", newLabel);
      labelsContainer.append(renderedLabel);
    })
    qualityDiv.append(addLabelButton);

    let {label: catLabel, select: catSelect} = this.createSelect(
      "Category",
      "categories",
      this.id,
    );
    const noneOption = u.create({tag:"option", content:"Uncategorized", value:"uncategorized"});
    catSelect.add(noneOption);
    catSelect.value = this.category;
    catSelect.addEventListener("input", this.captureField.bind(this, "category"));
    qualityDiv.append(catLabel);
    qualityDiv.append(catSelect);
  
    let {label: hiddenLabel, input: hiddenInput} = this.createInput(
      "checkbox",
      "quality",
      "hidden",
      this.hidden
    )
    hiddenInput.addEventListener("input", this.captureCheckbox.bind(this, "hidden"))
    qualityDiv.append(hiddenLabel);
    qualityDiv.append(hiddenInput);
    
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
    const qualityData = {
      id: this.id,
      name: this.name,
      startvalue: this.startvalue,
      descriptions: this.descriptions.sort((a, b) => a.value - b.value),
      labels: this.labels.sort((a, b) => a.value - b.value),
      category: this.category,
      hidden: this.hidden,
    }
    this.api.saveItem(this.id, "qualities", qualityData);
  }

  renderChild(type, data) {
    let div = u.create({tag: "div", classes: ["flex-item"]})
    
    let inputRow = u.create({tag:"div", classes: ["flex-row"]});
    div.append(inputRow);
    
    let valueGroup = u.create({tag: "div", classes: ["input-group"]})
    inputRow.append(valueGroup);
    
    let {input: valueInput, label: valueLabel} = this.createInput(
      "number", 
      "quality",
      "value",
      data.value,
      data.id
    );
    valueInput.addEventListener("input", this.captureField.bind(data, "value"));
    valueGroup.append(valueLabel);
    valueGroup.append(valueInput);  

    let textGroup = u.create({tag: "div", classes: ["input-group"]})
    inputRow.append(textGroup);
    let {input: textInput, label: textLabel} = this.createInput(
      "text", 
      "quality",
      "text",
      data.text,
      data.id
    );
    textInput.addEventListener("input", this.captureField.bind(data, "text"));
    textGroup.append(textLabel);
    textGroup.append(textInput);

    let removeChildButton = u.create({
      tag:"button", 
      classes:["remove-button"], 
      content: `Remove ${type === "description" ? "Description" : "Label"}`
    });
    removeChildButton.addEventListener("click", event => {
      event.preventDefault();
      if (type === "description") {
        this.descriptions = this.descriptions.filter(desc => desc.id !== data.id)
      }
      if (type === "label") {
        this.labels = this.labels.filter(label => label.id !== data.id)
      }
      div.remove();
    });
    div.append(removeChildButton);

    return div;
  }

}

module.exports = QualityForm;