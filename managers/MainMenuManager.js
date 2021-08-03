const u = require('../utilities');
const fs = require("fs");
const path = require("path");
const { worldsFolder, profilesFolder } = require("../locations");
const schemas = require('../create/schemas');


class MainMenuManager {
  constructor(profile, passToCreate, passToPlay) {
    this.profileName = profile.profileName;
    this.profileFile = path.join(profilesFolder, profile.profileName, "profile.json");
    this.playing = profile.playing;
    this.creating = profile.creating;
    this.passToCreate = passToCreate;
    this.passToPlay = passToPlay;
  }

  renderMainMenu() {
    const root = document.getElementById("root");
    u.removeChildren(root);

    let canvas = u.create({tag: "div", classes: ["canvas"], id: "canvas"});
    root.append(canvas);

    let mainMenuDiv = u.create({tag: "div", classes: ["flex-column", "main-menu"]});
    canvas.append(mainMenuDiv);

    if (this.playing) {
      let playingLabel = u.create({tag: "p", classes: ["main-menu-small"], content: "now playing"});
      mainMenuDiv.append(playingLabel);

      let gameNameLabel = u.create({tag: "p", classes: ["main-menu-big"], content: this.playing});
      mainMenuDiv.append(gameNameLabel);

      let continueButton = u.create({tag: "button", classes:["main-menu-button"], content: "Continue Game"});
      continueButton.addEventListener("click", this.continuePlaying.bind(this));
      mainMenuDiv.append(continueButton);
    }

    let loadButton = u.create({tag: "button", classes:["main-menu-button"], content: "Load Game"});
    loadButton.addEventListener("click", this.selectPlayWorld.bind(this));
    mainMenuDiv.append(loadButton);

    let playSeperator = u.create({tag: "div", classes:["main-menu-seperator"]});
    mainMenuDiv.append(playSeperator);

    if (this.creating) {
      let editingLabel = u.create({tag: "p", classes: ["main-menu-small"], content: "now editing"});
      mainMenuDiv.append(editingLabel);

      let editingNameLabel = u.create({tag: "p", classes: ["main-menu-big"], content: this.creating});
      mainMenuDiv.append(editingNameLabel);
   
      let editButton = u.create({tag: "button", classes:["main-menu-button"], content: "Continue Editing"});
      editButton.addEventListener("click", this.continueEditing.bind(this));
      mainMenuDiv.append(editButton);
    }

    let selectEditButton = u.create({tag: "button", classes:["main-menu-button"], content: "Select World"});
    selectEditButton.addEventListener("click", this.selectEditWorld.bind(this));
    mainMenuDiv.append(selectEditButton);

    let createButton = u.create({tag: "button", classes:["main-menu-button"], content: "Create New World"});
    createButton.addEventListener("click", this.createNewWorld.bind(this));
    mainMenuDiv.append(createButton);

    let createSeperator = u.create({tag: "div", classes:["main-menu-seperator"]});
    mainMenuDiv.append(createSeperator);
    
    let activeProfileLabel = u.create({tag: "p", classes: ["main-menu-small"], content: "active profile"});
    mainMenuDiv.append(activeProfileLabel);

    let profileNameLabel = u.create({tag: "p", classes: ["main-menu-big"], content: this.profileName});
    mainMenuDiv.append(profileNameLabel);

    let profileButton = u.create({tag: "button", classes:["main-menu-button"], content: "Change Profile"});
    mainMenuDiv.append(profileButton);
  }

  continueEditing(event) {
    event.preventDefault();
    this.passToCreate(this.creating);
  }

  continuePlaying(event) {
    event.preventDefault();
    this.passToPlay(this.playing, this.profileName);
  }

  selectPlayWorld(event) {
    event.preventDefault();
    const worldsList = this.readWorldFolder();
    const {window: worldsWindow, list: buttonList} = this.createListWindow(worldsList);
    for (const button of buttonList) {
      button.addEventListener("click", event => {
        event.preventDefault();
        this.writeToProfileData("playing", event.target.dataset.worldname)
        this.playing = event.target.dataset.worldname;
        this.continuePlaying(event);
      })
    }
    const canvas = document.getElementById("canvas");
    canvas.append(worldsWindow);
  }

  selectEditWorld(event) {
    event.preventDefault();
    const worldsList = this.readWorldFolder();
    const {window: worldsWindow, list: buttonList} = this.createListWindow(worldsList);
    for (const button of buttonList) {
      button.addEventListener("click", event => {
        event.preventDefault();
        this.writeToProfileData("creating", event.target.dataset.worldname)
        this.creating = event.target.dataset.worldname;
        this.renderMainMenu();
      })
    }
    const canvas = document.getElementById("canvas");
    canvas.append(worldsWindow);
  }

  createListWindow(list) {
    const freeze = u.create({tag:"div", classes:["freeze-window"]});
    const listWindow = u.create({tag:"div", classes:["modal-window"]});
    freeze.append(listWindow);
    const itemContainer = u.create({tag:"div", classes:["item-container"]})
    listWindow.append(itemContainer);
    const itemList = [];
    for (const item of list) {
      const itemButton = u.create({tag:"button", content: item, classes:["add-button"]});
      itemButton.dataset.worldname = item;
      itemList.push(itemButton);
      itemContainer.append(itemButton);
    }
    const closeButton = u.create({tag:"button", classes:["remove-button", "edge-button"], content: "Close"});
    closeButton.addEventListener("click", event => {freeze.remove()})
    listWindow.append(closeButton);
    return {window: freeze, list: itemList};
  }

  createNewWorld(event) {
    event.preventDefault();
    const worldNames = this.readWorldFolder();
    console.log(worldNames)
    const {prompt, data, submit} = this.createPrompt("World Name", "Enter a name for your new world:");
    submit.addEventListener("click", event => {
      event.preventDefault();
      const newWorldName = data.input + ".json";
      if (worldNames.includes(newWorldName)){
        
      } else {
        const newWorld = JSON.stringify(schemas.world)
        fs.writeFileSync(path.join(worldsFolder, newWorldName), newWorld);
        this.writeToProfileData("creating", newWorldName);
        this.creating = newWorldName;
        this.renderMainMenu();
      }
    })
    const canvas = document.getElementById("canvas");
    canvas.append(prompt);  
  }

  createPrompt(labelText, promptText) {
    const promptBox = u.create({tag:"div", classes:["modal-window"]});
    const promptMessage = u.create({tag: "p", content: promptText})
    const inputLabel = u.create({tag:"label", classes:["prompt-input"], content: labelText});
    inputLabel.htmlFor = "prompt-input"
    const promptInput = u.create({tag:"input", id: "prompt-input"});
    const submitButton = u.create({tag:"button", content:"Create"});
    const cancelButton = u.create({tag:"button", content:"Cancel"});

    for (const element of [promptMessage, inputLabel, promptInput, submitButton, cancelButton]) {
      promptBox.append(element);
    }

    let promptData = {input: ""}

    promptInput.addEventListener("input", event => {
      promptData.input = event.target.value;
    })

    cancelButton.addEventListener("click", event => {
      event.preventDefault();
      promptBox.remove();
    })

    return {prompt: promptBox, submit: submitButton, data: promptData};
  }

  readWorldFolder() {
    return fs.readdirSync(worldsFolder, {withFileTypes: true}).map(file => file.name);
  }

  readProfileData() {
    try {
      const profileText = fs.readFileSync(this.profileFile);
      return JSON.parse(profileText);
    } catch (error) {
      console.error(error.message);
    }
  }

  writeToProfileData(key, value) {
    const profileData = this.readProfileData();
    profileData[key] = value;
    try {
      fs.writeFileSync(this.profileFile, JSON.stringify(profileData));
    } catch (error) {
      console.error(error.message);
    }
  }

}

module.exports = MainMenuManager;