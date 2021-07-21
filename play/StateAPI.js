// Class for reading the game from the json file and storing the content for play.
// worldName: (String) filename of the json file.

const path = require("path");
const fs = require("fs");

class StateAPI {
  constructor(worldName) {
    this.source = path.join(__dirname, "../", "worlds", worldName);
    this.world = this.loadWorldFromSource()
  }

  loadWorldFromSource() {
    try {
      const rawWorld = fs.readFileSync(this.source);
      return JSON.parse(rawWorld);
    } catch (error) {
      console.error(error.message);
    }
  }

  getStart() {
    const start = Object.values(this.world.storylets).filter(storylet => storylet.start)
    return start[0];
  }

  getQualities() {
    return this.world.qualities;
  }
  getStorylets() {
   return this.world.storylets;
  }

  getDomains() {
    return this.world.domains;
  }
  
}

module.exports = StateAPI;