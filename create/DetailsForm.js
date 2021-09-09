const u = require("../utilities");
const CreateForm = require("./CreateForm");

class DetailsForm extends CreateForm{
  constructor(state, {name, author, description, version}) {
    super(state);
    this.name = name || "Game Name";
    this.author = author || "Author";
    this.description = description || "Description text.";
    this.version = version || "Version info";
  }

  render() { 
    const form = u.create({tag:"div", classes:["active-form"]});
    
    const formLabel = u.create({tag:"p", content: `World Details`, classes:["id-label"]});
    form.append(formLabel);
    
    const detailsSection = u.create({tag: "div", classes:["form-section", "flow-column"]});
    form.append(detailsSection);

    const {input: nameInput, label: nameLabel} = this.createInput("text", "details", "name", this.name)
    nameInput.addEventListener("input", this.captureField.bind(this, "name"));
    detailsSection.append(nameLabel);
    detailsSection.append(nameInput);

    const {input: authorInput, label: authorLabel} = this.createInput("text", "details", "author", this.author)
    authorInput.addEventListener("input", this.captureField.bind(this, "author"));
    detailsSection.append(authorLabel);
    detailsSection.append(authorInput);

    const {input: descriptionInput, label: descriptionLabel} = this.createInput("textarea", "details", "description", this.description)
    descriptionInput.addEventListener("input", this.captureField.bind(this, "description"));
    detailsSection.append(descriptionLabel);
    detailsSection.append(descriptionInput);

    const {input: versionInput, label: versionLabel} = this.createInput("text", "details", "version", this.version)
    versionInput.addEventListener("input", this.captureField.bind(this, "version"));
    detailsSection.append(versionLabel);
    detailsSection.append(versionInput);

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
    
    const details = {
      name: this.name,
      author: this.author,
      description: this.description,
      version: this.version,
    }
    
    this.state.saveDetails(details);
  }
}

module.exports = DetailsForm