const Option = require("./Option");

class Action extends Option {
  constructor({
    id,
    title,
    text,
    reqs,
    results,
    challenges,
    order,
  }, api) {
    super(api);
    this.id = id;
    this.title = title;
    this.text = text;
    this.order = order;
    this.reqs = reqs;
    this.results = results;
    this.challenges = challenges;
    const {active, labels, visible} = this.evaluateReqs(this.reqs)
    this.active = active;
    this.labels = labels;
    this.visible = visible;
  }
}

module.exports = Action;