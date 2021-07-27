class Storylet {
  constructor(api, {
    id, 
    title, 
    text, 
    domain, 
    start,
    reqs,
    actions,
    locked,
    results,
  }) {
    this.id = id;
    this.title = title;
    this.text = text;
    this.domain = domain;
    this.start = start;
    this.reqs = reqs;
    this.actions = actions;
    this.locked = locked;
    this.results = results;
    this.api = api;
    
    const {active, labels} = this.evaluateReqs(reqs);
    this.active = active;
    this.labels = labels;
  } 

  evaluateReqs(reqs) {
    if (!reqs || reqs.qualities.length < 1) return {active: true, labels: []}
    let reqArray = [];
    let labels = [];
    for (const req of reqs.qualities) {
      const playerValue = this.api.getPlayerQuality(req.quality);
      const qualityData = this.api.getQuality(req.quality);
      const min = Number(req.min) || -Infinity;
      const max = Number(req.max) || Infinity;
      const passed = (playerValue >= min && playerValue <= max)
      reqArray.push(passed);
      if (qualityData.hidden !== true) {
        let label = "";
        if (min !== -Infinity) { 
          label += min.toString();
          label += " ≤ ";
        }
        label += qualityData.name;
        if (max !== Infinity) {
          label += " ≤ "
          label += max.toString();
        }
      }
    }
    let active = false;
    if (reqArray.length > 0 && reqArray.every(passed => passed)) {
        active = true;
      }
    return {active, labels};
  }


}

module.exports = Storylet;
