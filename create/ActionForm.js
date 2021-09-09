const CreateForm = require("./CreateForm");
const ResultForm = require("./ResultForm");
const ReqForm = require("./ReqForm");
const ChallengeForm = require("./ChallengeForm");
const { v4: uuidv4 } = require('uuid');

class ActionForm extends CreateForm {
  constructor(state, action, removeAction) {
    super(state);
    this.id = action.id;
    this.title = action.title || "New Action";
    this.text = action.text ||  "Action text.";
    let qualities = [];
    for (const quality of action.reqs.qualities) {
      qualities.push(new ReqForm(this.state, quality, action.id, this.removeFromArray.bind(this, "reqs")))
    }
    this.reqs = {
      visibility: action.reqs.visibility || "always",
      qualities
    };
    let challenges = [];
    for (const challenge of action.challenges) {
      challenges.push(new ChallengeForm(this.state, challenge));
    }
    this.challenges = challenges;
    let neutral = new ResultForm(this.state, action.results.neutral, this.id, "neutral");
    let success = new ResultForm(this.state, action.results.success, this.id, "success");
    let failure = new ResultForm(this.state, action.results.failure, this.id, "failure");
    this.results = {
      neutral,
      success,
      failure,
    }

    this.removeAction = removeAction
  }

  render() {
    let action = document.createElement("div");
    action.id = `action-${this.id}`;
    action.classList.add("action");

    let idLabel = document.createElement("p");
    idLabel.dataset.id = this.id;
    idLabel.innerText = `ID: ${this.id}`;
    idLabel.classList.add("id-label");
    action.append(idLabel);

    let actionDetailsContainer = document.createElement("div");
    actionDetailsContainer.classList.add("action-details-container");
    action.append(actionDetailsContainer);

    let actionHeaderContainer = document.createElement("div");
    actionHeaderContainer.classList.add("action-header-container");
    actionDetailsContainer.append(actionHeaderContainer);

    let {input: title, label: titleLabel} = this.createInput(
      "text", 
      "action", 
      "title", 
      this.title, 
      this.id
    );
    title.addEventListener("input", this.captureField.bind(this, "title"));
    actionHeaderContainer.append(titleLabel)
    actionHeaderContainer.append(title);

    let {input: text, label: textLabel} = this.createInput(
      "textarea", 
      "action", 
      "text", 
      this.text, 
      this.id
    );
    text.addEventListener("input", this.captureField.bind(this, "text"));
    actionHeaderContainer.append(textLabel)
    actionHeaderContainer.append(text);

    let visLabel = document.createElement("label");
    visLabel.innerText = "Visibility";
    visLabel.htmlFor = `action-${this.parentId}-visibility`;
    actionHeaderContainer.append(visLabel); 

    let visSelect = document.createElement("select");
    visSelect.id = `action-${this.parentId}-visibility`;
    for (const visType of [
      {value: "always", label: "Always"}, 
      {value: "any", label: "Any"}, 
      {value: "all", label: "All"}
    ]) {
      let option = document.createElement("option");
      option.value = visType.value;
      option.text = visType.label;
      visSelect.add(option);
    }
    visSelect.value = this.reqs.visibility;
    visSelect.addEventListener("change", this.captureField.bind(this, "reqs visibility"));
    actionHeaderContainer.append(visSelect);

    let reqsLabel = document.createElement("label");
    reqsLabel.innerText = "Quality Requirements";
    actionDetailsContainer.append(reqsLabel); 

    let actionReqsContainer = document.createElement("div");
    actionReqsContainer.classList.add("item-container");
    actionDetailsContainer.append(actionReqsContainer);

    let newReqButton = document.createElement("button");
    newReqButton.innerText = "+ New Requirement";
    newReqButton.classList.add("add-button");
    newReqButton.addEventListener("click", event => {
      event.preventDefault();
      const id = uuidv4();
      const reqData = {
        id
      }
      const newReq = new ReqForm(this.state, reqData, this.id, this.removeFromArray.bind(this, "reqs"));
      this.reqs.qualities.push(newReq);
      const renderedReq = newReq.render();
      actionReqsContainer.append(renderedReq);
    })
    actionDetailsContainer.append(newReqButton);
    
    if (this.reqs) {
      for (const req of this.reqs.qualities) {
        let renderedReq = req.render();
        actionReqsContainer.append(renderedReq);
      }
    }
    
    let challengeLabel = document.createElement("label");
    challengeLabel.innerText = "Challenge"
    actionDetailsContainer.append(challengeLabel);

    let challengeContainer = document.createElement("div");
    challengeContainer.classList.add("a");
    challengeContainer.id = `action-${this.id}-challenge-container`
    actionDetailsContainer.append(challengeContainer);

    let resultsContainer = document.createElement("div");
    resultsContainer.classList.add("action-results-container");
    resultsContainer.id = `action-${this.id}-results-container`;
    action.append(resultsContainer);

    let resultsLabel = document.createElement("label");
    resultsLabel.innerText = "Results"
    resultsContainer.append(resultsLabel);

    if (this.challenges && this.challenges.length > 0) {
      for (const challenge of this.challenges) {
        let renderdChallenge = challenge.render();
        challengeContainer.append(renderdChallenge);
      }

      let removeChallengeButton = document.createElement("button");
      removeChallengeButton.innerText = "Remove Challenge"
      removeChallengeButton.classList.add("remove-button");
      removeChallengeButton.addEventListener("click", this.removeChallenge.bind(this, challengeContainer, resultsContainer));
      challengeContainer.append(removeChallengeButton);
  
      let renderedSuccess = this.results.success.render();
      resultsContainer.append(renderedSuccess);

      let renderedFailure = this.results.failure.render()
      resultsContainer.append(renderedFailure);

    } else {
      let addChallengeButton = document.createElement("button");
      addChallengeButton.innerText = "Add Challenge"
      addChallengeButton.classList.add("add-button");
      addChallengeButton.addEventListener("click", this.addChallenge.bind(this, challengeContainer, resultsContainer))
      challengeContainer.append(addChallengeButton);
      let renderedResult = this.results.neutral.render();
      resultsContainer.append(renderedResult);
    } 

    let removeActionButton = document.createElement("button");
    removeActionButton.classList.add("remove-button");
    removeActionButton.innerText = "Delete Action";
    removeActionButton.addEventListener("click", event => {
      event.preventDefault();
      this.removeAction(this.id);
      action.remove();
    })
    action.append(removeActionButton);
    
    return action 
  }

  removeChallenge(challengeContainer, resultsContainer, event) {
    event.preventDefault();
    this.challenges = [];
    challengeContainer.querySelector(".challenge").remove();
    resultsContainer.querySelector(".result-success").remove();
    resultsContainer.querySelector(".result-failure").remove();
    challengeContainer.querySelector(".remove-button").remove();
    
    let renderedResult = this.results.neutral.render();
    resultsContainer.append(renderedResult);
    
    let addChallengeButton = document.createElement("button");
    addChallengeButton.innerText = "Add Challenge"
    addChallengeButton.classList.add("add-button");
    addChallengeButton.addEventListener("click", this.addChallenge.bind(this, challengeContainer, resultsContainer))
    challengeContainer.append(addChallengeButton);
  }

  addChallenge(challengeContainer, resultsContainer, event) {
    event.preventDefault();
    const id = this.generateId();
    const challengeData = {
      id,
    };
    let challenge = new ChallengeForm(this.state, challengeData);
    this.challenges.push(challenge);
    const renderedChallenge = challenge.render();
    challengeContainer.append(renderedChallenge);

    resultsContainer.querySelector(".result-neutral").remove();
    challengeContainer.querySelector(".add-button").remove();
        
    let renderedSuccess = this.results.success.render();
    resultsContainer.append(renderedSuccess);

    let renderedFailure = this.results.failure.render()
    resultsContainer.append(renderedFailure);

    let removeChallengeButton = document.createElement("button");
      removeChallengeButton.innerText = "Remove Challenge"
      removeChallengeButton.classList.add("remove-button");
      removeChallengeButton.addEventListener("click", this.removeChallenge.bind(this, challengeContainer, resultsContainer));
      challengeContainer.append(removeChallengeButton);
    
  }

  returnData() {
    let qualities = [];
    for (const quality of this.reqs.qualities) {
      qualities.push(quality.returnData());
    }
    let challenges = [];
    for (const challenge of this.challenges) {
      challenges.push(challenge.returnData())
    }

    const actionData = {
      id: this.id,
      title: this.title,
      text: this.text,
      reqs: {
        visibility: this.reqs.visibility,
        qualities
      },
      challenges,
      results: {
        neutral: this.results.neutral.returnData(),
        success: this.results.success.returnData(),
        failure: this.results.failure.returnData(),
      }
    }
    
    return actionData
  }

}

module.exports = ActionForm;