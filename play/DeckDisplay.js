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
    deckData.availableStorylets = this.evaluateCards(deckData.storylets);
    const cardNum = deckData.availableStorylets.length;
    if (cardNum < 1) {
      deck.remove();
      return;
    }
    const deckLabel = u.create({tag:"h1", classes:["deck-label"], content:deckData.name});
    const cardsCount = u.create({tag:"h1", classes:["card-count"], content:`${cardNum} ${cardNum > 1 ? "cards" : "card"} available.`});
    deck.addEventListener("click", this.selectDeck.bind(this, deckData))
    deck.append(deckLabel);
    deck.append(cardsCount);
    return deck;
  }

  selectDeck(deck) {
    const idx = Math.floor(Math.random() * deck.availableStorylets.length);
    const drawnCardId = deck.availableStorylets[idx];
    const drawnCard = this.api.enterStorylet(drawnCardId);
    this.prepareResults(drawnCard);
  }

  evaluateCards(cards) {
    let passingCards = [];
    for (const cardId of cards) {
      const storyletData = this.api.getStorylet(cardId);
      const storylet = new Storylet(storyletData, this.api);
      if (storylet.active) {
        passingCards.push(cardId);
      }
    }
    console.log(passingCards);
    return passingCards;
  }
}

module.exports = DeckDisplay;