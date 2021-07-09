const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const u = require('./utilities');

const configFile = path.join(__dirname, 'config.json');
const gamesFolder = path.join(__dirname, 'games');
const profilesFolder = path.join(__dirname, 'profiles');

let configText;
let configData
try {  
  configText = fsSync.readFileSync(configFile);
  configData = JSON.parse(configText);
} catch(error) {
  console.error(error.message);
}

let activeProfile = configData.activeProfile;
console.log(`Active Profile: ${activeProfile}`);

const activeProfileFolder = path.join(profilesFolder, activeProfile);

window.addEventListener('DOMContentLoaded', () => {
  u.on('#games-container', 'click', 'button', loadGame);
  
  document.querySelector('#load-button').addEventListener('click', async event => {
    try {
      let games = await fs.readdir(gamesFolder);
      const gamesContainer = document.querySelector('#games-container');
      u.removeChildren(gamesContainer);
      for (let game of games) {
        const newGame = document.createElement("button")
        newGame.innerText = game;
        gamesContainer.appendChild(newGame);
      }
    } catch (error) {
      console.error(error.message)
    }
  });

});

async function loadGame(event) {
  const gameLocation = path.join(gamesFolder, event.target.innerText);
  const saveFileLocation = path.join(activeProfileFolder, `${event.target.innerText}-save.json`)
  let saveFile;
  try {
    saveFile = await fs.readFile(saveFileLocation)
  } catch(error) {
    console.error(error.message);
  }
  if (saveFile) {
    console.log(JSON.parse(saveFile));
  } else {
    await fs.writeFile(saveFileLocation, '{"data":{}}');
  }
  let gameContent = await fs.readFile(gameLocation, {encoding: 'utf-8'});
  //console.log(gameContent);
}