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
  state.actions.setWorldData(gameData);
  
  //Set up starting qualities
  for (const [id, quality] of Object.entries(gameData.qualities)) {
    if (quality.startvalue) {
      state.actions.setQuality(id, quality.startvalue);
      if (quality.hidden !== true) {
        renderQuality(id, quality.startvalue);
      }
    }
  }
  //Set up starting story
  let storyId = null;
  for (const story of Object.values(gameData.stories)) {
    if (story.start) {
      storyId = story.id;
      break;
    }
  }
  const results = {
    "traverse": {
      "type": "story",
      "destination": storyId,
    }
  } 
  
  mainCycle(results);
}

/*** CORE GAME LOOP ***/
function mainCycle(results=null) {
  console.log("Cycling with results: ", results)
  
  state.actions.setWindowConclusion(null);
  state.actions.setWindowOptions(null);
  state.actions.setWindowLocked(false);
  
  if (results) {
    if (results.changes && results.changes.length > 0) {
      for (let change of results.changes) {
        handleChange(change);
      }
    }

    if (results.conclusion) {
      const conclusion = prepareWindow(results, results.conclusion)
      state.actions.setWindowConclusion(conclusion);
    }

    if (results.traverse) {
      if (results.traverse.type === "story") {
        state.actions.enterStory(results.traverse.destination);
        const story = loadStory(results.traverse.destination)
        const header = {
          title: story.title,
          text: story.text
        }
        state.actions.setWindowHeader(header);
        state.actions.setWindowOptions(story.actions);
        state.actions.setWindowLocked(story.locked);

      } else if (results.traverse.type === "domain") {
        state.actions.exitStory();
        const domain = loadDomain(results.traverse.destination);
        state.actions.setActiveDomain(domain);
        const header = {
          title: domain.title,
          text: domain.text
        }
        state.actions.setWindowHeader(header);
        state.actions.setWindowOptions(domain.stories);
      }
    } else {
      if (state.actions.isInStory()) {
        const activeStoryId = state.actions.getActiveStory()
        const story = loadStory(activeStoryId)
        const header = {
          title: story.title,
          text: story.text
        }
        state.actions.setWindowHeader(header);
        state.actions.setWindowOptions(story.actions);
        state.actions.setWindowLocked(story.locked);
      } else {
        const activeDomain = state.actions.getActiveDomain()
        const domain = loadDomain(activeDomain.id);
        const header = {
          title: domain.title,
          text: domain.text
        }
        state.actions.setWindowHeader(header);
        state.actions.setWindowOptions(domain.stories);
      }
    }

    let activeDomain = state.actions.getActiveDomain();
    if (activeDomain) {
      if (activeDomain.events && activeDomain.events.length > 0) {
        let activeEvent;
        for (const event of activeDomain.events) {
          const {active} = evaluateReqs(event.reqs);
          if (active) {
            activeEvent = event;
            break;
          }
        }
        if (activeEvent) {
          state.actions.enterStory(activeEvent.id);
          const event = loadEvent(activeEvent.id)
          const header = {
            title: event.title,
            text: event.text
          }
          state.actions.setWindowHeader(header);
          state.actions.setWindowOptions(event.actions);
          state.actions.setWindowLocked(true);
        }
      }
    }
  } // end if results
  renderGame();
}

function renderGame() {
  const eventContainer = document.getElementById("event-container");
  const conclusionContainer = document.getElementById("conclusion-container");
  const headerContainer = document.getElementById("header-container");
  const optionsContainer = document.getElementById('options-container');
  const cardsContainer = document.getElementById('cards-container');
  const drawButtonContainer = document.getElementById("draw-button-container");
  const backButtonContainer = document.getElementById("back-button-container");
  const oldHeader = document.getElementById("header");
  if (oldHeader) { 
    oldHeader.remove();
  }
  u.removeChildren(optionsContainer);
  u.removeChildren(cardsContainer);
  u.removeChildren(backButtonContainer);
  u.removeChildren(drawButtonContainer);
  u.removeChildren(conclusionContainer);
  u.removeChildren(eventContainer);
  
  const {header, options, conclusion, locked} = state.actions.getWindow();

  const headerElement = components.createHeader(header);
  headerContainer.appendChild(headerElement);

  if (conclusion) {
    const {data, changes, changedQualities, challenge} = conclusion;
    let newConclusion = components.createConclusion(data, changes, changedQualities, challenge);
    conclusionContainer.appendChild(newConclusion);
  }
  
  if (options && options.length > 0) {
    for (const option of options) {
      const optionElement = renderOption(option);
      if (optionElement) { // Will be undefined if it doesn't meet requierements and is marked hidden.
        optionsContainer.appendChild(optionElement);
      }
    }
  }

  const activeDomain = state.actions.getActiveDomain();
  if (state.actions.isInStory() && activeDomain && locked !== true) {
    let backButton = components.createBackButton();
    backButton.addEventListener("click", (event) => {
      const results = {
        traverse: {
          type: "domain",
          destination: activeDomain.id,
        }
      }
      mainCycle(results);
    }); // end back button event listener
    backButtonContainer.appendChild(backButton);
  } 

  // const playerDomainValue = state.actions.getQuality('domain');
  // const previousDomain = state.actions.getPreviousDomain();
  // if (!gameState.domain.locked && previousDomain && previousDomain !== playerDomainValue) {


 

  // if (event) {
  //   const {data, changes, changedQualities} = event;
  //   let newEvent = components.createEvent(data, changes, changedQualities);
  //   eventContainer.appendChild(newEvent);
  // }

  // let newDomain = components.createDomain(domain);
  // domainContainer.prepend(newDomain);
  
  // if (domain.actions && domain.actions.length > 0) {
  //   for (const action of domain.actions) {
  //     const newAction = renderAction(action, domain.locked);
  //     if (newAction) {
  //       actionsContainer.appendChild(newAction);
  //     }
  //   }
  // }

  // const hand = state.actions.getHand(domain.id);
  // if (hand) {
  //   for (const card of hand) {
  //     const newCard = renderAction(card, domain.locked);
  //     if (newCard) document.getElementById("cards-container").appendChild(newCard);
  //   }
  // }

  // if (domain.cards && domain.cards.length > 0) {
  //   let cards = [];
  //   if (hand) {
  //     for (const card of domain.cards) {
  //       if (hand.every(h => h.id !== card.id)) {
  //         cards.push(card);
  //       }
  //     }
  //   } else {
  //     cards = domain.cards
  //   }
  //   if (cards.length > 0) {
  //     let drawButton = components.createDrawButton();
  //     drawButton.addEventListener("click", (event) => {
  //       drawCard(domain.id, cards, domain.locked);
  //     }); // end draw button event listener
  //     drawButtonContainer.appendChild(drawButton);
  //   }
  // }

}

function renderOption(option) {
  const optionElement = components.createOption(option.button);
  const {active, labels} = evaluateReqs(option.reqs)

  for (const label of labels) {
    optionElement.querySelector(".option-reqs-container").appendChild(label);
  }

  if (active) { 
    optionElement.setAttribute('tabindex', '0');
    optionElement.addEventListener('click', (event) => { selectOption(option) });
  } else {
    if (option.reqs.hidden) {
      optionElement.remove();
      return;
    }
    optionElement.classList.add('option-disabled');
  }

  if (option.challenge) {
    let playerValue = state.actions.getQuality(option.challenge.quality);
    if (playerValue === undefined) {
      playerValue = 0;
    } 
    let qualityLabel = state.actions.getQualityData(option.challenge.quality).label;
    let chance = option.challenge.difficulty - playerValue;
    if (chance > 6) {
      chance = 0;
    } else if (chance < 2) {
      chance = 100;  
    }
    else {
      chance = Math.round((1/6 * (6 - (chance - 1))) * 100);
    } 
    let challengePhrase = `This is a ${qualityLabel} challenge.\nYour ${qualityLabel} of ${playerValue} gives you a ${chance}% chance of success.`
    let challengeText = document.createElement("p");
    challengeText.innerText = challengePhrase;
    optionElement.querySelector(".option-challenge-container").appendChild(challengeText);
  } // end if challenge

  return optionElement;
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

function selectOption(option) {
  let results;
  if (state.actions.isInStory()) {
    results = option.results
  } else {
    results = {
      traverse: {
        type: "story",
        destination: option.id
      }
    }
  }
    
  if (option.challenge) {
    let result = Math.ceil(Math.random() * 6) + state.actions.getQuality(option.challenge.quality);
    passed = result >= option.challenge.difficulty;
    console.log(`${result} vs. ${option.challenge.difficulty}. ${passed}.`);
    results = passed ? option.results.success : option.results.failure
    results.challenge = {
      passed,
      quality: option.challenge.quality,
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
        const newLabel = components.createOptionReq({label, passed});
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


function loadStory(storyId) {
  let story = state.actions.getStoryData(storyId);
  if (story.actions && story.actions.length > 0) {
    let actions = [];
    for (const actionId of story.actions) {
      actions.push(state.actions.getActionData(actionId));
    }
    story.actions = actions;
  }
  return story;
}

function loadEvent(eventId) {
  let event = state.actions.getEventData(eventId);
  if (event.actions && event.actions.length > 0) {
    let actions = [];
    for (const actionId of event.actions) {
      actions.push(state.actions.getActionData(actionId));
    }
    event.actions = actions;
  }
  return event;
}

function loadDomain(domainId) {
  let domain = state.actions.getDomainData(domainId);
  if (domain.stories && domain.stories.length > 0) {
    let stories = [];
    for (const storyId of domain.stories) {
      stories.push(state.actions.getStoryData(storyId));
    }
    domain.stories = stories;
  }

  if (domain.events && domain.events.length > 0) {
    let events = [];
    for (const eventId of domain.events) {
      events.push(state.actions.getEventData(eventId))
    }
    domain.events = events;
  } 
  
  return domain;
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