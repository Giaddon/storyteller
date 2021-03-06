// Class for reading and writing to the active world json file.
// worldName: (String) filename of the json file.

const path = require("path");
const fs = require("fs");

class StateAPI {
  constructor(worldName) {
    this.source = path.join(__dirname, "../", "worlds", worldName);
  }
  saveDetails(details) {
    let world = this.getWorld();
    world.details = details;
    this.setWorld(world);
  }
  getDetails() {
    const world = this.getWorld();
    return {...world.details};
  }
  saveItem (id, type, item) {
    let world = this.getWorld();
    world[type][id] = item;
    this.setWorld(world);
    document.getElementById("item-list").dispatchEvent(new CustomEvent("updatedWorld", {detail: type}));
  }
  saveStorylet(storylet) {
    let world = this.getWorld();
    const oldStorylet = world.storylets[storylet.id]

    if (oldStorylet.domain && oldStorylet.domain !== storylet.domain) {
      world.domains[oldStorylet.domain].storylets = 
        world.domains[oldStorylet.domain].storylets.filter(s => s !== storylet.id); 
    }

    if (storylet.domain) {
      world.domains[storylet.domain].storylets.push(storylet.id);
    }

    world.storylets[storylet.id] = storylet;

    this.setWorld(world);
  }
  deleteStorylet(id) {
    let world = this.getWorld()
    delete world.storylets[id];
    this.setWorld(world);
    document.getElementById("item-list").dispatchEvent(new CustomEvent("updatedWorld", {detail: "storylets"}));
  }
  deleteDomain(id) {
    let world = this.getWorld()
    delete world.domains[id];
    this.setWorld(world);
    document.getElementById("item-list").dispatchEvent(new CustomEvent("updatedWorld", {detail: "domains"}));
  }
  deleteCategory(id) {
    let world = this.getWorld()
    delete world.categories[id];
    this.setWorld(world);
    document.getElementById("item-list").dispatchEvent(new CustomEvent("updatedWorld", {detail: "categories"}));
  }
  getItem(type, id) {
    let world = this.getWorld();
    return world[type][id];
  }
  deleteQuality(id) {
    let world = this.getWorld()
    delete world.qualities[id];
    for (const storylet of Object.values(world.storylets)) {
      let targetReqs = new Set();
      for (const req of storylet.reqs.qualities) {
        if (req.quality === id) {
          targetReqs.add(req.id)
        }  
      }
      storylet.reqs.qualities = storylet.reqs.qualities.filter(req => !targetReqs.has(req.id))
      for (const action of Object.values(storylet.actions)) {
        let targetReqs = new Set();
        for (const req of action.reqs.qualities) {
          if (req.quality === id) {
            targetReqs.add(req.id)
          }  
        }
        action.reqs.qualities = action.reqs.qualities.filter(req => !targetReqs.has(req.id))
        let targetChallenges = new Set();
        for (const challenge of action.challenges) {
          if (challenge.quality === id) {
            targetChallenges.add(challenge.id);
          }
        }
        action.challenges = action.challenges.filter(challenge => !targetChallenges.has(challenge.id));
        for (const result of Object.values(action.results)) {
          let targetChanges = new Set();
          for (const change of result.changes) {
            if (change.quality === id) {
              targetChanges.add(change.id)
            } 
          }
          result.changes = result.changes.filter(change => !targetChanges.has(change.id));
        }
      }
    }

    this.setWorld(world);
    document.getElementById("item-list").dispatchEvent(new CustomEvent("updatedWorld", {detail: "qualities"}));
  }
  getWorld() {
    try {
      const rawWorld = fs.readFileSync(this.source);
      return JSON.parse(rawWorld);
    } catch (error) {
      console.error(error.message);
    }
  }
  getItems(key) {
    let world = this.getWorld();
    return world[key]
  }
  getQualities() {
    try {
      const world = this.getWorld();
      return world.qualities;
    } catch (error) {
      console.error(error.message);
    }
  }
  getStorylets() {
    try {
      const world = this.getWorld();
      return world.storylets;
    } catch (error) {
      console.error(error.message);
    }
  }
  getDomains() {
    try {
      const world = this.getWorld();
      return world.domains;
    } catch (error) {
      console.error(error.message);
    }
  }
  setWorld(world) {
    try {
      const stringWorld = JSON.stringify(world)
      fs.writeFileSync(this.source, stringWorld)
    } catch (error) {
      console.error(error.message);
    }
  }
}

module.exports = StateAPI;