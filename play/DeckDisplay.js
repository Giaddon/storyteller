const u = require("../utilities");
const Storylet = require("./Storylet");

class DeckDisplay {
  constructor(api, prepareResults) {
    this.api = api;
    this.prepareResults = prepareResults;
  }

  render() {
    const deckList = u.create({tag:"div", classes:["deck-list"]})
    const decks = this.api.getCurrentDecks();
    for (const deck of (Object.values(decks))) {
      const renderedDeck = this.renderDeck(deck);
      if (renderedDeck) {
        deckList.append(renderedDeck);
      }
    }
    return deckList;
  }

  renderDeck(deckData) {
    const deck = u.create({tag:"div", classes:["deck"]});
    deckData.storylets = this.evaluateCards(deckData.storylets);
    if (deckData.storylets.length < 1) {
      deck.remove();
      return;
    }
    const deckLabel = u.create({tag:"h1", classes:["deck-label"], content:deckData.name});
    const cardsCount = u.create({tag:"h1", classes:["card-count"], content:`${deckData.storylets.length} cards available.`});
    deck.addEventListener("click", this.selectDeck.bind(this, deckData))
    deck.append(deckLabel);
    deck.append(cardsCount);
    return deck;
  }

  selectDeck(deck) {
    const idx = Math.floor(Math.random() * deck.storylets.length);
    const drawnCardId = deck.storylets[idx];
    const drawnCard = this.api.enterStorylet(drawnCardId);
    console.log(drawnCard);
    this.prepareResults(drawnCard);
  }

  evaluateCards(cards) {
    let passingCards = [];
    for (const card of cards) {
      const storyletData = this.api.getStorylet(card);
      const storylet = new Storylet(this.api, storyletData);
      if (storylet.active) {
        passingCards.push(card);
      }
    }
    console.log(passingCards);
    return passingCards;
  }
}

module.exports = DeckDisplay;