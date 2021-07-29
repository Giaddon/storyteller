const u = require('../utilities');

class RegionForm extends CreateForm {
  constructor(api, {id, name, events}) {
    super(api);
    this.id = id;
    this.title = title || "Region"
    this.events = events || [];
  }

  render() {
    const form = u.create({tag:"form", classes:["active-form"]});
    
    let idLabel = u.create({tag:"p", content: `ID: ${this.id}`, classes:["id-label"]});
    form.append(idLabel);
    
    const headerSection = u.create({tag: "div", classes:["form-section", "flow-column"]});
    form.append(headerSection);

    if (this.id !== "default") {
      let deleteButton = u.create({tag: "button", classes:["remove-button", "delete-button"], content: "Delete Region."});
      deleteButton.addEventListener("click", event => {
        event.preventDefault();
        const confirmation = confirm("This will remove the region from your world. Linked events will not be affected. It can't be undone.")
        if (confirmation) {
          this.api.deleteRegion(this.id);
          form.remove();
        } else {
          return;
        }
      });
      headerSection.append(deleteButton);
    }

    const {input: titleInput, label: titleLabel} = this.createInput("text", "region", "title", this.title)
    titleInput.addEventListener("input", this.captureField.bind(this, "title"));
    headerSection.append(titleLabel);
    headerSection.append(titleInput);
  }
}

module.exports = RegionForm;