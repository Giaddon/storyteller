const fs = require('fs');
const path = require('path');
const u = require('./utilities');
const Storyteller = require("./managers/Storyteller");

const storyteller = new Storyteller();

window.addEventListener('DOMContentLoaded', () => {
  storyteller.mainMenuManager.renderMainMenu();
});


// Reads the config file and returns an instance of the menu manager.
// function startup() {
//   try {  
//     const configText = fs.readFileSync(configFile);
//     const configData = JSON.parse(configText);
//     try {
//       const profileText = fs.readFileSync(path.join(profilesFolder, configData.activeProfile, "profile.json"));
//       const profileData = JSON.parse(profileText);
//       return new MainMenuManager(profileData);
//     } catch (error) {
//       console.error(`Cannot read profile file for ${configData.activeProfile}.`, error.message);
//     }
    
//   // Error branch if we can't read the config file, we look to profiles folder to create a new one.
//   } catch(error) {
//     console.log("No config file found, creating default...", error.message);
//     let profilesContents;
//     try {
//       profilesContents = fs.readdirSync(profilesFolder, {withFileTypes: true});
//     } catch (error) {
//       console.log("Cannot find profiles directory, creating default...", error.message);
//       try {
//         fs.mkdirSync(profilesFolder);
//       } catch (error) {
//         console.error("Cannot access filesystem", error.message)
//       }
//     } finally {
//       let profiles = [];
//       if (profilesContents) {
//         for (const item of profilesContents) {
//           if (item.isDirectory()) {
//             profiles.push(item.name);
//           } 
//         }
//       }
//       if (profiles.length < 1) {
//         profiles.push("default");
//         fs.mkdirSync(path.join(profilesFolder, "default"));
//       }
//       const configData = {
//         profiles,
//         activeProfile: profiles[0]
//       }
//       stringConfig = JSON.stringify(configData);
//       fs.writeFileSync(configFile, stringConfig);
//     } 
//   } 
// }


// const CreateManager = require("./create/CreateManager");
// const StateAPI = require("./create/StateAPI");

// TODO
// RESULTS
// - More change logic 
// -- if x then y?
// -- using other qualities numbers?
// -- Change type random (set to a random # within range.)
// QUALITIES
// - Quality types (items vs attribues)?
// - Messages? 
// DOMAINS
// - Figure out event and card implementation. 

// const api = new StateAPI("newworld.json");
// const manager = new CreateManager(api);
// manager.populateSectionList();
