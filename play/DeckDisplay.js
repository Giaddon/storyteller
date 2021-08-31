const u = require("../utilities");
const Storylet = require("./Storylet");

class DeckDisplay {
  constructor(state) {
    this.state = state;
  }

  render() {
    const deckList = u.create({
      tag:"div", 
      classes:["deck-list"],
      id: "decks",
    })
    const decks = this.state.getCurrentDecks();
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
    const TurnManager = require("./TurnManager");
    const idx = Math.floor(Math.random() * deck.availableStorylets.length);
    const drawnCardId = deck.availableStorylets[idx];
    new TurnManager({state:this.state, result: {changes:[], flow:drawnCardId}});
  }

  evaluateCards(cards) {
    let passingCards = [];
    for (const cardId of cards) {
      const storyletData = this.state.getStorylet(cardId);
      const storylet = new Storylet(storyletData, this.state);
      if (storylet.active) {
        passingCards.push(cardId);
      }
    }
    return passingCards;
  }
}

module.exports = DeckDisplay;