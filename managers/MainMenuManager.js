const u = require('../utilities');

class MainMenuManager {
  constructor(profile, passToCreate, passToPlay) {
    this.profileName = profile.profileName;
    this.playing = profile.playing;
    this.creating = profile.creating;
    this.passToCreate = passToCreate;
    this.passToPlay = passToPlay;
  }

  renderMainMenu() {
    const root = document.getElementById("root");

    let canvas = u.create({tag: "div", classes: ["canvas"]});
    root.append(canvas);

    let mainMenuDiv = u.create({tag: "div", classes: ["flex-column", "main-menu"]});
    canvas.append(mainMenuDiv);

    let playingLabel = u.create({tag: "p", classes: ["main-menu-small"], content: "now playing"});
    mainMenuDiv.append(playingLabel);

    let gameNameLabel = u.create({tag: "p", classes: ["main-menu-big"], content: this.playing});
    mainMenuDiv.append(gameNameLabel);

    let continueButton = u.create({tag: "button", classes:["main-menu-button"], content: "Continue Game"});
    continueButton.addEventListener("click", this.continuePlaying.bind(this));
    mainMenuDiv.append(continueButton);

    let loadButton = u.create({tag: "button", classes:["main-menu-button"], content: "Load Game"});
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
    mainMenuDiv.append(selectEditButton);

    let createButton = u.create({tag: "button", classes:["main-menu-button"], content: "Create New World"});
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

}

module.exports = MainMenuManager;