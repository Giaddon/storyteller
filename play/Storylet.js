const Option = require("./Option");

class Storylet extends Option {
  constructor({
    id, 
    title, 
    text, 
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
    this.domain = domain;
    this.start = start;
    this.reqs = reqs;
    this.actions = actions;
    this.locked = locked;
    this.results = results;
    const {active, labels} = this.evaluateReqs(this.reqs)
    this.active = active;
    this.labels = labels
  } 

}

module.exports = Storylet;
