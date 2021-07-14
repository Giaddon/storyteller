let playerQualities = {};
let worldData = {};
let game = {
  inStory: false,
  activeDomain: null,
  activeStory: null,
  previousDomainId: "",
  hands: {},
  activeCard: {
    domainId: "",
    cardId: "",
  },
  window: {
    header: null,
    options: null,
    conclusion: null,
    locked: null,
  }  
}

let actions = {
  getQuality: (qualityId) => playerQualities[qualityId],
  setQuality: (qualityId, value) => {
    playerQualities[qualityId] = value;
    if (playerQualities[qualityId] < 1) {
      delete playerQualities[qualityId];
    }  
  },
  adjustQuality: (qualityId, value) => {
    if (playerQualities[qualityId] === undefined) { 
      playerQualities[qualityId] = 0;
    }
    playerQualities[qualityId] += value;
    if (playerQualities[qualityId] < 1) {
      delete playerQualities[qualityId];
    } 
  },
  setWorldData: (data) => worldData = data,
  getQualityData: (qualityId) => worldData.qualities[qualityId],
  getDomainData: (domainId) => ({...worldData.domains[domainId]}),
  getStoryData: (storyId) => ({...worldData.stories[storyId]}),
  getEventData: (eventId) => ({...worldData.events[eventId]}),
  getActionData: (actionId) => ({...worldData.actions[actionId]}),
  setActiveDomain: (domain) => game.activeDomain = domain,
  getActiveDomain: () => {
    if (game.activeDomain) {
      return {...game.activeDomain};
    } else {
      return null
    }
  },
  setActiveStory: (storyId) => {game.activeStory = storyId},
  getActiveStory: () => game.activeStory,
  setPreviousDomain: (domainId) => {game.previousDomainId = domainId},
  getPreviousDomain: () => game.previousDomainId,
  getHand: (domainId) => game.hands[domainId],
  addCard: (domainId, card) => {
    if (game.hands[domainId]) {
      game.hands[domainId].push(card);
    } else {
      game.hands[domainId] = [card];
    }
  },
  getActiveCard: () => game.activeCard,
  setActiveCard: (domainId, cardId) => {
    game.activeCard.domainId = domainId;
    game.activeCard.cardId = cardId;
  },
  clearActiveCard: () => {
    game.activeCard.domainId = "";
    game.activeCard.cardId = "";
  },
  consumeActiveCard: () => {
    try {
      const {domainId, cardId} = game.activeCard;
      const newHand = game.hands[domainId].filter(card => card.id !== cardId);
      if (newHand.length < 1) {
        delete game.hands[domainId];
      } else {
        game.hands[domainId] = newHand;
      }
    } catch (error) {
      console.error(error.message);
    }
  },
  enterStory: (storyId) => {
    game.inStory = true;
    game.activeStory = storyId;
  },
  exitStory: () => {
    game.inStory = false;
    game.activeStory = null;
  },
  isInStory: () => game.inStory,
  setWindowHeader: (header) => {game.window.header = header},
  getWindowHeader: () => ({...game.window.header}),
  setWindowOptions: (options) => {game.window.options = options},
  getWindowOptions: () => ({...game.window.options}),
  setWindowEvent: (event) => {game.window.event = event},
  getWindowEvent: () => game.window.event,
  setWindowConclusion: (conclusion) => {game.window.conclusion = conclusion},
  setWindowLocked: (boolean) => {game.window.locked = boolean},
  getWindowConclusion: () => game.window.conclusion,
  getWindow: () => game.window,
}

module.exports = { actions };