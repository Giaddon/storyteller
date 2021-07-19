class CreateForm {
  constructor() {
    
  }

  captureField(field, event) {
    field = field.split(" ");
    if (field.length === 1) {
      this[field[0]] = event.target.value;
    }
    if (field.length === 2) {
      this[field[0]][field[1]] = event.target.value
    }
  }

  createInput(inputType, formType, contentType, content, suffix = "") {
    let input;
    if (suffix === undefined) {
      suffix = "";
    }
    if (inputType === "text") {
      input = document.createElement("input");
      input.type = "text";
    }
    else if (inputType === "textarea") {
      input = document.createElement("textarea");
    }
    else if (inputType === "checkbox") {
      input = document.createElement("input");
      input.type = "checkbox";
    }
    else if (inputType === "number") {
      input = document.createElement("input");
      input.type = "number";
    }
    input.id = `${formType}-${contentType}-${suffix}`;
    input.classList.add(`${formType}-${contentType}`);
  
    if (inputType === "checkbox") {
      input.checked = content
    } else {
      input.value = content;
    }
  
    let label = document.createElement("label");
    label.htmlFor = `${formType}-${contentType}-${suffix}`;
    label.innerText = `${contentType}`
  
    return {input, label};
  }

  removeChild(key, childId) {
    delete this[key][childId];
  }

  removeReq(reqId) {
    this.reqs.qualities = this.reqs.qualities.filter(change => change.id !== reqId);
  }
}

module.exports = CreateForm