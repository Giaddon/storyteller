const fs = require('fs');
const path = require('path');
const MainMenuManager = require("./MainMenuManager");
const CreateManager = require('./CreateManager');
const PlayManager = require('./PlayManager');
const CreateStateAPI = require("../create/StateAPI");
const PlayStateAPI = require("../play/StateAPI");

const configFile = path.join(__dirname, "../", 'config.json');
const worldsFolder = path.join(__dirname, "../", 'worlds');
const profilesFolder = path.join(__dirname, "../", 'profiles');

class Storyteller {
  constructor() {
    const profileData = this.startup()
    this.mainMenuManager = new MainMenuManager(profileData, this.passToCreate.bind(this), this.passToPlay.bind(this))
    this.playManager;
    this.createManager;
  }

  startup() {
    try {  
      const configText = fs.readFileSync(configFile);
      const configData = JSON.parse(configText);
      try {
        const profileText = fs.readFileSync(path.join(profilesFolder, configData.activeProfile, "profile.json"));
        const profileData = JSON.parse(profileText);
        return profileData;
      } catch (error) {
        console.error(`Cannot read profile file for ${configData.activeProfile}.`, error.message);
      }
      
    // Error branch if we can't read the config file, we look to profiles folder to create a new one.
    } catch(error) {
      console.log("No config file found, creating default...", error.message);
      let profilesContents;
      try {
        profilesContents = fs.readdirSync(profilesFolder, {withFileTypes: true});
      } catch (error) {
        console.log("Cannot find profiles directory, creating default...", error.message);
        try {
          fs.mkdirSync(profilesFolder);
        } catch (error) {
          console.error("Cannot access filesystem", error.message)
        }
      } finally {
        let profiles = [];
        if (profilesContents) {
          for (const item of profilesContents) {
            if (item.isDirectory()) {
              profiles.push(item.name);
            } 
          }
        }
        if (profiles.length < 1) {
          profiles.push("default");
          fs.mkdirSync(path.join(profilesFolder, "default"));
        }
        const configData = {
          profiles,
          activeProfile: profiles[0]
        }
        stringConfig = JSON.stringify(configData);
        fs.writeFileSync(configFile, stringConfig);
      } 
    } 
  }

  passToCreate(createWorldName) {
    this.createManager = new CreateManager(new CreateStateAPI(createWorldName));
    this.createManager.startupCreate();
  }

  passToPlay(playWorldName) {
    this.playManager = new PlayManager(new PlayStateAPI(playWorldName));
    this.playManager.startupPlay();
  }


}

module.exports = Storyteller;