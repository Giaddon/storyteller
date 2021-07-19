const CreateForm = require("./CreateForm");
const state = require("./createState");

class ReqForm extends CreateForm {
  constructor(req, parentId, removeReq) {
    super();
    this.id = req.id;
    this.quality = req.quality || "";
    this.min = req.min || 0;
    this.max = req.max || 0;
    this.parentId = parentId;
    this.removeReq = removeReq;
  }

  render() {
    let req = document.createElement("div");
    req.classList.add("req");
  
    let qualityDiv = document.createElement("div");
    qualityDiv.classList.add("req-group");
    req.append(qualityDiv);
  
    let qualityLabel = document.createElement("label");
    qualityLabel.innerText = "Quality";
    qualityLabel.htmlFor = `req-quality-${this.parentId}-${this.id}`;
    qualityDiv.append(qualityLabel);
  
    let qualitySelect = document.createElement("select");
    qualitySelect.id = `req-quality-${this.parentId}-${this.id}`;
    for (const quality of Object.values(state.actions.getQualities())) {
      let option = document.createElement("option");
      option.value = quality.id;
      option.text = quality.name;
      qualitySelect.add(option);
    }
    qualitySelect.value = this.quality;
    qualitySelect.addEventListener("change", this.captureField.bind(this, "quality"));
    qualityDiv.append(qualitySelect);

    let minDiv = document.createElement("div");
    minDiv.classList.add("req-group");
    req.append(minDiv);
  
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
    maxDiv.classList.add("req-group");
    req.append(maxDiv);
  
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
    removeButton.addEventListener("click", event => {
      event.preventDefault()
      this.removeReq(this.id);
      req.remove();
    })
    req.append(removeButton);
  
    return req;
  }
}

module.exports = ReqForm;