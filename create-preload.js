const u = require('./utilities');
const { v4: uuidv4 } = require('uuid');

// TODO
// ACTIONS
// - Challenge
// - Visibility
// - Add new
// RESULTS
// - Flow.
// - More change logic (if x then y)?
// - Change type random (set to a random # within range.)
// QUALITIES
// - Quality types (items vs attribues)?
// - Descriptions and labels.
// - Messages? 
// DOMAINS
// - Figure out event and card implementation. 

let worldState = {
  qualities: {
    coins: {
      id: "coins",
      name: "Coins",
      startvalue: 5,
      category: "Currency",
      hidden: false,
    },
    credits: {
      id: "credits",
      name: "Credits",
      category: "Currency",
      hidden: false,
    },
    archetype: {
      id: "archetype",
      name: "Archetype",
      category: "Background",
      hidden: false,
    },
    spices: {
      id: "spices",
      name: "Spices",
      startvalue: 20,
      category: "Goods",
      hidden: false,
    },
    gems: {
      id: "gems",
      name: "Gems",
      startvalue: 4,
      category: "Goods",
      hidden: false,
    }
  },
  domains: {},
  stories: {
    bazaar: {
      id: "bazaar",
      title: "Xylax Bazaar",
      text: "A thousand languages reverberate through the packed halls of the bazaar, but the dialect of barter is universal.",
      reqs: {},
      button: {
        title: "Browse Xylx Bazaar.",
        text: "If you want to make some money, trading at the bazaar is a great place to do it.",
      },
      actions: {
        loiter: {
          id: "loiter",
          button: {
            title: "Loiter suspiciously.",
            text: "There's no law against it, right?"
          },
          results: {
            title: "You're up to something...",
            text: "You fidget. You squirm. You lean against a beam then change your mind. Why are you sweating?",
            changes: [
              {
                type: "adjust",
                quality: "suspicion",
                value: 1
              }
            ]
          }
        },
        "sellSpices": {
          "id": "sellSpices",
          "button": {
            "title": "Sell some spice.",
            "text": "A serpentine creature with three tounges is offering 100 credits per block of spice."
          },
          "challenges": [
            {
              "quality": "cunning",
              "difficulty": 5 
            },
          ],
          "reqs": {
            "type": "all",
            "qualities": [
              {
                "quality": "spices",
                "min": 1
              },
              {
                "quality": "gems",
                "min": 3,
                "max": 77,
              },
              {
                "quality": "coins",
                "min": 0,
                "max": 0,
              }
            ]
          },
          "results": {
            "success": {
              "title": "A successful transaction.",
              "text": "With a hiss, the creature stows the spice in a biological pouch.",
              "changes": [
                {
                  "type": "adjust",
                  "quality": "spices",
                  "value": -1
                },
                {
                  "type": "adjust",
                  "quality": "credits",
                  "value": 100
                }
              ]
            },  
            "failure": {
              "title": "Theft!",
              "text": "You were so busy negotiating with the serpent that you didn't notice the others slithering up behind you until it was too late. They take your spice and leave.",
              "changes": [
                {
                  "type": "set",
                  "quality": "spices",
                  "value": 0
                }
              ]
            }
          } 
        },
      }
    },
    "zap": {
      "id": "zap",
      "title": "ZAP!",
      "text": "The searing hot bolt of purple energy grazes your cheek. You're alive.\n\"Your kind isn't so useful with a laser-hole in your skull. Bring back a thousand credits. Or you're dead for real.\" \nThe enforcer whips her scaled tale behind her with a flourish and is gone.",
      "button": {
        "title": "",
        "text": ""
      },
      "reqs": {
        "type": "",
        "visibility": "",
        "qualities": []
      },
      "actions": {
        "getUpTrader": {
          "id": "getUpTrader",
          "button": {
            "title": "Pick yourself up.",
            "text": "All this over a thousand credits?"
          },
          "reqs": {
            "type": "all",
            "hidden": true,
            "qualities": [
              {
                "quality": "archetype",
                "min": 2,
                "max": 2
              }
            ]
          },
          "results": {
            "title": "",
            "text": "",
            "traverse": {
              "type":"domain",
              "destination": "station"
            },
            "changes": [ 
              {
                "quality": "debt",
                "type": "set",
                "value": 1
              },
              {
                "quality": "credits",
                "type": "set",
                "value": 10
              }
            ]
          }
        },
        "getUpWarrior": {
          "id": "getUpWarrior",
          "button": {
            "title": "Pick yourself up.",
            "text": "A thousand credits!?"
          },
          "reqs": {
            "type": "all",
            "hidden": true,
            "qualities": [
              {
                "quality": "archetype",
                "min": 1,
                "max": 1
              }
            ]
          },
          "results": {
            "title": "A debt to pay.",
            "text": "A thousand credits is a lot to scrape together quickly. Fortunately this station is home to a lot of black market hustlers and gangsters. Plenty of people with money who need some muscle.",
            "traverse": {
              "type":"domain",
              "destination": "station"
            },
            "changes": [
              {
                "quality": "debt",
                "type": "set",
                "value": 1
              },
              {
                "quality": "credits",
                "type": "set",
                "value": 10
              }
            ]
          }
        },   
      }
    },
  },
  events: {}
}



window.addEventListener('DOMContentLoaded', () => {
  // populateQualityList();
  populateStoryList();
  // let newButton = u.create("button");
  // newButton.innerText = "+ Add New"
  // newButton.addEventListener("click", createNewQuality);
  // document.getElementById("new-quality-button-container").append(newButton)
});

function populateQualityList() {
  const qualitiesList = document.getElementById("qualities-list")
  u.removeChildren(qualitiesList);
  for (const quality of Object.values(worldState.qualities)) {
    const button = createItemButton(quality, "quality");
    qualitiesList.append(button);
  }
}

function populateStoryList() {
  const storyList = document.getElementById("story-list")
  u.removeChildren(storyList);
  for (const story of Object.values(worldState.stories)) {
    const button = createItemButton(story, "story");
    storyList.append(button);
  }
}

function createItemButton(data, type) {
  let button = u.create("button");
  button.classList.add("item-button");
  button.innerText = data.title || data.name;
  button.addEventListener("click", createAndPopulateForm.bind(null, data.id, type), );
  return button
}

function createNewQuality() {
  const id = uuidv4()

  let newQuality = {
    id,
    name: "New Quality",
    startvalue: 0,
    category: "",
    hidden: false,
  }

  worldState.qualities[id] = newQuality;
  populateQualityList();
}

function createInput(inputType, formType, contentType, content, suffix) {
  let input;
  if (suffix === undefined) {
    suffix = "";
  }
  if (inputType === "text") {
    input = u.create("input");
    input.type = "text";
  }
  else if (inputType === "textarea") {
    input = u.create("textarea");
  }
  else if (inputType === "checkbox") {
    input = u.create("input");
    input.type = "checkbox";
  }
  else if (inputType === "number") {
    input = u.create("input");
    input.type = "number";
  }
  input.name = `${formType}-${contentType}${suffix}`;
  input.id = `${formType}-${contentType}${suffix}`;
  input.classList.add(`${formType}-${contentType}`);

  if (inputType === "checkbox") {
    input.checked = content
  } else {
    input.value = content;
  }

  let label = u.create("label");
  label.htmlFor = `${formType}-${contentType}${suffix}`;
  label.innerText = `${contentType}`

  return {input, label};
}

function createStoryForm(data) {
  let children = [];
  
  let form = u.create("form");
  form.id = "story-form";
  form.classList.add("story-form");
  
  let idLabel = u.create("p");
  idLabel.innerText = `ID: ${data.id}`;
  idLabel.classList.add("id-label");
  children.push(idLabel);

  let headerLabel = u.create("p");
  headerLabel.innerText = "Story Header";
  children.push(headerLabel);

  let headerSection = u.create("div");
  headerSection.classList.add("form-section");
  children.push(headerSection);
  
  let {input: titleInput, label: titleLabel} = createInput("text", "story", "title", data.title);
  headerSection.append(titleLabel);
  headerSection.append(titleInput);
 
  let {input: textInput, label: textLabel} = createInput("textarea", "story", "text", data.text);
  headerSection.append(textLabel);
  headerSection.append(textInput);

  let buttonLabel = u.create("p");
  buttonLabel.innerText = "Story Button";
  children.push(buttonLabel);

  let buttonSection = u.create("div");
  buttonSection.id = "story-button";
  buttonSection.classList.add("story-button");
  children.push(buttonSection);

  let {input: buttonTitleInput, label: buttonTitleLabel} = createInput("text", "story-button", "title", data.button.title);
  buttonSection.append(buttonTitleLabel);
  buttonSection.append(buttonTitleInput);

  let {input: buttonTextInput, label: buttonTextLabel} = createInput("textarea", "story-button", "text", data.button.text);
  buttonSection.append(buttonTextLabel);
  buttonSection.append(buttonTextInput);
  
  let actionLabel = u.create("p");
  actionLabel.innerText = "Actions"
  children.push(actionLabel);

  let actionSection = u.create("div");
  children.push(actionSection);

  let count = 0;
  for (const action of Object.values(data.actions)) {
    const newAction = createActionDiv(action, count);
    count++;
    actionSection.append(newAction);
  }

  let saveButton = u.create("button");
  saveButton.addEventListener("click", saveForm.bind(null, "story", data.id));
  saveButton.innerText = "Save";
  saveButton.type = "submit";
  children.push(saveButton);

  u.appendChildren(form, children);

  return form;
}

function saveForm(type, id, event) {
  event.preventDefault();
  const f = document.querySelector('form');
  if (type === "story") {
    let story = {
      id: id,
      title: f.querySelector("#story-title").value,
      text: f.querySelector("#story-text").value,
      button: {
        title: f.querySelector("#story-button-title").value,
        text: f.querySelector("#story-button-text").value
      }
    }
    let actions = {};
    let actionElements = f.querySelectorAll('.action');

    for (const e of actionElements) {
      const id = e.querySelector('.id-label').dataset.id;
      actions[id] = {
        id,
        button: {
          title: e.querySelector(".action-title").value,
          text: e.querySelector(".action-text").value
        },
      }
    }
    story.actions = actions;

    worldState.stories[id] = story;
  }

}


function createActionDiv(data, count) {
  let action = u.create("div");
  action.id = `action-${count}`;
  action.classList.add("action");

  let idLabel = u.create("p");
  idLabel.dataset.id = data.id;
  idLabel.innerText = `ID: ${data.id}`;
  idLabel.classList.add("id-label");
  action.append(idLabel);

  let actionDetailsContainer = u.create("div");
  actionDetailsContainer.classList.add("action-details-container");
  action.append(actionDetailsContainer);

  let actionHeaderContainer = u.create("div");
  actionHeaderContainer.classList.add("action-header-container");
  actionDetailsContainer.append(actionHeaderContainer);

  let {input: title, label: titleLabel} = createInput(
    "text", 
    "action", 
    "title", 
    data.button.title, 
    `-${count}`
  );
  actionHeaderContainer.append(titleLabel)
  actionHeaderContainer.append(title);

  let {input: text, label: textLabel} = createInput(
    "textarea", 
    "action", 
    "text", 
    data.button.text, 
    `-${count}`
  );
  actionHeaderContainer.append(textLabel)
  actionHeaderContainer.append(text);

  let reqsLabel = u.create("label");
  reqsLabel.innerText = "Quality Requirements";
  actionDetailsContainer.append(reqsLabel); 

  let actionReqsContainer = u.create("div");
  actionReqsContainer.classList.add("action-reqs-container");
  actionDetailsContainer.append(actionReqsContainer);

  let newReqButton = u.create("button");
  newReqButton.innerText = "+ New Requirement";
  newReqButton.classList.add("add-req-button");
  newReqButton.addEventListener("click", attachNewReq.bind(null, count))
  actionDetailsContainer.append(newReqButton);
  
  if (data.reqs) {
    let reqCount = 0;
    for (const req of data.reqs.qualities) {
      let reqElement = createReq(req, count, reqCount);
      reqCount++;
      actionReqsContainer.append(reqElement);
    }
  }
  
  let actionChallengeContainer = u.create("div");
  actionChallengeContainer.classList.add("action-challenge-container");
  actionChallengeContainer.id = `action-${count}-challenge-container`
  actionDetailsContainer.append(actionChallengeContainer);

  let challengeLabel = u.create("label");
  challengeLabel.innerText = "Challenge"
  actionChallengeContainer.append(challengeLabel);

  if (data.challenges) {
    let challengeCount = 0;
    for (const challenge of data.challenges) {
      let challengeElement = createChallenge(challenge, count, challengeCount);
      actionChallengeContainer.append(challengeElement);
      challengeCount++
    }
    let removeChallengeButton = u.create("button");
    removeChallengeButton.innerText = "Remove Challenge"
    removeChallengeButton.classList.add("remove-challenge-button");
    removeChallengeButton.addEventListener("click", removeChallenge.bind(null, count));
    actionChallengeContainer.append(removeChallengeButton);
  } else {
    let addChallengeButton = u.create("button");
    addChallengeButton.innerText = "Make Challenge"
    addChallengeButton.classList.add("add-challenge-button");
    addChallengeButton.addEventListener("click", makeChallenge.bind(null, count));
    actionChallengeContainer.append(addChallengeButton);
  }

  let actionResultsContainer = u.create("div");
  actionResultsContainer.classList.add("action-results-container");
  actionResultsContainer.id = `action-${count}-results-container`;
  action.append(actionResultsContainer);

  if (data.results) {
    let resultsLabel = u.create("label");
    resultsLabel.innerText = "Result"
    actionResultsContainer.append(resultsLabel);
    
    if (data.challenges) {
      let successLabel = u.create("label");
      successLabel.innerText = "Success"
      actionResultsContainer.append(successLabel);
      
      let success = createActionResult(data.results.success, count, "success"); 
      success.classList.add("result-success")
      actionResultsContainer.append(success);

      let failureLabel = u.create("label");
      failureLabel.innerText = "Failure"
      actionResultsContainer.append(failureLabel);

      let failure = createActionResult(data.results.failure, count, "failure");
      failure.classList.add("result-failure")
      actionResultsContainer.append(failure);
    } else {
      let result = createActionResult(data.results, count, "result");
      actionResultsContainer.append(result);
    } 
  }

  return action 
}

function makeChallenge(actionIdx, event) {
  event.preventDefault();
  
  let targetAction = document.getElementById(`action-${actionIdx}`);
  console.log(targetAction);
  let data = {
    quality: Object.values(worldState.qualities)[0].id,
    difficulty: 1,
  }

  let challenge = createChallenge(data, actionIdx, 0);
  targetAction.querySelector(`#action-${actionIdx}-challenge-container`).append(challenge);

  let removeChallengeButton = u.create("button");
  removeChallengeButton.innerText = "Remove Challenge"
  removeChallengeButton.classList.add("remove-challenge-button");
  removeChallengeButton.addEventListener("click", removeChallenge.bind(null, actionIdx));
  targetAction.querySelector(`#action-${actionIdx}-challenge-container`).append(removeChallengeButton);

  let targetResultsContainer = targetAction.querySelector(`#action-${actionIdx}-results-container`);
  u.removeChildren(targetResultsContainer);

  let successData = {
    title: "Success",
    text: "Success."
  }

  let failureData = {
    title: "Failure",
    text: "Failure."
  }

  let successLabel = u.create("label");
  successLabel.innerText = "Success"
  targetResultsContainer.append(successLabel);
  
  let success = createActionResult(successData, actionIdx, "success"); 
  success.classList.add("result-success")
  targetResultsContainer.append(success);

  let failureLabel = u.create("label");
  failureLabel.innerText = "Failure"
  targetResultsContainer.append(failureLabel);

  let failure = createActionResult(failureData, actionIdx, "failure");
  failure.classList.add("result-failure")
  targetResultsContainer.append(failure);

  event.target.remove();
}

function removeChallenge(actionIdx, event) {
  event.preventDefault();
  
  let targetAction = document.getElementById(`action-${actionIdx}`);
  let targetChallengeContainer = targetAction.querySelector(`#action-${actionIdx}-challenge-container`)
  let targetResultsContainer = targetAction.querySelector(`#action-${actionIdx}-results-container`);
  let currentChallenges = targetChallengeContainer.querySelectorAll(".challenge");
  for (const challenge of currentChallenges) {
    challenge.remove();
  }
  event.target.remove();
  u.removeChildren(targetResultsContainer);

  let result = createActionResult({}, actionIdx, "result");
  targetResultsContainer.append(result);

  let addChallengeButton = u.create("button");
  addChallengeButton.innerText = "Make Challenge"
  addChallengeButton.classList.add("add-challenge-button");
  addChallengeButton.addEventListener("click", makeChallenge.bind(null, actionIdx));
  targetChallengeContainer.append(addChallengeButton);
}

function attachNewReq(actionIdx, event) {
  event.preventDefault();
  const newReq = {
    "quality": Object.values(worldState.qualities)[0].id,
    "min": 0,
    "max": 0
  }
  const parentAction = document.getElementById(`action-${actionIdx}`);
  const reqsCount = parentAction.querySelectorAll('.req').length;

  let req = createReq(newReq, actionIdx, reqsCount);

  parentAction.querySelector('.action-reqs-container').append(req);
}

function attachNewChange(actionIdx, resultType, event) {
  event.preventDefault();
  const newChange = {
    "quality": Object.values(worldState.qualities)[0].id,
    "type": "adjust",
    "value": 1
  }
  const parentResult = document.getElementById(`action-${actionIdx}-${resultType}`);
  const changesCount = parentResult.querySelectorAll('.change').length;

  let change = createChange(newChange, actionIdx, resultType, changesCount);

  parentResult.querySelector('.change-container').append(change);
}

function createReq(data, parentCount, count) {
  let req = u.create("div");
  req.classList.add("req");

  let qualityDiv = u.create("div");
  qualityDiv.classList.add("req-group");
  req.append(qualityDiv);

  let qualityLabel = u.create("label");
  qualityLabel.innerText = "Quality";
  qualityLabel.htmlFor = `req-quality-${parentCount}-${count}`;
  qualityDiv.append(qualityLabel);

  let qualitySelect = u.create("select");
  qualitySelect.id = `req-quality-${parentCount}-${count}`;
  for (const quality of Object.values(worldState.qualities)) {
    let option = u.create("option");
    option.value = quality.id;
    option.text = quality.name;
    qualitySelect.add(option);
  }
  qualitySelect.value = data.quality;
  qualityDiv.append(qualitySelect);

  let minDiv = u.create("div");
  minDiv.classList.add("req-group");
  req.append(minDiv);

  let {input: min, label: minLabel} = createInput(
    "number", 
    "action", 
    "min", 
    data.min, 
    `${parentCount}-${count}`);
  minDiv.append(minLabel);
  minDiv.append(min);

  let maxDiv = u.create("div");
  maxDiv.classList.add("req-group");
  req.append(maxDiv);

  let {input: max, label: maxLabel} = createInput(
    "number", 
    "action", 
    "max", 
    data.max, 
    `${parentCount}-${count}`
  );
  maxDiv.append(maxLabel);
  maxDiv.append(max);

  return req;
}

function createChallenge(data, parentCount, count) {
  let challenge = u.create("div");
  challenge.classList.add("challenge");

  let qualityDiv = u.create("div");
  qualityDiv.classList.add("req-group");
  challenge.append(qualityDiv);

  let qualityLabel = u.create("label");
  qualityLabel.innerText = "Quality";
  qualityLabel.htmlFor = `challenge-quality-${parentCount}-${count}`;
  qualityDiv.append(qualityLabel);

  let qualitySelect = u.create("select");
  qualitySelect.id = `challenge-quality-${parentCount}-${count}`;
  for (const quality of Object.values(worldState.qualities)) {
    let option = u.create("option");
    option.value = quality.id;
    option.text = quality.name;
    qualitySelect.add(option);
  }

  qualitySelect.value = data.quality;
  qualityDiv.append(qualitySelect);

  let diffDiv = u.create("div");
  diffDiv.classList.add("req-group");
  challenge.append(diffDiv);

  let {input: diff, label: diffLabel} = createInput(
    "number", 
    "challenge", 
    "difficulty", 
    data.difficulty, 
    `${parentCount}-${count}`
  );
  diffDiv.append(diffLabel);
  diffDiv.append(diff);

  return challenge;
}

function createActionResult(data, parent, resultType) {
  let result = u.create("div");
  result.classList.add("result");
  result.id = `action-${parent}-${resultType}`
  
  let {input: title, label: titleLabel} = 
  createInput(
    "text", 
    "result", 
    "title", 
    data.title || "Title", 
    `-${parent}-${resultType}`
  );
  result.append(titleLabel);
  result.append(title);

  let {input: text, label: textLabel} = 
  createInput(
    "textarea", 
    "result", 
    "text", 
    data.text || "Text", 
    `-${parent}-${resultType}`
  );
  result.append(textLabel);
  result.append(text);
  
  let changesLabel = u.create("label");
  changesLabel.innerText = "Quality Changes";
  result.append(changesLabel); 

  let changeContainer = u.create("div");
  changeContainer.classList.add("change-container");
  result.append(changeContainer);

  let newChangeButton = u.create("button");
  newChangeButton.innerText = "+ New Change";
  newChangeButton.classList.add("add-change-button");
  newChangeButton.addEventListener("click", attachNewChange.bind(null, parent, resultType))
  result.append(newChangeButton);

  if (data.changes) {
    let count = 0;
    for (const change of data.changes) {
      const changeElement = createChange(change, parent, resultType, count);
      count++
      changeContainer.append(changeElement);
    }
  }

  return result;
}

function createChange(data, actionIdx, parent, count) {
  let change = u.create("div");
  change.classList.add("change");

  let qualityDiv = u.create("div");
  qualityDiv.classList.add("req-group");
  change.append(qualityDiv);

  let qualityLabel = u.create("label");
  qualityLabel.innerText = "Quality";
  qualityLabel.htmlFor = `action-${actionIdx}-${parent}-quality-${count}`;
  qualityDiv.append(qualityLabel);

  let qualitySelect = u.create("select");
  qualitySelect.id = `action-${actionIdx}-${parent}-quality-${count}`;
  for (const quality of Object.values(worldState.qualities)) {
    let option = u.create("option");
    option.value = quality.id;
    option.text = quality.name;
    qualitySelect.add(option);
  }
  qualitySelect.value = data.quality;
  qualityDiv.append(qualitySelect);

  let typeDiv = u.create("div");
  typeDiv.classList.add("req-group");
  change.append(typeDiv);

  let typeLabel = u.create("label");
  typeLabel.innerText = "Type";
  typeLabel.htmlFor = `action-${actionIdx}-${parent}-change-type-${count}`;

  let typeSelect = u.create("select");
  typeSelect.id = `action-${actionIdx}-${parent}-change-type-${count}`;
  
  let setOption = u.create("option");
  setOption.value = "set";
  setOption.text = "Set";
  typeSelect.add(setOption);

  let adjustOption = u.create("option");
  adjustOption.value = "adjust";
  adjustOption.text = "Adjust";
  typeSelect.add(adjustOption);

  typeSelect.value = data.type
  
  
  typeDiv.append(typeLabel);
  typeDiv.append(typeSelect);

  let valueDiv = u.create("div");
  valueDiv.classList.add("req-group");
  change.append(valueDiv);

  let {input: value, label: valueLabel} = createInput(
    "number", 
    "change", 
    "value", 
    data.value, 
    `action-${actionIdx}-${count}`);
  valueDiv.append(valueLabel);
  valueDiv.append(value);

  return change;
}

function createQualityForm(data) {
  let children = [];
  
  let form = u.create("form");
  form.id = "quality-form";
  
  let idLabel = u.create("p");
  idLabel.innerText = `ID: ${data.id}`;
  children.push(idLabel);

  let nameLabel = u.create("label");
  nameLabel.htmlFor = "quality-name";
  nameLabel.innerText = "Name";
  children.push(nameLabel);

  let nameInput = u.create("input");
  nameInput.type = "text";
  nameInput.name = "quality-name";
  nameInput.id = "quality-name";
  nameInput.value = data.name;
  children.push(nameInput);

  let startLabel = u.create("label");
  startLabel.htmlFor = "quality-starting-value";
  startLabel.innerText = "Starting Value";
  children.push(startLabel);

  let startInput = u.create("input");
  startInput.type = "text";
  startInput.name = "quality-starting-value";
  startInput.id = "quality-starting-value";
  startInput.value = data.startvalue;
  children.push(startInput);
  
  let descriptionsContainer = u.create("div");
  descriptionsContainer.id = "quality-descriptions-container";
  children.push(descriptionsContainer);

  let labelsContainer = u.create("div");
  labelsContainer.id = "quality-labels-container";
  children.push(labelsContainer);
        
  let categoryLabel = u.create("label");
  categoryLabel.htmlFor = "quality-categorying";
  categoryLabel.innerText = "Category";
  children.push(categoryLabel);

  let categoryInput = u.create("input");
  categoryInput.type = "text";
  categoryInput.name = "quality-category";
  categoryInput.id = "quality-category";
  categoryInput.value = data.category;
  children.push(categoryInput);

  let hiddenLabel = u.create("label");
  hiddenLabel.htmlFor = "quality-hidden";
  hiddenLabel.innerText = "Hidden";
  children.push(hiddenLabel);
     
  let hiddenInput = u.create("input");
  hiddenInput.type = "checkbox";
  hiddenInput.name = "quality-hidden";
  hiddenInput.id = "quality-hidden";
  hiddenInput.checked = data.hidden;
  children.push(hiddenInput);
  
  let saveButton = u.create("button");
  saveButton.innerText = "Save";
  saveButton.type="submit";
  saveButton.addEventListener("click", saveForm);
  children.push(saveButton);

  u.appendChildren(form, children);

  return form;
}

function createAndPopulateForm(id, type, event) {
  if (type === "quality") {
    const oldForm = document.getElementById("quality-form");
    if (oldForm) {
      oldForm.remove();
    }
    const data = worldState.qualities[id]
    const form = createQualityForm(data);
    document.getElementById("qualities-container").append(form);
  }
  else if (type === "story") {
    const oldForm = document.getElementById("story-form");
    if (oldForm) {
      oldForm.remove();
    }
    const data = worldState.stories[id]
    const form = createStoryForm(data);
    document.getElementById("stories-container").append(form);
  }
  else if (type === "domain") {
    //TBD
  }
  else if (type === "action") {
    //TBD
  }
  else if (type === "event") {
    //TBD
  }
}
