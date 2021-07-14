function createHeader(headerData) {
  let header = document.createElement("div");
  let title = document.createElement("h1");
  let text = document.createElement("p");

  header.classList.add("header");
  header.id = "header";
  title.innerText = headerData.title;
  text.innerText = headerData.text;

  header.appendChild(title);
  header.appendChild(text);

  return header;
}


function createOption(optionData) {
  let option = document.createElement("div");
  option.classList.add('option');

  let title = document.createElement("h1");
  title.innerText = optionData.title;
  option.appendChild(title);
  
  let text = document.createElement("p");
  text.innerText = optionData.text;
  option.appendChild(text);

  let challengeContainer = document.createElement('div');
  challengeContainer.classList.add("option-challenge-container");
  option.appendChild(challengeContainer);

  let reqsContainer = document.createElement('div');
  reqsContainer.classList.add("option-reqs-container");
  option.appendChild(reqsContainer);

  return option;
}

function createOptionReq(reqData){
  const req = document.createElement('div');
  req.classList.add('option-req');

  const label = document.createElement('h1');
  label.innerText = reqData.label;
  req.appendChild(label);

  if (!reqData.passed) {
    req.classList.add('req-disabled');
  }

  return req;
}


function createQualityCategory(category) {
  const newCategory = document.createElement('div');
  const newCategoryTitle = document.createElement('h1');
  newCategory.id = `cat-${category}`;
  newCategory.classList.add('qualities-category');
  newCategoryTitle.classList.add('qualities-category-title');
  newCategoryTitle.innerText = category;
  newCategory.appendChild(newCategoryTitle);

  return newCategory;
}

function createQuality(id, label, value, description = "", ) {
  const newQuality = document.createElement('div');
  newQuality.classList.add('quality');
  newQuality.id = `qual-${id}`;
  
  const newQualityTitle = document.createElement('p');
  newQualityTitle.classList.add('quality-title');
  newQualityTitle.innerText = `${label} • ${value}`
  newQuality.appendChild(newQualityTitle);

  if (description) {
    const newQualityDescription = document.createElement('p');
    newQualityDescription.innerHTML = description;
    newQualityDescription.classList.add('quality-description');
    newQuality.appendChild(newQualityDescription);
  }

  return newQuality;
}



function createConclusion(conclusion, changes = [], qualities = {}, challenge) {
  let newConclusion = document.createElement("div");
  let newConclusionTitle = document.createElement("h1");
  let newConclusionText = document.createElement("p");
  
  newConclusion.classList.add("conclusion");
  newConclusionTitle.innerText = conclusion.title;
  newConclusionText.innerText = conclusion.text;

  newConclusion.appendChild(newConclusionTitle);
  newConclusion.appendChild(newConclusionText);

  if (changes.length > 0) {
    let newConclusionOutcomes = document.createElement("div");
    newConclusionOutcomes.classList.add("conclusion-outcomes");

    if (challenge) {
      if (challenge.passed) {
        newConclusionOutcomes.classList.add("challenge-passed")
      } else {
        newConclusionOutcomes.classList.add("challenge-failed")
      }
      let outcome = document.createElement("p");
      let outcomeText = `You ${passed ? "passed" : "failed"} a ${qualities[challenge.quality].label} challenge!`
      outcome.innerText = outcomeText;
      newConclusionOutcomes.appendChild(outcome);
    }
    
    for (let change of changes) {
      let quality = change.quality;
      if (qualities[quality].hidden) continue;
      let outcome = document.createElement("p");
      let changePhrase = "";
      if (change.type === "set") {
        changePhrase = "is now"
      } else if (change.type === "adjust") {
        if (change.value > 0) {
          changePhrase = "increased by"
        } else {
          changePhrase = "decreased by"
        }
      }
      let outcomeText = `${qualities[quality].label} ${changePhrase} ${Math.abs(change.value)}.`
      outcome.innerText = outcomeText;
      newConclusionOutcomes.appendChild(outcome);
    }
    newConclusion.appendChild(newConclusionOutcomes);

    let seperator = document.createElement("div");
    seperator.classList.add("conclusion-seperator");

    newConclusion.appendChild(seperator);
  }
  return newConclusion
}

function createEvent(event, changes = [], qualities = {}) {
  let newEvent = document.createElement("div");
  let newEventTitle = document.createElement("h1");
  let newEventText = document.createElement("p");
  
  newEvent.classList.add("event");
  newEventTitle.innerText = event.title;
  newEventText.innerText = event.text;

  newEvent.appendChild(newEventTitle);
  newEvent.appendChild(newEventText);

  if (changes.length > 0) {
    let newEventOutcomes = document.createElement("div");

    newEventOutcomes.classList.add("event-outcomes");
    for (let change of changes) {
      let quality = change.quality;
      if (qualities[quality].hidden) continue;
      let outcome = document.createElement("p");
      let changePhrase = "";
      if (change.type === "set") {
        changePhrase = "is now"
      } else if (change.type === "adjust") {
        if (change.value > 0) {
          changePhrase = "increased by"
        } else {
          changePhrase = "decreased by"
        }
      }
      let outcomeText = `${qualities[quality].label} ${changePhrase} ${Math.abs(change.value)}.`
      outcome.innerText = outcomeText;
      newEventOutcomes.appendChild(outcome);
    }
    newEvent.appendChild(newEventOutcomes);

    let seperator = document.createElement("div");
    seperator.classList.add("event-seperator");

    newEvent.appendChild(seperator);
  }
  return newEvent
}

function createBackButton() {
  let backButton = document.createElement("button");
  backButton.innerText = "Go back."

  return backButton;
}

function createDrawButton() {
  let drawButton = document.createElement("button");
  drawButton.innerText = "Draw."

  return drawButton;
}

module.exports = { 
  createHeader,
  createOption, 
  createOptionReq,
  createQualityCategory, 
  createQuality,
  createConclusion,
  createEvent,
  createBackButton,
  createDrawButton 
};