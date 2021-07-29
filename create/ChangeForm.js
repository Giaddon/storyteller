const CreateForm = require("./CreateForm");

class ChangeForm extends CreateForm {
  constructor(api, change, parentId, removeChange) {
    super(api);
    this.id = change.id;
    this.quality = change.quality || "";
    this.type = change.type || "adjust";
    this.value = change.value || 1;
    this.removeChange = removeChange;
  }

  render() {
    let change = document.createElement("div");
    change.classList.add("flex-column", "form-section", "flex-item");
  
    let detailsSection = document.createElement("div");
    detailsSection.classList.add("flex-row")
    change.append(detailsSection);

    let qualityDiv = document.createElement("div");
    qualityDiv.classList.add("input-group");
    detailsSection.append(qualityDiv);
  
    let qualityLabel = document.createElement("label");
    qualityLabel.innerText = "Quality";
    qualityLabel.htmlFor = `result-${this.parentId}-change-${this.id}-quality`;
    qualityDiv.append(qualityLabel);
  
    let qualitySelect = document.createElement("select");
    qualitySelect.id = `result-${this.parentId}-change-${this.id}-quality`;
    for (const quality of Object.values(this.api.getQualities())) {
      let option = document.createElement("option");
      option.value = quality.id;
      option.text = quality.name;
      qualitySelect.add(option);
    }
    qualitySelect.value = this.quality;
    qualitySelect.addEventListener("change", this.captureField.bind(this, "quality"));
    qualityDiv.append(qualitySelect);
  
    let typeDiv = document.createElement("div");
    typeDiv.classList.add("input-group");
    detailsSection.append(typeDiv);
  
    let typeLabel = document.createElement("label");
    typeLabel.innerText = "Type";
    typeLabel.htmlFor = `result-${this.parentId}-change-${this.id}-type`;
  
    let typeSelect = document.createElement("select");
    typeSelect.id = `result-${this.parentId}-change-${this.id}-type`;
    
    let setOption = document.createElement("option");
    setOption.value = "set";
    setOption.text = "Set";
    typeSelect.add(setOption);
  
    let adjustOption = document.createElement("option");
    adjustOption.value = "adjust";
    adjustOption.text = "Adjust";
    typeSelect.add(adjustOption);
  
    typeSelect.value = this.type
    typeSelect.addEventListener("change", this.captureField.bind(this, "type"));
    typeDiv.append(typeLabel);
    typeDiv.append(typeSelect);
  
    let valueDiv = document.createElement("div");
    valueDiv.classList.add("input-group");
    detailsSection.append(valueDiv);
  
    let {input: value, label: valueLabel} = this.createInput(
      "number", 
      "change", 
      "value", 
      this.value, 
      `result-${this.parentId}-change-${this.id}`
    );
    value.addEventListener("input", this.captureField.bind(this, "value"));
    valueDiv.append(valueLabel);
    valueDiv.append(value);
  
    let removeButton = document.createElement("button");
    removeButton.innerText = "Remove Change";
    removeButton.classList.add("remove-button");
    removeButton.addEventListener("click", event => {
      event.preventDefault()
      this.removeChange(this.id);
      change.remove();
    })
    change.append(removeButton);

    return change;
  }

  returnData() {
    return {
      id: this.id,
      quality: this.quality,
      type: this.type,
      value: this.value,
    }
  }
}

module.exports = ChangeForm;