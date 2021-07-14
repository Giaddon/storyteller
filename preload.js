const fs = require('fs');
const path = require('path');

const state = require('./state');
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
  state.actions.setQualityData(gameData.qualities);
  //Setup starting qualities
  for (const [id, quality] of Object.entries(gameData.qualities)) {
    if (quality.startvalue) {
      state.actions.setQuality(id, quality.startvalue);
      if (quality.hidden !== true) {
        renderQuality(id, quality.startvalue);
      }
    }
  }
}

/*** CORE GAME LOOP ***/
function mainCycle(results=null) {
  state.actions.setWindowConclusion(null);
  state.actions.setWindowEvent(null);

  if (results) {
    for (let change of results.changes) {
      handleChange(change);
    }

    if (results.conclusion) {
      const conclusion = prepareWindow(results, results.conclusion)
      state.actions.setWindowConclusion(conclusion);
    }
  }

  let playerDomainValue = state.actions.getQuality('domain');
  let activeDomain = loadDomain(playerDomainValue);

  let changeDomain = false;
  let activeEvent = null;
  if (activeDomain.events && activeDomain.events.length > 0) {
    for (const event of activeDomain.events) {
      const {active} = evaluateReqs(event.reqs);
      if (active) {
        activeEvent = event;
        break;
      }
    } // end event loop
    
    if (activeEvent) {
      const results = activeEvent.results
      const changes = results.changes;
      for (let change of changes) {
        handleChange(change);
        if (change.quality === 'domain') {
          changeDomain = true;
        }
      }
      activeEvent = prepareWindow(results, activeEvent);
      state.actions.setWindowEvent(activeEvent);
    } 
  }
  
  
  if (changeDomain) {
    playerDomainValue = state.actions.getQuality('domain');
    activeDomain = loadDomain(playerDomainValue);
  }

  state.actions.setWindowDomain(activeDomain);
  
  renderGame();
}

function renderGame() {
  const eventContainer = document.getElementById("event-container");
  const conclusionContainer = document.getElementById("conclusion-container");
  const domainContainer = document.getElementById("domain-container");
  const actionsContainer = document.getElementById('actions-container');
  const cardsContainer = document.getElementById('cards-container');
  const drawButtonContainer = document.getElementById("draw-button-container");
  const backButtonContainer = document.getElementById("back-button-container");
  const oldDomain = document.getElementById("domain");
  if (oldDomain) { 
    oldDomain.remove();
  }
  u.removeChildren(actionsContainer);
  u.removeChildren(cardsContainer);
  u.removeChildren(backButtonContainer);
  u.removeChildren(drawButtonContainer);
  u.removeChildren(conclusionContainer);
  u.removeChildren(eventContainer);
  
  const {domain, conclusion, event} = state.actions.getWindow();

  // const playerDomainValue = state.actions.getQuality('domain');
  // const previousDomain = state.actions.getPreviousDomain();
  // if (!gameState.domain.locked && previousDomain && previousDomain !== playerDomainValue) {
  //   let backButton = components.createBackButton();
  //   backButton.addEventListener("click", (event) => {
  //     state.actions.setPreviousDomain(playerDomainValue);
  //     state.actions.setQuality('domain', previousDomain);
  //     mainCycle();
  //   }); // end back button event listener
  //   backButtonContainer.appendChild(backButton);
  // } 

  if (conclusion) {
    const {data, changes, changedQualities, challenge} = conclusion;
    let newConclusion = components.createConclusion(data, changes, changedQualities, challenge);
    conclusionContainer.appendChild(newConclusion);
  }

  if (event) {
    const {data, changes, changedQualities} = event;
    let newEvent = components.createEvent(data, changes, changedQualities);
    eventContainer.appendChild(newEvent);
  }

  let newDomain = components.createDomain(domain);
  domainContainer.prepend(newDomain);
  
  if (domain.actions && domain.actions.length > 0) {
    for (const action of domain.actions) {
      const newAction = renderAction(action, domain.locked);
      if (newAction) {
        actionsContainer.appendChild(newAction);
      }
    }
  }

  const hand = state.actions.getHand(domain.id);
  if (hand) {
    for (const card of hand) {
      const newCard = renderAction(card, domain.locked);
      if (newCard) document.getElementById("cards-container").appendChild(newCard);
    }
  }

  if (domain.cards && domain.cards.length > 0) {
    let cards = [];
    if (hand) {
      for (const card of domain.cards) {
        if (hand.every(h => h.id !== card.id)) {
          cards.push(card);
        }
      }
    } else {
      cards = domain.cards
    }
    if (cards.length > 0) {
      let drawButton = components.createDrawButton();
      drawButton.addEventListener("click", (event) => {
        drawCard(domain.id, cards, domain.locked);
      }); // end draw button event listener
      drawButtonContainer.appendChild(drawButton);
    }
  }

}

function renderAction(action) {
  const newAction = components.createAction(action);
  
  if (action.challenge) {
    let playerValue = state.actions.getQuality(action.challenge.quality);
    if (!playerValue) playerValue = 0;
    let qualityLabel = state.actions.getQualityData(action.challenge.quality).label;
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

function prepareWindow(results, data) {
  let changedQualities = {};
  const changes = results.changes;
  for (const change of changes) {
    changedQualities[change.quality] = state.actions.getQualityData(change.quality);
  }
  if (results.challenge) {
    changedQualities[results.challenge.quality] = state.actions.getQualityData(results.challenge.quality);
  }
  const window = {
    data: data,
    changes,
    changedQualities,
    challenge: results.challenge
  }  

  return window;
}

function drawCard(domainId, cards) {
  const cardIdx = Math.floor(Math.random() * cards.length);
  const card = cards[cardIdx];
  state.actions.addCard(domainId, card);
  mainCycle();
}

function selectAction(action) {
  let results = action.results;
  if (action.challenge) {
    let result = Math.ceil(Math.random() * 6) + state.actions.getQuality(action.challenge.quality);
    passed = result >= action.challenge.value;
    console.log(`${result} vs. ${action.challenge.value}. ${passed}.`);
    results = passed ? action.results.success : action.results.failure
    results.challenge = {
      passed,
      quality: action.challenge.quality,
    }
  }

  // if (action.type === "card") {
  //   const domainId = state.actions.getWindowDomain().id;
  //   state.actions.setActiveCard(domainId, action.id);


  // }

  // if (action.results.changes.every(change => change.quality !== "domain")) {
  //   if (action.type === "card") {
  //   state.actions.consumeActiveCard();
  // }
  //   } else {
  //   const activeCard = 

  //   }
  // }

  
  
  mainCycle(results);
}

function evaluateReqs(reqs) {
  if (!reqs) return {active: true, labels: []}
  
  let reqArray = [];
  let labels = [];
  if (reqs && reqs.qualities.length > 0) {
    for (const req of reqs.qualities) {
      const playerValue = state.actions.getQuality(req.quality)
      const qualityData = state.actions.getQualityData(req.quality);
      const min = req.min || -Infinity;
      const max = req.max || Infinity;
      const passed = (playerValue >= min && playerValue <= max)
      reqArray.push(passed);
      if (qualityData.hidden !== true) {
        let label = "";
        if (min !== -Infinity) { 
          label += min.toString();
          label += " ≤ ";
        }
        label += qualityData.label;
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
  const storyFile = path.join(__dirname, 'games', "bluesun.json");
  try {
    const storyRaw = fs.readFileSync(storyFile);
    const storyData = JSON.parse(storyRaw);
    let activeDomain = storyData.domains[domainId];
    
    if (activeDomain.actions && activeDomain.actions.length > 0) {
      let actions = [];
      for (const actionId of activeDomain.actions) {
        actions.push(storyData.actions[actionId]);
      }
      activeDomain.actions = actions;
    }

    if (activeDomain.events && activeDomain.events.length > 0) {
      let events = [];
      for (const eventId of activeDomain.events) {
        events.push(storyData.events[eventId])
      }
      activeDomain.events = events;
    } 
    
    if (activeDomain.cards && activeDomain.cards.length > 0) {
      let cards = [];
      for (const cardId of activeDomain.cards) {
        cards.push(storyData.actions[cardId])
      }
      activeDomain.cards = cards;
    } 

    return activeDomain;

  } catch(error) {
    console.error(error.message);
    return;
  }
}

function handleChange(change) {
  switch (change.type) {
    case 'set':
      state.actions.setQuality(change.quality, change.value);
      break;
    case 'adjust':
      state.actions.adjustQuality(change.quality, change.value);
      break;
    default:
      console.error('No valid change type found.');
  }
  renderQuality(change.quality, state.actions.getQuality(change.quality));
}

function renderQuality(qualityId, value) {  
  const quality = state.actions.getQualityData(qualityId);
  if (quality.hidden) {
    return;
  }
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
    if (value === undefined || value < 1) {
      targetQuality.remove();
      if (parent.classList.contains('qualities-category') && parent.children.length < 2) {
        parent.remove();
      }
    } else targetQuality.firstElementChild.innerText = `${quality.label} • ${displayValue}`;
  }
  else {
    if (value === undefined || value < 1) {
      return;
    } 

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