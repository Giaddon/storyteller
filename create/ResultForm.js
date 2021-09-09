const CreateForm = require("./CreateForm");
const ChangeForm = require("./ChangeForm");
const schemas = require("./schemas");

class ResultForm extends CreateForm {
  constructor(state, result, parentId, resultType) {
    super(state);
    this.title = result.title;
    this.text = result.text;
    this.flow = result.flow || "return";
    let changes = [];
    for (const change of result.changes) {
      changes.push(new ChangeForm(
        this.state, 
        change,
        this.removeFromArray.bind(this, "changes")
      ))
    }
    
    this.changes = changes;
    this.parentId = parentId;
    this.resultType = resultType;
  }

  render() {
    let result = document.createElement("div");
    let resultClass;
    let labelText;
    if (this.resultType !== "neutral") {
      resultClass = this.resultType === "success" ? "result-success" : "result-failure"
      labelText = this.resultType === "success" ? "Success" : "Failure"
    } else {
      resultClass = "result-neutral"
      labelText = "Neutral"
    }

    result.classList.add("result", resultClass);
    
    let label = document.createElement("label");
    label.innerText = labelText;
    result.append(label);

    let {input: title, label: titleLabel} = 
    this.createInput(
      "text", 
      "result", 
      "title" || "", 
      this.title, 
      `-${this.parentId}-${this.resultType}`
    );
    title.addEventListener("input", this.captureField.bind(this, "title"));
    result.append(titleLabel);
    result.append(title);

    let {input: text, label: textLabel} = 
    this.createInput(
      "textarea", 
      "result", 
      "text", 
      this.text || "", 
      `-${this.parentId}-${this.resultType}`
    );
    text.addEventListener("input", this.captureField.bind(this, "text"))
    result.append(textLabel);
    result.append(text);
    
    let flowLabel = document.createElement("label");
    flowLabel.innerText = "Flow";
    flowLabel.htmlFor = `action-${this.parentId}-${this.resultType}-flow`;
    result.append(flowLabel); 

    let flowSelect = document.createElement("select");
    flowSelect.id = `action-${this.parentId}-${this.resultType}-flow`;
    for (const flowType of [
      {value: "return", label: "Return to storylet"}, 
      {value: "leave", label: "Return to domain"}, 
    ]) {
      let option = document.createElement("option");
      option.value = flowType.value;
      option.text = flowType.label;
      flowSelect.add(option);
    }
    let storyletGroup = document.createElement("optgroup");
    storyletGroup.label = "Storylets";
    flowSelect.add(storyletGroup);
    for (const storylet of Object.values(this.state.getStorylets())) {
      let option = document.createElement("option");
      option.value = storylet.id;
      option.text = storylet.title;
      flowSelect.add(option);
    }
    
    let domainGroup = document.createElement("optgroup");
    domainGroup.label = "Domains";
    flowSelect.add(domainGroup);
    for (const domain of Object.values(this.state.getDomains())) {
      let option = document.createElement("option");
      option.value = domain.id;
      option.text = domain.title;
      flowSelect.add(option);
    }

    flowSelect.value = this.flow;
    flowSelect.addEventListener("change", this.captureField.bind(this, "flow"));
    result.append(flowSelect);

    let changesLabel = document.createElement("label");
    changesLabel.innerText = "Quality Changes";
    result.append(changesLabel); 

    let changeContainer = document.createElement("div");
    changeContainer.classList.add("item-container");
    result.append(changeContainer);

    let newChangeButton = document.createElement("button");
    newChangeButton.innerText = "+ New Change";
    newChangeButton.classList.add("add-button");
    newChangeButton.addEventListener("click", event => {
      event.preventDefault();
      const id = this.generateId();
      const changeData = {...schemas.change};
      changeData.id = id;
      const change = new ChangeForm(
        this.state, 
        changeData,
        this.removeFromArray.bind(this, "changes")
      );
      this.changes.push(change);
      const renderedChange = change.render();
      changeContainer.append(renderedChange);
    });
    result.append(newChangeButton);

    if (this.changes) {
      for (const change of this.changes) {
        const renderedChange = change.render();
        changeContainer.append(renderedChange);
      }
    }

    return result;
  }

  returnData() {
    let changes = [];
    for (const change of this.changes) {
      changes.push(change.returnData());
    }

    return {
      title: this.title,
      text: this.text,
      flow: this.flow,
      changes
    }
  }
}

module.exports = ResultForm;