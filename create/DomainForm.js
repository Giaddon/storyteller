const CreateForm = require("./CreateForm");
const u = require("../utilities");

class DomainForm extends CreateForm {
  constructor(api, domain) {
    super(api);
    this.id = domain.id;
    this.title = domain.title || "New Domain";
    this.text = domain.text || "Domain text.";
    this.storylets = domain.storylets || [];
    this.decks = domain.decks || [];
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

    const storyletsSection = u.create({tags: "div", classes:["form-section", "flow-column"]})
    form.append(storyletsSection);

    const storyletsGroup = u.create({tag:"div", classes:["input-group"]});
    storyletsSection.append(storyletsGroup);

    const storyletsLabel = u.create({tag: "label", content:"Storylets"});
    storyletsLabel.htmlFor = "storylets-select"
    const storyletsSelect = u.create({tag:"select", id:"storylets-select"});
    storyletsSelect.multiple = true;
    for (const storylet of Object.values(this.api.getStorylets())) {
      let option = document.createElement("option");
      option.value = storylet.id;
      option.text = storylet.title;
      storyletsSelect.add(option);
    }
    storyletsSelect.value = this.storylets;
    storyletsSelect.addEventListener("change", this.captureField.bind(this, "storylets"));

    storyletsGroup.append(storyletsLabel)
    storyletsGroup.append(storyletsSelect);

    return form;
  }

  renderStorylet() {

  }
}

module.exports = DomainForm;