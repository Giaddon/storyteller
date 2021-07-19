const CreateForm = require("./CreateForm");
const ReqForm = require("./ReqForm");
const { v4: uuidv4 } = require('uuid');

class ActionForm extends CreateForm {
  constructor(action, removeAction) {
    super();
    this.id = action.id;
    this.button = action.button || {
      title: "New Action",
      text: "Action text.",
    };
    this.reqs = action.reqs || {
      visibility: "always",
      qualities: []
    };
    this.results = action.results || {
      title: "Result title.",
      text: "Result text.",
      changes: [],
      challenge: false,
    };
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
      this.button.title, 
      `${this.id}`
    );
    title.addEventListener("input", this.captureField.bind(this, "button title"));
    actionHeaderContainer.append(titleLabel)
    actionHeaderContainer.append(title);

    let {input: text, label: textLabel} = this.createInput(
      "textarea", 
      "action", 
      "text", 
      this.button.text, 
      `${this.id}`
    );
    text.addEventListener("input", this.captureField.bind(this, "button text"));
    actionHeaderContainer.append(textLabel)
    actionHeaderContainer.append(text);

    let reqsLabel = document.createElement("label");
    reqsLabel.innerText = "Quality Requirements";
    actionDetailsContainer.append(reqsLabel); 

    let actionReqsContainer = document.createElement("div");
    actionReqsContainer.classList.add("action-reqs-container");
    actionDetailsContainer.append(actionReqsContainer);

    let newReqButton = document.createElement("button");
    newReqButton.innerText = "+ New Requirement";
    newReqButton.classList.add("add-req-button");
    newReqButton.addEventListener("click", event => {
      event.preventDefault();
      const id = uuidv4();
      const reqData = {
        id
      }
      const newReq = new ReqForm(reqData, this.id, this.removeReq.bind(this));
      this.reqs.qualities.push(newReq);
      const renderedReq = newReq.render();
      actionReqsContainer.append(renderedReq);
    })
    actionDetailsContainer.append(newReqButton);
    
    if (this.reqs) {
      let reqCount = 0;
      for (const req of this.reqs.qualities) {
        let reqElement = createReq(req, this.id, reqCount);
        reqCount++;
        actionReqsContainer.append(reqElement);
      }
    }
    
    let actionChallengeContainer = document.createElement("div");
    actionChallengeContainer.classList.add("action-challenge-container");
    actionChallengeContainer.id = `action-${this.id}-challenge-container`
    actionDetailsContainer.append(actionChallengeContainer);

    let challengeLabel = document.createElement("label");
    challengeLabel.innerText = "Challenge"
    actionChallengeContainer.append(challengeLabel);

    if (this.challenges) {
      let challengeCount = 0;
      for (const challenge of this.challenges) {
        let challengeElement = createChallenge(challenge, this.id, challengeCount);
        actionChallengeContainer.append(challengeElement);
        challengeCount++
      }
      let removeChallengeButton = document.createElement("button");
      removeChallengeButton.innerText = "Remove Challenge"
      removeChallengeButton.classList.add("remove-challenge-button");
      removeChallengeButton.addEventListener("click", removeChallenge.bind(null, this.id));
      actionChallengeContainer.append(removeChallengeButton);
    } else {
      let addChallengeButton = document.createElement("button");
      addChallengeButton.innerText = "Make Challenge"
      addChallengeButton.classList.add("add-challenge-button");
      addChallengeButton.addEventListener("click", makeChallenge.bind(null, this.id));
      actionChallengeContainer.append(addChallengeButton);
    }

    let actionResultsContainer = document.createElement("div");
    actionResultsContainer.classList.add("action-results-container");
    actionResultsContainer.id = `action-${this.id}-results-container`;
    action.append(actionResultsContainer);

    if (this.results) {
      let resultsLabel = document.createElement("label");
      resultsLabel.innerText = "Result"
      actionResultsContainer.append(resultsLabel);
      
      if (this.challenges) {
        let successLabel = document.createElement("label");
        successLabel.innerText = "Success"
        actionResultsContainer.append(successLabel);
        
        let success = createActionResult(this.results.success, this.id, "success"); 
        success.classList.add("result-success")
        actionResultsContainer.append(success);

        let failureLabel = document.createElement("label");
        failureLabel.innerText = "Failure"
        actionResultsContainer.append(failureLabel);

        let failure = createActionResult(this.results.failure, this.id, "failure");
        failure.classList.add("result-failure")
        actionResultsContainer.append(failure);
      } else {
        let result = createActionResult(this.results, this.id, "result");
        actionResultsContainer.append(result);
      } 
    }

    let removeActionButton = document.createElement("button");
    removeActionButton.innerText = "Delete Action";
    removeActionButton.addEventListener("click", event => {
      event.preventDefault();
      this.removeAction(this.id);
      action.remove();
    })
    action.append(removeActionButton);

    return action 
  }

}

module.exports = ActionForm;