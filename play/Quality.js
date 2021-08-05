const u = require("../utilities");

class Quality {
  constructor({
    id,
    name,
    startvalue,
    max,
    labels,
    descriptions,
    category,
    hidden
  }, value) {
    this.id = id;
    this.name = name;
    this.startvalue = startvalue;
    this.max = max;
    this.labels = labels;
    this.descriptions = descriptions;
    this.category = category;
    this.hidden = hidden;
    this.value = value;
    this.label = this.getLabel();
    this.description = this.getDescription();
  }

  getLabel() {
    return this.computeText(this.labels, this.value)
  }
  getDescription() {
    return this.computeText(this.descriptions, this.value);
  }

  computeText(textArrays, value) {
    let text;
    for (const item of textArrays) {
      if (Number(item.value) <= value) {
        text = item.text;
      } else {
        break;
      }
    }
    return text;
  }

  render() {
    const qualityElement = u.create({tag:"div", classes:["quality"]});
    const title = u.create({
      tag:"p", 
      classes:["quality-title"], 
      content:`${this.name} • ${this.label || this.value.toString()}${this.max > 0 ? "/"+this.max : ""}`
    });
    qualityElement.append(title);
    const description = u.create({
      tag: "p",
      classes: ["quality-description"],
      content: this.description || "",
    });
    qualityElement.append(description);
    return qualityElement;
  }


}

module.exports = Quality;