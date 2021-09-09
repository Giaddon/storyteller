const { v4: uuidv4 } = require('uuid');
const u = require("../utilities");


class CreateForm {
  constructor(state) {
    this.state = state
  }

  generateId() {
    return uuidv4();
  }

  
  captureField(field, event) {
    field = field.split(" ");
    if (field.length === 1) {
      this[field[0]] = event.target.value
    }
    if (field.length === 2) {
      this[field[0]][field[1]] = event.target.value
    }
  }

  captureCheckbox(field, event) {
    this[field] = event.target.checked;
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
    input.id = `${formType}-${contentType}${suffix}`;
    input.classList.add(`create-${contentType}`);
    //input.classList.add(`${formType}-${contentType}`);
  
    if (inputType === "checkbox") {
      input.checked = content
    } else {
      input.value = content;
    }
  
    let label = document.createElement("label");
    label.htmlFor = `${formType}-${contentType}${suffix}`;
    label.innerText = `${contentType}`
  
    return {input, label};
  }

  createSelect(labelText, dataType, parentId, id) {
    let label = u.create({tag:"label", content: labelText});
    label.htmlFor = `${dataType}-select-${parentId}-${id}`;
    
    let select = u.create({tag: "select", id: `${dataType}-select-${parentId}-${id}`});
    for (const item of Object.values(this.state.getItems(dataType))) {
      let option = document.createElement("option");
      option.value = item.id;
      option.text = item.name || item.title
      select.add(option);
    }
    return {select, label};
  }

  removeChild(key, childId) {
    delete this[key][childId];
  }

  removeFromArray(arrayName, itemId) {
    if (arrayName === "reqs") {
      this.reqs.qualities = this.reqs.qualities.filter(req => req.id !== itemId);
    }
    else if (arrayName === "changes") {
      this.changes = this.changes.filter(change => change.id !== itemId);
    }
    else if (arrayName === "logic") {
      this.logic = this.logic.filter(l => l.id !== itemId);
    }
  }

  // saveQuality(id, quality) {
  //   this.state.addQuality(id, quality);
  // }
  // deleteStorylet(storyletId) {
  //   this.api.deleteStorylet(storyletId);
  // }
  // deleteQuality(qualityId) {
  //   this.api.deleteQuality(qualityId);
  // }
  // getQualities() {
  //   return this.api.getQualities();
  // }
  // getStorylets() {
  //   return this.api.getStorylets();
  // }
  // getDomains() {
  //   return this.api.getDomains();
  // }

}

module.exports = CreateForm