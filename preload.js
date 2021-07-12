const { contextBridge } = require('electron')
const fs = require('fs');
const path = require('path');
const state = require('./state');
const story = require('./story');
const u = require('./utilities');
const components = require('./components');

const configFile = path.join(__dirname, 'config.json');
const profilesFolder = path.join(__dirname, 'profiles');
const gamesFolder = path.join(__dirname, 'games');

window.addEventListener('DOMContentLoaded', () => {
  setupToolbar();
  startGame("bluesun.json");
  renderDomain();
})

function getActiveProfile() {
  let configText;
  let configData;
  try {  
    configText = fs.readFileSync(configFile);
    configData = JSON.parse(configText);
  } catch(error) {
    console.error(error.message);
    alert("Error: Failed to read config file.");
    return
  }
  return configData.activeProfile;
}

function parseGameData(gameName) {
  const gameLocation = path.join(__dirname, 'games', gameName);
  let gameData;
  try {  
    const gameRaw = fs.readFileSync(gameLocation);
    gameData = JSON.parse(gameRaw);
  } catch(error) {
    console.error(error.message);
  }
  if (gameData) return gameData;
}

function startGame(gameName) {
  gameData = parseGameData(gameName);

  story.actions.set(gameData.qualities);

  //Setup starting qualities
  for (const [id, quality] of Object.entries(gameData.qualities)) {
    if (quality.startvalue) {
      state.actions.set(id, quality.startvalue);
      if (!quality.hidden) renderQuality(id, quality.startvalue);
    }
  }
}

function renderDomain() {
  const playerDomainValue = state.actions.get('domain');
  const activeDomain = loadDomain(playerDomainValue);
  const actionsContainer = document.getElementById('actions-container');
  
  u.replaceText('domain-title', activeDomain.title);
  u.replaceText('domain-text', activeDomain.text);
  u.removeChildren(actionsContainer);
  
  if (activeDomain.actions && activeDomain.actions.length > 0) {
    for (let action of activeDomain.actions) {
      const newAction = renderAction(action);
      if (newAction) actionsContainer.append(newAction);
    }
  }
}

function renderAction(action) {
  const conclusionContainer = document.getElementById('conclusion-container');
  const newAction = components.createAction(action);

  let reqArray = [];
  if (action.reqs && action.reqs.qualities.length > 0) {
    for (let req of action.reqs.qualities) {
      let playerValue = state.actions.get(req.quality)
      let qualityData = story.actions.get(req.quality);
      let min = req.min || -Infinity;
      let max = req.max || Infinity;
      const passed = (playerValue >= min && playerValue <= max)
      reqArray.push(passed);
      if (!qualityData.hidden) {
        let label = "";
        if (min !== -Infinity) { 
          label += min.toString();
          label += " ≤ ";
        }
        label += req.quality.charAt(0).toUpperCase();
        label += req.quality.substring(1);
        if (max !== Infinity) {
          label += " ≤ "
          label += max.toString();
        }
        const newReq = components.createActionReq({label, passed});
        newAction.querySelector(".action-reqs-container").appendChild(newReq);
      }
    }
  }
  let disabled = false;
  if (action.reqs && action.reqs.type === 'all') {
    if (reqArray.length > 0 && !reqArray.every(passed => passed)) {
      disabled = true;
    }
  } else if (action.reqs && action.reqs.type === 'any') {
    if (reqArray.length > 0 && !reqArray.some(passed => passed)) {
      disabled = true;
    }
  }
  if (disabled) { 
    if (action.reqs.hidden) {
      newAction.remove();
      return;
    }
    newAction.classList.add('action-disabled');
  } else {
    newAction.setAttribute('tabindex', '0');
    
    newAction.addEventListener('click', (event) => {
      u.removeChildren(conclusionContainer);
      
      for (let change of action.results.changes) {
        switch (change.type) {
          case 'set':
            state.actions.set(change.quality, change.value);
            break;
          case 'adjust':
            state.actions.adjust(change.quality, change.value);
            break;
          default:
            console.error('No valid change type found.');
        }
        renderQuality(change.quality, state.actions.get(change.quality));

        if (action.results.conclusion) {
          u.removeChildren(conclusionContainer);
          const conclusion = action.results.conclusion;
          const newConclusion = document.createElement("div");
          const newConclusionTitle = document.createElement("h1");
          const newConclusionText = document.createElement("p");

          newConclusionTitle.innerText = conclusion.title;
          newConclusionText.innerText = conclusion.text;

          newConclusion.appendChild(newConclusionTitle);
          newConclusion.appendChild(newConclusionText);

          conclusionContainer.appendChild(newConclusion);

        }
      }
      renderDomain();
      
    }) // end click event
  } // end if disabled
  return newAction;
}

function loadDomain(domainId) {
  const storyLocation = path.join(__dirname, 'games', "bluesun.json");
  try {
    const storyRaw = fs.readFileSync(storyLocation);
    const storyData = JSON.parse(storyRaw);
    let activeDomain = storyData.domains[domainId];
    let actions = [];
    for (action of activeDomain.actions) {
      actions.push(storyData.actions[action]);
    }
    activeDomain.actions = actions;
    return activeDomain;

  } catch(error) {
    console.error(error.message);
    return;
  }
}


function setupToolbar() {
  const qualitiesContainer = document.getElementById('qualities-container');
  document.getElementById('qualities-button').addEventListener('click', (event) => {
    event.preventDefault();
    qualitiesContainer.classList.toggle('offstage');
  }) // end quality button click handler
}

function renderQuality(qualityId, value) {  
  const quality = story.actions.get(qualityId);
  if (quality.hidden) return;
  
  const qualitiesContainer = document.getElementById('qualities-categories-container');
  const targetQuality = document.getElementById(`qual-${qualityId}`);
  
  let displayValue = value ? value.toString() : null;
  let displayDescription = '';

  if (quality.altValue) {
    const keys = Object.keys(quality.altValue).sort((a, b) => a - b);
    displayValue = quality.altValue[Math.min(value, keys[keys.length - 1])];
  }

  if (quality.description) {
    const keys = Object.keys(quality.description).sort((a, b) => a - b);
    displayDescription = quality.description[Math.min(value, keys[keys.length - 1])];
  }

  if (targetQuality) {
    const parent = targetQuality.parentElement;
    if (!value) {
      targetQuality.remove();
      if (parent.classList.contains('qualities-category') && parent.children.length < 2) {
        parent.remove();
      }
    } else targetQuality.firstElementChild.innerText = `${quality.label} • ${displayValue}`;
  }
  else {
    if (!value) return;

    let parent;
    const category = quality.category || 'Uncategorized';
    let targetCategory = document.getElementById(`cat-${category}`);
    if (targetCategory) {
      parent = targetCategory;
    }
    if (!parent) {
      const newCategory = components.createQualityCategory(category);
      qualitiesContainer.appendChild(newCategory);
      parent = newCategory;
    }
    
    const newQuality = components.createQuality(qualityId, quality.label, displayValue, displayDescription)

    parent.appendChild(newQuality);
  }
}