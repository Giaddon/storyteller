const CreateForm = require("./CreateForm");

class QualityForm extends CreateForm {
  constructor(api, quality) {
    super(api);
    this.id = quality.id;
    this.name = quality.name || "New Quality";
    this.startvalue = quality.startvalue || 0;
    this.category = quality.category || ""; 
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
    
    let descriptionsContainer = document.createElement("div");
    descriptionsContainer.id = "quality-descriptions-container";
    qualityDiv.append(descriptionsContainer);
  
    let labelsContainer = document.createElement("div");
    labelsContainer.id = "quality-labels-container";
    qualityDiv.append(labelsContainer);
    
    let {label: catLabel, input: catInput} = this.createInput(
      "text",
      "quality",
      "category",
      this.category
    );
    catInput.addEventListener("input", this.captureField.bind(this, "category"));
    qualityDiv.append(catLabel);
    qualityDiv.append(catInput);
  
    let {label: hiddenLabel, input: hiddenInput} = this.createInput(
      "checkbox",
      "quality",
      "hidden",
      this.hidden
    )
    hiddenInput.addEventListener("input", this.captureField.bind(this, "hidden"))
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
      category: this.category,
      hidden: this.hidden,
    }
    this.saveQuality(this.id, qualityData);
  }

}

module.exports = QualityForm;