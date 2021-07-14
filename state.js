let playerQualities = {};
let qualityData = {};
let game = {
  activeDomain: {},
  previousDomainId: "",
  hands: {},
  activeCard: {
    domainId: "",
    cardId: "",
  },
  window: {
    domain: null,
    conclusion: null,
    event: null,
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
  getQualityData: (qualityId) => qualityData[qualityId],
  setQualityData: (data) => {qualityData = data}, 
  setDomain: (domain) => {
    if (Object.keys(game.activeDomain).length > 0) {
      if (game.activeDomain.locked !== true) {
        setPreviousDomain(game.activeDomain.id);
      }
    }
    game.activeDomain = domain
  },
  getDomain: () => game.activeDomain,
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
  setWindowDomain: (domain) => {game.window.domain = domain},
  getWindowDomain: () => game.window.domain,
  setWindowEvent: (event) => {game.window.event = event},
  getWindowEvent: () => game.window.event,
  setWindowConclusion: (conclusion) => {game.window.conclusion = conclusion},
  getWindowConclusion: () => game.window.conclusion,
  getWindow: () => game.window,
}

module.exports = { actions };