// Class for reading and writing to the active world json file.
// worldName: (String) filename of the json file.

const path = require("path");
const fs = require("fs");

class StateAPI {
  constructor(worldName) {
    this.source = path.join("worlds", worldName);
  }

  addStorylet(id, storylet) {
    let world = this.getWorld()
    world.storylets[id] = storylet;
    this.setWorld(world);
  }
  removeStorylet(id) {
    let world = this.getWorld()
    delete world.storylets[id];
    this.setWorld(world);
  }
  getWorld() {
    try {
      const rawWorld = fs.readFileSync(this.source);
      return JSON.parse(rawWorld);
    } catch (error) {
      console.error(error.message);
    }
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
      console.log(error.message);
    } finally {
      document.getElementById("storylet-list").dispatchEvent(new CustomEvent("world"));
    }
  }
}

module.exports = StateAPI;