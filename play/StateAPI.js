// Class for reading the game from the json file and storing the content for play.
// worldName: (String) filename of the json file.

const path = require("path");
const fs = require("fs");

class StateAPI {
  constructor(worldName, profileName) {
    this.sourceLocation = path.join(__dirname, "../", "worlds", worldName);
    this.savedDataLocation = path.join(__dirname, "../", "profiles", profileName, `${worldName}-save.json`);
    this.world = this.loadWorldFromSource()
    this.player = this.loadSavedGame();
  }

  loadWorldFromSource() {
    try {
      const rawWorld = fs.readFileSync(this.sourceLocation);
      return JSON.parse(rawWorld);
    } catch (error) {
      console.error(error.message);
    }
  }

  loadSavedGame() {
    try {
      const rawSave = fs.readFileSync(this.savedDataLocation);
      return JSON.parse(rawSave);
    } catch (error) {
      console.error("Cannot find saved game.", error.message);
      const qualities = {} 
      for (const quality of Object.values(this.world.qualities)) {
        if (quality.startvalue && quality.startvalue > 0) {
          qualities[quality.id] = quality.startvalue;
        }
      }
      return {qualities, storylet: this.getStart()} 
    }
  }

  getStart() {
    const start = Object.values(this.world.storylets).filter(storylet => storylet.start)
    return start[0];
  }
  getPlayerQualities() {
    return {...this.player.qualities}
  }
  getCurrentStorylet() {
    return {...this.player.storylet}
  }
  getPlayerQuality(id) {
    return this.player.qualities[id]
  }
  getQualities() {
    return {...this.world.qualities};
  }
  getQuality(id) {
    return {...this.world.qualities[id]};
  }
  getStorylets() {
   return {...this.world.storylets};
  }

  getDomains() {
    return {...this.world.domains};
  }
  
}

module.exports = StateAPI;