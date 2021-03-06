const CreateForm = require("./CreateForm");
const u = require("../utilities");

class DomainForm extends CreateForm {
  constructor(state, domain) {
    super(state);
    this.id = domain.id;
    this.title = domain.title || "New Domain";
    this.text = domain.text || "Domain text.";
    this.locked = domain.locked || false;
    this.destination = domain.destination ? true : false;
    this.storylets = domain.storylets 
      ? domain.storylets.map(storyletId => ({id: this.generateId(), storylet: storyletId}))
      : []
    this.events = domain.events
      ? domain.events.map(eventId => ({id: this.generateId(), event: eventId}))
      : []

    const processedDecks = domain.decks ? {...domain.decks} : {}
    for (const deck of Object.values(processedDecks)) {
      deck.storylets = deck.storylets.map(storyletId => { return ({id: this.generateId(), storylet: storyletId})} )
    }
    this.decks = processedDecks;
  }

  render() {
    const form = u.create({tag:"form", classes:["active-form"]});
    
    let idLabel = u.create({tag:"p", content: `ID: ${this.id}`, classes:["id-label"]});
    form.append(idLabel);
    
    const headerSection = u.create({tag: "div", classes:["form-section", "flow-column"]});
    form.append(headerSection);

    let deleteButton = u.create({tag: "button", classes:["remove-button", "delete-button"], content: "Delete Domain."});
    deleteButton.addEventListener("click", event => {
      event.preventDefault();
      const confirmation = confirm("This will remove this domain from your world. Linked storylets will not be affected. It can't be undone.")
      if (confirmation) {
        this.state.deleteDomain(this.id);
        form.remove();
      } else {
        return;
      }
    });
    headerSection.append(deleteButton);

    const {input: titleInput, label: titleLabel} = this.createInput("text", "domain", "title", this.title)
    titleInput.addEventListener("input", this.captureField.bind(this, "title"));
    headerSection.append(titleLabel);
    headerSection.append(titleInput);

    const {input: textInput, label: textLabel} = this.createInput("textarea", "domain", "text", this.text)
    textInput.addEventListener("input", this.captureField.bind(this, "text"));
    headerSection.append(textLabel);
    headerSection.append(textInput);

    const {input: destinationInput, label: destinationLabel} = this.createInput("checkbox", "domain", "destination", this.destination)
    destinationInput.addEventListener("input", this.captureCheckbox.bind(this, "destination"));
    headerSection.append(destinationLabel);
    headerSection.append(destinationInput);

    const {input: lockedInput, label: lockedLabel} = this.createInput("checkbox", "domain", "locked", this.locked)
    lockedInput.addEventListener("input", this.captureCheckbox.bind(this, "locked"));
    headerSection.append(lockedLabel);
    headerSection.append(lockedInput);

    const storyletsLabel = u.create({tag:"label", content:"Storylets"});
    form.append(storyletsLabel);

    const storyletsSection = u.create({tags: "div", classes:["form-section"]})
    form.append(storyletsSection);

    const storyletsContainer = u.create({tag:"div", classes: ["item-container"]});
    storyletsSection.append(storyletsContainer);

    let addStoryletButton = u.create({tag: "button", classes:["add-button"], content:"+ Add Storylet"});
    addStoryletButton.addEventListener("click", event => {
      event.preventDefault();
      const storyletData = {
        id: this.generateId(),
        storylet: undefined,
      }
      this.storylets.push(storyletData);
      const renderedStorylet = this.createStorylet(this, storyletData);
      storyletsContainer.append(renderedStorylet);
    })
    storyletsSection.append(addStoryletButton);

    for (const storylet of this.storylets) {
      const renderedStorylet = this.createStorylet(this, storylet);

      storyletsContainer.append(renderedStorylet);
    }

    const decksLabel = u.create({tag:"label", content:"Decks"});
    form.append(decksLabel);

    const decksSection = u.create({tags: "div", classes:["form-section"]})
    form.append(decksSection);

    const decksContainer = u.create({tag:"div", classes: ["item-container"]});
    decksSection.append(decksContainer);

    let addDeckButton = u.create({tag: "button", classes:["add-button"], content:"+ Add Deck"});
    addDeckButton.addEventListener("click", event => {
      event.preventDefault();
      const id = this.generateId();
      const deckData = {
        id,
        name: "New Deck",
        storylets: [],
      }
      this.decks[id] = deckData;
      const renderedDeck = this.createDeck(deckData);
      decksContainer.append(renderedDeck);
    })
    decksSection.append(addDeckButton);

    for (const deck of Object.values(this.decks)) {
      const renderedDeck = this.createDeck(deck);
      decksContainer.append(renderedDeck);
    }

    const eventsLabel = u.create({tag:"label", content:"Events"});
    form.append(eventsLabel);

    const eventsSection = u.create({tags: "div", classes:["form-section"]})
    form.append(eventsSection);

    const eventsContainer = u.create({tag:"div", classes: ["item-container"]});
    eventsSection.append(eventsContainer);

    let addEventButton = u.create({tag: "button", classes:["add-button"], content:"+ Add Event"});
    addEventButton.addEventListener("click", event => {
      event.preventDefault();
      const storyletData = {
        id: this.generateId(),
        storylet: undefined,
      }
      this.events.push(storyletData);
      const renderedEvent = this.createEvent(storyletData);
      eventsContainer.append(renderedEvent);
    })
    eventsSection.append(addEventButton);

    for (const event of this.events) {
      const renderedEvent = this.createEvent(event);
      eventsContainer.append(renderedEvent);
    }

    let savePillow = document.createElement("div");
    savePillow.classList.add("save-pillow");
    form.append(savePillow);
    let saveButton = document.createElement("button");
    saveButton.classList.add("save-button");
    saveButton.addEventListener("click", this.saveForm.bind(this));
    saveButton.innerText = "Save";
    savePillow.append(saveButton);

    return form;
  }

  saveForm(evt) {
    evt.preventDefault();
    console.log(this);
    
    const storylets = this.storylets.map(storylet => storylet.storylet);
    const events = this.events.map(event => event.event);

    const decks = {}
    for (const deck of Object.values(this.decks)) {
      const cards = deck.storylets.map(card => card.storylet)
      decks[deck.id] = {...deck};
      decks[deck.id].storylets = cards;
    }

    const domain = {
      id: this.id,
      title: this.title,
      text: this.text,
      destination: this.destination,
      locked: this.locked,
      storylets,
      events,
      decks,
    }
    
    this.state.saveItem(this.id, "domains", domain);
  }

  createStorylet(parent, data) {
    const storylet = u.create({tag:"div", classes:["form-section", "flex-item"]});
    
    const inputGroup = u.create({tag:"div", classes:["input-group"]});
    storylet.append(inputGroup);

    const storyletLabel = u.create({tag: "label", content:"Storylet"});
    storyletLabel.htmlFor = `storylet-select-${data.id}`
    const storyletSelect = u.create({tag:"select", id:`storylet-select-${data.id}`});
    for (const storylet of Object.values(this.state.getStorylets())) {
      let option = document.createElement("option");
      option.value = storylet.id;
      option.text = storylet.title;
      storyletSelect.add(option);
    }

    if (!data.storylet) {
      const blankOption = document.createElement("option");
      blankOption.value = "none"
      blankOption.text = "None"
      storyletSelect.add(blankOption);
    }

    storyletSelect.value = data.storylet || "none";
    storyletSelect.addEventListener("change", this.captureField.bind(data, "storylet"));
    inputGroup.append(storyletLabel)
    inputGroup.append(storyletSelect);
    
    let removeChildButton = u.create({
      tag:"button", 
      classes:["remove-button"], 
      content: "Remove storylet."
    });
    removeChildButton.addEventListener("click", event => {
      event.preventDefault();
      this.removeStorylet.bind(parent, data.id)();
      storylet.remove();
    });
    storylet.append(removeChildButton);

    return storylet;
  }

  removeStorylet(targetId) {
    const remainingStorylets = this.storylets.filter(storylet => storylet.id !== targetId);
    this.storylets = remainingStorylets;
  }

  createEvent(data) {
    const event = u.create({tag:"div", classes:["form-section", "flex-item"]});
    
    const inputGroup = u.create({tag:"div", classes:["input-group"]});
    event.append(inputGroup);

    const eventLabel = u.create({tag: "label", content:"Event"});
    eventLabel.htmlFor = `event-select-${data.id}`
    const eventSelect = u.create({tag:"select", id:`event-select-${data.id}`});
    for (const event of Object.values(this.state.getStorylets())) {
      let option = document.createElement("option");
      option.value = event.id;
      option.text = event.title;
      eventSelect.add(option);
    }
    eventSelect.value = data.event;
    eventSelect.addEventListener("input", this.captureField.bind(data, "event"));
    inputGroup.append(eventLabel)
    inputGroup.append(eventSelect);
    
    let removeChildButton = u.create({
      tag:"button", 
      classes:["remove-button"], 
      content: "Remove event."
    });
    removeChildButton.addEventListener("click", evt => {
      evt.preventDefault();
      this.events = this.events.filter(event => event.id !== data.id)
      event.remove();
    });
    event.append(removeChildButton);

    return event;
  }

  createDeck(deckData) {
    const deck = u.create({tag:"div", classes:["form-section", "flex-item"]});

    const inputGroup = u.create({tag:"div", classes:["input-group"]});
    deck.append(inputGroup);

    const {label: nameLabel, input: nameInput} = this.createInput("text", "deck", "name", deckData.name);
    nameInput.addEventListener("input", this.captureField.bind(deckData, "name"));
    inputGroup.append(nameLabel);
    inputGroup.append(nameInput);

    const storyletsLabel = u.create({tag:"label", content:"Storylets"});
    deck.append(storyletsLabel);

    const storyletsSection = u.create({tag: "div", classes:["form-section"]})  
    deck.append(storyletsSection);  

    const storyletsContainer = u.create({tag:"div", classes: ["item-container"]});
    storyletsSection.append(storyletsContainer);

    const addStoryletButton = u.create({tag: "button", classes:["add-button"], content:"+ Add Storylet"});
    addStoryletButton.addEventListener("click", event => {
      event.preventDefault();
      const storyletData = {
        id: this.generateId(),
        storylet: undefined,
      }
      deckData.storylets.push(storyletData);
      const renderedStorylet = this.createStorylet(deckData, storyletData);
      storyletsContainer.append(renderedStorylet);
    })
    storyletsSection.append(addStoryletButton);

    for (const storylet of deckData.storylets) {
      const renderedStorylet = this.createStorylet(deckData, storylet);
      storyletsContainer.append(renderedStorylet);
    }

    return deck;
  }

}

module.exports = DomainForm;