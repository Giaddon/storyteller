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
  startGame("bluesun.json");
  mainCycle();
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

/*** CORE GAME LOOP ***/
function mainCycle(results=null) {
  let gameState = {};
  let playerDomainValue = state.actions.get('domain');
  let activeDomain = loadDomain(playerDomainValue);
  
  if (results) {
    for (let change of results.changes) {
      handleChange(change, activeDomain.locked);
    }

    if (results.conclusion) {
      let changedQualities = {};
      let changes = results.changes;
      for (let change of changes) {
        changedQualities[change.quality] = story.actions.get(change.quality);
      }
      gameState.conclusion = {
        data: results.conclusion,
        changes,
        changedQualities,
      }
    }
  }

  playerDomainValue = state.actions.get('domain');
  activeDomain = loadDomain(playerDomainValue);

  let changeDomain = false;
  if (activeDomain.events && activeDomain.events.length > 0) {
    let activeEvent;
    for (const event of activeDomain.events) {
      const {active} = evaluateReqs(event.reqs);
      if (active) {
        activeEvent = event;
        break;
      }
    } // end event loop
    if (activeEvent) {
      let results = activeEvent.results
      let changes = results.changes;
      let changedQualities = {};
      for (let change of changes) {
        changedQualities[change.quality] = story.actions.get(change.quality);
        handleChange(change, activeDomain.locked);
        if (change.quality === 'domain') {
          changeDomain = true;
        }
      }
      
      gameState.event = {
        data: activeEvent,
        changes,
        changedQualities,
      }
    } // end if activeEvent
  } // end if events
  
  if (changeDomain) {
    playerDomainValue = state.actions.get('domain');
    activeDomain = loadDomain(playerDomainValue);
  }

  gameState.domain = activeDomain;
  
  renderGame(gameState);
}

function renderGame(gameState) {
  const conclusionContainer = document.getElementById("conclusion-container");
  const eventContainer = document.getElementById("event-container");
  const domainContainer = document.getElementById("domain-container");
  const actionsContainer = document.getElementById('actions-container');
  const backButtonContainer = document.getElementById("back-button-container");
  
  const oldDomain = document.getElementById("domain");
  if (oldDomain) oldDomain.remove();
  u.removeChildren(actionsContainer);
  u.removeChildren(backButtonContainer);
  u.removeChildren(conclusionContainer);
  u.removeChildren(eventContainer);
  
  const playerDomainValue = state.actions.get('domain');
  const previousDomain = state.actions.getPreviousDomain();
  if (!gameState.domain.locked && previousDomain && previousDomain !== playerDomainValue) {
    let backButton = components.createBackButton();
    backButton.addEventListener("click", (event) => {
      state.actions.setPreviousDomain(playerDomainValue);
      state.actions.set('domain', previousDomain);
      mainCycle();
    }); // end back button event listener
    backButtonContainer.appendChild(backButton);
  } 

  if (gameState.conclusion) {
    const {data, changes, changedQualities} = gameState.conclusion;
    let newConclusion = components.createConclusion(data, changes, changedQualities);
    conclusionContainer.appendChild(newConclusion);
  }

  if (gameState.event) {
    const {data, changes, changedQualities} = gameState.event;
    let newEvent = components.createEvent(data, changes, changedQualities);
    eventContainer.appendChild(newEvent);
  }

  let newDomain = components.createDomain(gameState.domain);
  domainContainer.prepend(newDomain);
  
  if (gameState.domain.actions && gameState.domain.actions.length > 0) {
    for (let action of gameState.domain.actions) {
      const newAction = renderAction(action, gameState.domain.locked);
      if (newAction) actionsContainer.append(newAction);
    }
  }
}

function renderAction(action, domainLock = false) {
  const newAction = components.createAction(action);
  
  if (action.challenge) {
    let playerValue = state.actions.get(action.challenge.quality);
    if (!playerValue) playerValue = 0;
    let qualityLabel = story.actions.get(action.challenge.quality).label;
    let chance = action.challenge.value - playerValue;
    if (chance > 6) chance = 0;
    else if (chance < 2) chance = 100;  
    else chance = Math.round((1/6 * (6 - (chance - 1))) * 100)
    let challengePhrase = `This is a ${qualityLabel} challenge.\nYour ${qualityLabel} of ${playerValue} gives you a ${chance}% chance of success.`
    let newChallengeText = document.createElement("p");
    newChallengeText.innerText = challengePhrase;
    newAction.querySelector(".action-challenge-container").appendChild(newChallengeText);
  } // end if challenge

    const {active, labels} = evaluateReqs(action.reqs)
    
    for (const label of labels) {
      newAction.querySelector(".action-reqs-container").appendChild(label);
    }

    if (active) { 
      newAction.setAttribute('tabindex', '0');
      newAction.addEventListener('click', (event) => { selectAction(action) });
  } else {
    if (action.reqs.hidden) {
      newAction.remove();
      return;
    }
    newAction.classList.add('action-disabled');
  }

  return newAction;
}

/*** HELPER FUNCTIONS ***/

function selectAction(action) {
  let results = action.results
    if (action.challenge) {
      let result = Math.ceil(Math.random() * 6) + state.actions.get(action.challenge.quality);
      passed = result >= action.challenge.value ? true : false;
      console.log(`${result} vs. ${action.challenge.value}. ${passed}.`);
      results = passed ? action.results.success : action.results.failure
    }

    mainCycle(results);
}

function evaluateReqs(reqs) {
  if (!reqs) return {active: true, labels: []}
  
  let reqArray = [];
  let labels = [];
  if (reqs && reqs.qualities.length > 0) {
    for (let req of reqs.qualities) {
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
        const newLabel = components.createActionReq({label, passed});
        labels.push(newLabel);
      }
    }
  }
  let active = false;
  if (reqs.type === 'all') {
    if (reqArray.length > 0 && reqArray.every(passed => passed)) {
      active = true;
    }
  } else if (reqs.type === 'any') {
    if (reqArray.length > 0 && reqArray.some(passed => passed)) {
      active = true;
    }
  }

  return {active, labels};
}

function loadDomain(domainId) {
  const storyLocation = path.join(__dirname, 'games', "bluesun.json");
  try {
    const storyRaw = fs.readFileSync(storyLocation);
    const storyData = JSON.parse(storyRaw);
    let activeDomain = storyData.domains[domainId];
    
    let actions = [];
    for (const actionId of activeDomain.actions) {
      actions.push(storyData.actions[actionId]);
    }
    activeDomain.actions = actions;
    
    if (activeDomain.events && activeDomain.events.length > 0) {
      let events = [];
      for (const eventId of activeDomain.events) {
        events.push(storyData.events[eventId])
      }
      activeDomain.events = events;
    } 
    
    return activeDomain;

  } catch(error) {
    console.error(error.message);
    return;
  }
}

function handleChange(change, domainLock) {
  if (change.quality === 'domain' && !domainLock ) {
    state.actions.setPreviousDomain(state.actions.get('domain'));
  };
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
    if (!value || value === 0) {
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

function setupToolbar() {
  const qualitiesContainer = document.getElementById('qualities-container');
  document.getElementById('qualities-button').addEventListener('click', (event) => {
    event.preventDefault();
    qualitiesContainer.classList.toggle('offstage');
  }) // end quality button click handler
}