const u = require("../utilities");
const TurnManager = require("./TurnManager");

class Quality {
  constructor({
    id,
    name,
    startvalue,
    max,
    labels,
    descriptions,
    category,
    storylet,
    hidden
  }, value, inStorylet, state) {
    this.id = id;
    this.name = name;
    this.startvalue = startvalue;
    this.max = max;
    this.labels = labels;
    this.descriptions = descriptions;
    this.category = category;
    this.storylet = storylet;
    this.hidden = hidden;
    this.value = value;
    this.label = this.getLabel();
    this.description = this.getDescription();
    this.inStorylet = inStorylet;
    this.state = state;
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
    const qualityElement = u.create({tag:"div", classes:["play-quality"], id:`q-${this.id}`});
    const title = u.create({
      tag:"h1", 
      content:`${this.name} • ${this.label || this.value.toString()}${this.max > 0 ? "/"+this.max : ""}`
    });
    qualityElement.append(title);
    const description = u.create({
      tag: "p",
      content: this.description || "",
    });
    qualityElement.append(description);

    if (
      this.storylet !== "none" &&
      this.state.isInStorylet() === false
    ) {
      qualityElement.setAttribute('tabindex', '0');
      qualityElement.classList.add("play-active-quality");
      qualityElement.addEventListener("click", event => {
        new TurnManager({state:this.state, result:{changes:[], flow:this.storylet}});
      })
    }
    return qualityElement;
  }




}

module.exports = Quality;