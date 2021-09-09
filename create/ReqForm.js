const CreateForm = require("./CreateForm");

class ReqForm extends CreateForm {
  constructor(state, req, parentId, removeReq) {
    super(state);
    this.id = req.id;
    this.quality = req.quality || "";
    this.min = req.min || 0;
    this.max = req.max || -1;
    this.parentId = parentId;
    this.removeReq = removeReq;
  }

  render() {
    let req = document.createElement("div");
    req.classList.add("form-section", "flex-column", "flex-item");
  
    let detailSection = document.createElement("div");
    detailSection.classList.add("flex-row");
    req.append(detailSection);

    let qualityDiv = document.createElement("div");
    qualityDiv.classList.add("input-group");
    detailSection.append(qualityDiv);
  
    let qualityLabel = document.createElement("label");
    qualityLabel.innerText = "Quality";
    qualityLabel.htmlFor = `req-quality-${this.parentId}-${this.id}`;
    qualityDiv.append(qualityLabel);
  
    let qualitySelect = document.createElement("select");
    qualitySelect.id = `req-quality-${this.parentId}-${this.id}`;
    for (const quality of Object.values(this.state.getQualities())) {
      let option = document.createElement("option");
      option.value = quality.id;
      option.text = quality.name;
      qualitySelect.add(option);
    }
    qualitySelect.value = this.quality;
    qualitySelect.addEventListener("change", this.captureField.bind(this, "quality"));
    qualityDiv.append(qualitySelect);

    let minDiv = document.createElement("div");
    minDiv.classList.add("input-group");
    detailSection.append(minDiv);
  
    let {input: min, label: minLabel} = this.createInput(
      "number", 
      "action", 
      "min", 
      this.min, 
      `${this.parentId}-${this.id}`
    );
    min.addEventListener("input", this.captureField.bind(this, "min"));
    minDiv.append(minLabel);
    minDiv.append(min);
  
    let maxDiv = document.createElement("div");
    maxDiv.classList.add("input-group");
    detailSection.append(maxDiv);
  
    let {input: max, label: maxLabel} = this.createInput(
      "number", 
      "action", 
      "max", 
      this.max, 
      `${this.parentId}-${this.id}`
    );
    max.addEventListener("input", this.captureField.bind(this, "max"));
    maxDiv.append(maxLabel);
    maxDiv.append(max);

    let removeButton = document.createElement("button");
    removeButton.innerText = "Remove Requirement";
    removeButton.classList.add("remove-button");
    removeButton.addEventListener("click", event => {
      event.preventDefault()
      this.removeReq(this.id);
      req.remove();
    })
    req.append(removeButton);
  
    return req;
  }

  returnData() {
    return {
      id: this.id,
      quality: this.quality,
      min: this.min,
      max: this.max,
    }
  }
}

module.exports = ReqForm;