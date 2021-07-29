const Context = require("./Context");


class Domain extends Context {
  constructor({id, title, text, storylets, decks}, prepareResults) {
    super(prepareResults);
    this.id = id;
    this.title = title;
    this.text = text;
    this.storylets = storylets;
    this.decks = decks;
  }
}

module.exports = Domain;