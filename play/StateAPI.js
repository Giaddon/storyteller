// Class for managing game state.
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
  start() {
    if (!this.player.context) {
      // If there is no loaded location
      const startingId = Object.values(this.world.storylets).find(storylet => storylet.start).id
      this.enterStorylet(startingId);
    }
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
          qualities[quality.id] = Number(quality.startvalue);
        }
      }
      return {qualities, changes: []} 
    }
  }

  saveGame() {
    try {
      fs.writeFileSync(this.savedDataLocation, JSON.stringify(this.player))
    } catch (error) {
      console.error(error.message);
    }
  }

  adjustQuality(qualityId, value) {
    const newValue = (this.player.qualities[qualityId] || 0) + Number(value);
    if (newValue < 1) {
      delete this.player.qualities[qualityId];
    } else {
      this.player.qualities[qualityId] = newValue;
    }
  }

  setQuality(qualityId, value) {
    if (value < 1) {
      delete this.player.qualities[qualityId]
    } else {
      this.player.qualities[qualityId] = Number(value);
    }
  }

  
  enterStorylet(storyletId) {
    this.player.context = this.getStorylet(storyletId);
    this.player.inStorylet = true;
    return {...this.player.context};
  }
  exitStorylet() {
    this.player.context = this.getCurrentDomain();
    this.player.inStorylet = false;
    return;
  }
  isInStorylet() {
    return this.player.inStorylet;
  }
  enterDomain(id) {
    this.player.domain = this.getDomain(id);
    this.player.context = this.getDomain(id);
    this.player.inStorylet = false;
    return this.player.context;
  }
  exitDomain() {
    delete this.player.domain;
    delete this.player.context
    return
  }
  getCurrentDomain() {
    if (this.player.domain) {
      return {...this.player.domain};
    } else {
      return 
    }
  }
  getContext() {
    return {...this.player.context};
  }
  getStorylet(storyletId) {
    return {...this.world.storylets[storyletId]};
  } 
  getStorylets() {
    return {...this.world.storylets};
   }
  getCategory(id) {
    return {...this.world.categories[id]};
  }
  // getCurrentStorylet() {
  //   if (this.player.storylet) {
  //     return {...this.player.storylet};
  //   } else
  //   return;
  // }
  getDomain(id) {
    if (this.world.domains[id]) {
      return {...this.world.domains[id]};
    } else {
      return;
    }  
  }
  
 
  getCurrentDecks() {
    if (this.player.context && this.player.context.decks) {
      if (Object.values(this.player.context.decks).length > 0) {
        return {...this.player.context.decks};
      }
    }
    return {};
  }
  setResult(result) {
    this.player.result = result
  }
  getResult() {
    if (this.player.result) {
      return {...this.player.result}
    } else {
      return;
    }
  }
  getPlayerQuality(id) {
    return this.player.qualities[id] || 0;
  }
  getPlayerQualities() {
    return {...this.player.qualities}
  }
  getQuality(id) {
    return {...this.world.qualities[id]};
  }
  getQualities() {
    return {...this.world.qualities};
  }
  
  getDomains() {
    return {...this.world.domains};
  }
  addChange(change) {
    this.player.changes.push(change);
  }
  getChanges() {
    return [...this.player.changes];
  }
  clearChanges() {
    this.player.changes = [];
  }
  
}

module.exports = StateAPI;