const u = require("../utilities");
const CreateForm = require("./CreateForm");

class CategoryForm extends CreateForm{
  constructor(state, {id, title, order}) {
    super(state);
    this.id = id;
    this.title = title,
    this.order = order;
  }

  render() {
    const form = u.create({tag:"div", classes:["active-form"]});
    
    const idLabel = u.create({tag:"p", content: `ID: ${this.id}`, classes:["id-label"]});
    form.append(idLabel);
    
    const headerSection = u.create({tag: "div", classes:["form-section", "flow-column"]});
    form.append(headerSection);

    const deleteButton = u.create({tag: "button", classes:["remove-button", "delete-button"], content: "Delete Category."});
    deleteButton.addEventListener("click", event => {
      event.preventDefault();
      const confirmation = confirm("Confirming will remove this catefory from your world. Linked qualities will not be affected. It can't be undone.")
      if (confirmation) {
        this.state.deleteCategory(this.id);
        form.remove();
      } else {
        return;
      }
    });
    headerSection.append(deleteButton);

    const {input: titleInput, label: titleLabel} = this.createInput("text", "category", "title", this.title)
    titleInput.addEventListener("input", this.captureField.bind(this, "title"));
    headerSection.append(titleLabel);
    headerSection.append(titleInput);

    const {input: orderInput, label: orderLabel} = this.createInput("number", "category", "order", this.order)
    orderInput.addEventListener("input", this.captureField.bind(this, "order"));
    headerSection.append(orderLabel);
    headerSection.append(orderInput);

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
    
    const category = {
      id: this.id,
      title: this.title,
      order: this.order
    }
    
    this.state.saveItem(this.id, "categories", category);
  }

}

module.exports = CategoryForm;