const u = require("../utilities");
const Action = require("./Action");
const Storylet = require("./Storylet");

class OptionsDisplay {
  constructor({state}) {
    this.state = state;
    this.contextType = this.state.isInStorylet() ? "storylet" : "domain";
    this.options = this.collectOptions();
  }

  collectOptions() {
    return this.contextType === "storylet"
      ? Object.values(this.state.getContext().actions)
        .map(optionData => new Action(optionData, this.state))
        .sort((a, b) => a.order - b.order)
      : this.state.getContext().storylets
          .map(storyletId => new Storylet(this.state.getStorylet(storyletId), this.state))
          .sort((a, b) => a.order - b.order)
  }

  render() { 
    const optionsList = u.create({
      tag: "div", 
      id: "options-list",
    });
    const activeOptions = u.create({
      tag: "div", 
      classes: ["play-options-list"], 
    });

    const inactiveOptions = u.create({
      tag: "div", 
      classes: ["play-options-list"], 
    });
    
    for (const option of this.options) {
      const renderedOption = option.render();
      if (renderedOption) {
        if (option.active) {
          activeOptions.append(renderedOption)
        } else {
          inactiveOptions.append(renderedOption);
        }
      }
    }

    optionsList.append(activeOptions, inactiveOptions);

    return optionsList
  }
}
module.exports = OptionsDisplay;