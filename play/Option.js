const u = require("../utilities");

class Option {
  constructor(state) {
    this.state = state;
  }
  evaluateReqs(reqs) {
    if (!reqs || reqs.qualities.length < 1) return {active: true, labels: []}
    let reqArray = [];
    let labels = [];
    if (reqs && reqs.qualities.length > 0) {
      for (const req of reqs.qualities) {
       
        const playerValue = this.state.getPlayerQuality(req.quality);
        const qualityData = this.state.getQuality(req.quality);
        const min = Number(req.min) < 0 ? -Infinity : Number(req.min);
        const max = Number(req.max) < 0 ? Infinity : Number(req.max);
        console.log("Reqs for: ", this.title, playerValue, min, max);
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
          const newLabel = this.renderOptionReq({label, passed});
          labels.push(newLabel);
        }
      }
    }
    let active = false;
    if (reqArray.length > 0 && reqArray.every(passed => passed)) {
      active = true;
    }
    let visible = false;
    if (reqs.visibility === "always") {
      visible = true;
    } else if (reqs.visibility === "all") {
      if (reqArray.length > 0 && reqArray.every(passed => passed)) {
        visible = true;
      }
    } else if (reqs.visibility === "any") {
      if (reqArray.length > 0 && reqArray.some(passed => passed)) {
        visible = true;
      }
    }
    return {active, labels, visible};
  }

  renderOptionReq(reqData) {
    const req = u.create({tag:'div', classes:["option-req"]});
    const label = u.create({tag:'h1', content: reqData.label});
    req.appendChild(label);
  
    if (!reqData.passed) {
      req.classList.add('req-disabled');
    }
  
    return req;
  }

}

module.exports = Option