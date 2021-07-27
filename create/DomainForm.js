const CreateForm = require("./CreateForm");
const u = require("../utilities");

class DomainForm extends CreateForm {
  constructor(api, domain) {
    super(api);
    this.id = domain.id;
    this.title = domain.title || "New Domain";
    this.text = domain.text || "Domain text.";
   
    let storylets = [];
    for (const storylet of domain.storylets) {
      const storyletData = {
        id: this.generateId(),
        storylet,
      }
      storylets.push(storyletData);
    }
    this.storylets = storylets;


    for (const deck of Object.values(domain.decks)) {
      let storylets = [];
      for (const storylet of deck.storylets) {
        storylets.push({
          id: this.generateId(),
          storylet
        });
      }
      deck.storylets = storylets;
    }
    this.decks = domain.decks || {};
    this.events = domain.events || [];
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
        this.api.deleteDomain(this.id);
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
        storylet: null,
      }
      this.storylets.push(storyletData);
      const renderedStorylet = this.createStorylet(storyletData);
      storyletsContainer.append(renderedStorylet);
    })
    storyletsSection.append(addStoryletButton);

    for (const storylet of this.storylets) {
      const renderedStorylet = this.createStorylet(storylet);
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

  saveForm(event) {
    event.preventDefault();
    console.log(this);
    
    let storylets = [];
    for (const storylet of this.storylets) {
      storylets.push(storylet.storylet);
    }

    for (const deck of Object.values(this.decks)) {
      let storylets = [];
      for (const storylet of deck.storylets) {
        storylets.push(storylet.storylet)
      }
      deck.storylets = storylets;
    }

    const domain = {
      id: this.id,
      title: this.title,
      text: this.text,
      locked: this.locked,
      storylets,
      decks: this.decks,
    }
    
    this.api.saveItem(this.id, "domains", domain);
  }

  createStorylet(data) {
    const storylet = u.create({tag:"div", classes:["form-section", "flex-item"]});
    
    const inputGroup = u.create({tag:"div", classes:["input-group"]});
    storylet.append(inputGroup);

    const storyletLabel = u.create({tag: "label", content:"Storylet"});
    storyletLabel.htmlFor = `storylet-select-${data.id}`
    const storyletSelect = u.create({tag:"select", id:`storylet-select-${data.id}`});
    for (const storylet of Object.values(this.api.getStorylets())) {
      let option = document.createElement("option");
      option.value = storylet.id;
      option.text = storylet.title;
      storyletSelect.add(option);
    }
    storyletSelect.value = data.storylet;
    storyletSelect.addEventListener("input", this.captureField.bind(data, "storylet"));
    inputGroup.append(storyletLabel)
    inputGroup.append(storyletSelect);
    
    let removeChildButton = u.create({
      tag:"button", 
      classes:["remove-button"], 
      content: "Remove storylet."
    });
    removeChildButton.addEventListener("click", event => {
      event.preventDefault();
      this.storylets = this.storylets.filter(storylet => storylet.id !== data.id)
      storylet.remove();
    });
    storylet.append(removeChildButton);

    return storylet;
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

    let addStoryletButton = u.create({tag: "button", classes:["add-button"], content:"+ Add Storylet"});
    addStoryletButton.addEventListener("click", event => {
      event.preventDefault();
      const storyletData = {
        id: this.generateId(),
        storylet: null,
      }
      deckData.storylets.push(storyletData);
      const renderedStorylet = this.createStorylet(storyletData);
      storyletsContainer.append(renderedStorylet);
    })
    storyletsSection.append(addStoryletButton);

    for (const storylet of deckData.storylets) {
      const renderedStorylet = this.createStorylet(storylet);
      storyletsContainer.append(renderedStorylet);
    }

    return deck;
  }

}

module.exports = DomainForm;