const u = require("../utilities");

const CreateForm = require("./CreateForm");

class ChangeForm extends CreateForm {
  constructor(api, change, removeChange) {
    super(api);
    this.id = change.id;
    this.quality = change.quality || "";
    this.type = change.type || "adjust";
    this.value = change.value || 1;
    this.removeChange = removeChange;

    let logicArray = [];
    for (const logic of change.logic) {
      logicArray.push({
        id: this.generateId(),
        type: logic.type,
        quality: logic.quality,
        min: logic.min,
        max: logic.max
      });
    }
    this.logic = logicArray;
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
    qualityLabel.htmlFor = `result-change-${this.id}-quality`;
    qualityDiv.append(qualityLabel);
  
    let qualitySelect = document.createElement("select");
    qualitySelect.id = `result-change-${this.id}-quality`;
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
    typeLabel.htmlFor = `result-change-${this.id}-type`;
  
    let typeSelect = document.createElement("select");
    typeSelect.id = `result-change-${this.id}-type`;
    
    let setOption = document.createElement("option");
    setOption.value = "set";
    setOption.text = "Set";
    typeSelect.add(setOption);
  
    let adjustOption = document.createElement("option");
    adjustOption.value = "adjust";
    adjustOption.text = "Adjust";
    typeSelect.add(adjustOption);
  
    let randomOption = document.createElement("option");
    randomOption.value = "random";
    randomOption.text = "Random";
    typeSelect.add(randomOption);

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
      `result-change-${this.id}`
    );
    value.addEventListener("input", this.captureField.bind(this, "value"));
    valueDiv.append(valueLabel);
    valueDiv.append(value);
      
    const logicContainer = u.create({tag: "div"});
    change.append(logicContainer);
    
    const addLogicButton = u.create({tag:"button", content: "+ Add Logic", classes:["add-button"]});
    addLogicButton.addEventListener("click", event => {
      event.preventDefault();
      const newLogic = {
        id: this.generateId(), 
        quality: "",
        min: 0,
        max: 0,
        type: "if",
      }
      this.logic.push(newLogic);
      const renderedLogic = this.renderLogic(newLogic);
      logicContainer.append(renderedLogic);
    })

    logicContainer.append(addLogicButton);

    for (const logic of this.logic) {
      const renderedLogic = this.renderLogic(logic);
      logicContainer.append(renderedLogic);
    }

    const removeButton = document.createElement("button");
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

  renderLogic(logic) {
    const logicElement = u.create({tag:"div", classes:["form-section"]});
    const inputGroup = u.create({tag: "div", classes:["flex-row"]})
    logicElement.append(inputGroup);

    const typeGroup = u.create({tag:"div", classes:["input-group"]});
    inputGroup.append(typeGroup);
  
    const typeLabel = u.create({tag:"label", content:"Type"});
    typeLabel.htmlFor = `change-logic-type-${logic.id}`;

    const typeSelect = u.create({tag:"select"});
    typeSelect.id = `change-logic-type-${logic.id}`;

    const ifOption = u.create({tag:"option"});
    ifOption.value = "if";
    ifOption.innerText = "If";
    typeSelect.add(ifOption);

    const unlessOption = u.create({tag:"option"});
    unlessOption.value = "unless";
    unlessOption.innerText = "Unless";
    typeSelect.add(unlessOption);

    typeSelect.value = logic.type || "if";
    typeSelect.addEventListener("input", this.captureField.bind(logic, "type"));

    typeGroup.append(typeLabel);
    typeGroup.append(typeSelect);

    const qualityGroup = u.create({tag:"div", classes:["input-group"]});
    inputGroup.append(qualityGroup);
    const minGroup = u.create({tag:"div", classes:["input-group"]})
    inputGroup.append(minGroup);
    const maxGroup = u.create({tag:"div", classes:["input-group"]})
    inputGroup.append(maxGroup);

    const {label: qualityLabel, select: qualitySelect} = this.createSelect(
      "Quality", 
      "qualities", 
      this.id, 
      logic.id
    );

    qualitySelect.value = logic.quality;
    qualitySelect.addEventListener("input", this.captureField.bind(logic, "quality"));

    qualityGroup.append(qualityLabel);
    qualityGroup.append(qualitySelect);

    const {label: minLabel, input: minInput} = this.createInput(
      "number",
      "change",
      "min",
      logic.min,
      logic.id,
    );
    minInput.addEventListener("input", this.captureField.bind(logic, "min"));
    minInput.value = logic.min;
    minGroup.append(minLabel);
    minGroup.append(minInput);

    const {label: maxLabel, input: maxInput} = this.createInput(
      "number",
      "change",
      "max",
      logic.max,
      logic.id
    );
    maxInput.addEventListener("input", this.captureField.bind(logic, "max"));
    maxInput.value = logic.max;
    maxGroup.append(maxLabel);
    maxGroup.append(maxInput);

    const removeButton = u.create({tag:"button", classes:["remove-button"], content:"Remove Logic"});
    removeButton.addEventListener("click", event => {
      event.preventDefault()
      this.removeFromArray("logic", logic.id);
      logicElement.remove();
    })
    logicElement.append(removeButton);

    return logicElement
  }

  returnData() {
    const logicArray = [];
    for (const logic of this.logic) {
      logicArray.push({
        type: logic.type,
        quality: logic.quality,
        min: logic.min,
        max: logic.max,
      });
    }

    return {
      id: this.id,
      quality: this.quality,
      type: this.type,
      value: this.value,
      logic: logicArray,
    }
  }
}

module.exports = ChangeForm;