const Option = require("./Option");

class Storylet extends Option {
  constructor({
    id, 
    title, 
    text, 
    order,
    domain, 
    start,
    reqs,
    actions,
    locked,
    results,
  }, api) {
    super(api);
    this.id = id;
    this.title = title;
    this.text = text;
    this.buttonText = text.split(".")[0] + "...";
    this.order = order;
    this.domain = domain;
    this.start = start;
    this.reqs = reqs;
    this.actions = actions;
    this.locked = locked;
    this.results = results;
    const {active, labels, visible} = this.evaluateReqs(this.reqs)
    this.active = active;
    this.labels = labels;
    this.visible = visible;
  } 

}

module.exports = Storylet;
