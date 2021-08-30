// Class for managing the play module state.
// worldName: (String) filename of the json file.

const path = require("path");
const fs = require("fs");

class StateAPI {
  constructor(worldName, profileName) {
    this.sourceLocation = path.join(__dirname, "../", "worlds", worldName);
    this.savedDataLocation = path.join(__dirname, "../", "profiles", profileName, `${worldName}-save.json`);
    
    // World data loaded from the json source file.
    this.world = this.loadWorldFromSource()
    Object.freeze(this.world);

    // Player data, saved in the save file.
    this.player = this.loadSavedGame();

    // Data relevant for display, not saved.
    this.display = {};
  }

  // Parses the game json file, returns it. 
  // Should just be done once when the state is created, and the data stored in the world property.
  loadWorldFromSource() {
    try {
      const rawWorld = fs.readFileSync(this.sourceLocation);
      return JSON.parse(rawWorld);
    } catch (error) {
      console.error(error.message);
    }
  }

  // Parses the save file and returns the data.
  // If a save file cannot be found, it starts from scratch.
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
      const startingId = Object.values(this.world.storylets).find(storylet => storylet.start).id
      return {
        qualities,
        domain: null,
        destinations: [],
        context: {
          id: startingId,
          type: "storylet",
        },
      };
    }
  }

  // start() {
  //   if (!this.player.context) {
  //     // If there is no loaded location
  //     const startingId = Object.values(this.world.storylets).find(storylet => storylet.start).id
  //     this.enterStorylet(startingId);
  //   }
  // }

  // Saves the player object as a json file in the active profile's folder. 
  // Run as part of the main cycle.
  saveGame() {
    try {
      fs.writeFileSync(this.savedDataLocation, JSON.stringify(this.player))
    } catch (error) {
      console.error(error.message);
    }
  }

  /** Quality Operations */

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
  getCategory(id) {
    if (this.world.categories[id]) {
      return {...this.world.categories[id]};
    } else {
      return {
        id: "uncategorized",
        order: Infinity,
        title: "Uncategorized",
      }
    }
  }

  adjustQuality(qualityId, value) {
    const newValue = (this.player.qualities[qualityId] || 0) + Number(value);
    const quality = this.getQuality(qualityId);
    const max = Number(quality.max);
    if (newValue < 1) {
      delete this.player.qualities[qualityId];
    } else if (max > 0 && newValue > max) {
      this.player.qualities[qualityId] = max;
    } else {
      this.player.qualities[qualityId] = newValue;
    }
  }

  setQuality(qualityId, value) {
    const quality = this.getQuality(qualityId);
    const max = Number(quality.max);
    if (value < 1) {
      delete this.player.qualities[qualityId]
    } else if (max > 0 && value > max) { 
      this.player.qualities[qualityId] = max;
    } else {
      this.player.qualities[qualityId] = Number(value);
    }
  }

  randomizeQuality(qualityId, value) {
    const quality = this.getQuality(qualityId);
    const max = Number(quality.max) || value
    if (value < 1) {
      delete this.player.qualities[qualityId];
    } else {
      this.player.qualities[qualityId] = Math.ceil(Math.random() * max);
    }
  }

  /** Storylet Operations */
  
  getStorylet(storyletId) {
    return {...this.world.storylets[storyletId]};
  } 
  
  getStorylets() {
    return {...this.world.storylets};
   }

  // getCurrentStorylet() {
  //   if (this.player.storylet) {
  //     return {...this.player.storylet};
  //   } else
  //   return;
  // }
  
  enterStorylet(storyletId) {
    const activeStorylet = this.getStorylet(storyletId);
    if (activeStorylet) {
      this.player.context.id =  storyletId;
      this.player.context.type = "storylet";
      if (activeStorylet.domain) {
        this.player.domain = activeStorylet.domain;
      }
      return {...activeStorylet};
    } else {
      throw new Error("Tried to enter storylet that doesn't exist.");
    }
  }

  exitStorylet() {
    const currentDomain = this.getCurrentDomain()
    if (currentDomain) {
      this.player.context.id = currentDomain.id;
      this.player.context.type = "domain";
    } else {
      throw new Error("Tried to exit storylet with no active domain.")
    }
  }

  /** Domain Operations */
  
  enterDomain(id) {
    const activeDomain = this.getDomain(id);
    if (activeDomain) {
      this.player.domain = activeDomain.id;
      this.player.context.id = activeDomain.id;
      this.player.context.type = "domain";
      if (!activeDomain.locked) {
        this.addDestination(id);
      }
    } else {
      throw new Error("Tried to enter a domain that doesn't exist.")
    }
  }
  
  getDomain(id) {
    if (this.world.domains[id]) {
      return {...this.world.domains[id]};
    } else {
      return;
    }  
  }
  
  getDomains() {
    return {...this.world.domains};
  }

  getCurrentDomain() {
    if (this.player.domain) {
      return {...this.world.domains[this.player.domain]};
    } else {
      return 
    }
  }

  /** Context Operations */

  getContextId() {
    return this.player.context.id;
  }

  getContext() {
    if (this.player.context.type === "storylet") {
      return {...this.world.storylets[this.player.context.id]}
    } else if (this.player.context.type === "domain") {
      return {...this.world.domains[this.player.context.id]}
    }
  }
  
  isInStorylet() {
    return this.player.context.type === "storylet";
  }

  /** Destination Operations */

  getDestinations() {
    return [...this.player.destinations];
  }
  addDestination(domainId) {
    if (!this.player.destinations.includes(domainId)) {
      this.player.destinations.push(domainId);
    }
  }

  /** Deck Operations */

  getCurrentDecks() {
    if (this.player.context.type === "domain") {
      const activeDomain = this.getCurrentDomain();
      return {...activeDomain.decks};
    } else {
      return {}
    }
  }

  /** Display Operations */

  setConclusion(conclusion) {
    this.display.conclusion = conclusion;
  }

  getConclusion() {
    if (this.display.conclusion) {
      return {...this.display.conclusion}
    } else {
      return;
    }
  }
  
  addChange(change) {
    if (!this.display.changes) { 
      this.display.changes = [];
    }
    this.display.changes.push(change);
  }

  getChanges() {
    if (this.display.changes) {
      return [...this.display.changes];
    }
    else return [];
  }

  clearChanges() {
    this.display.changes = [];
  }
  
}

module.exports = StateAPI;