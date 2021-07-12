function createAction(action) {
  const newAction = document.createElement("div");
  newAction.classList.add('action');

  const newActionTitle = document.createElement("h1");
  newActionTitle.innerText = action.title;
  newAction.appendChild(newActionTitle);
  
  const newActionText = document.createElement("p");
  newActionText.innerText = action.text;
  newAction.appendChild(newActionText);

  const newActionChallengeContainer = document.createElement('div');
  newActionChallengeContainer.classList.add("action-challenge-container");
  newAction.appendChild(newActionChallengeContainer);

  const newActionReqsContainer = document.createElement('div');
  newActionReqsContainer.classList.add("action-reqs-container");
  newAction.appendChild(newActionReqsContainer);

  return newAction;
}

function createActionReq(req){
  const newReq = document.createElement('div');
  newReq.classList.add('action-req');

  const label = document.createElement('h1');
  label.innerText = req.label;
  newReq.appendChild(label);

  if (!req.passed) {
    newReq.classList.add('req-disabled');
  }

  return newReq;
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

function createDomain(domain) {
  let newDomain = document.createElement("div");
  let newDomainTitle = document.createElement("h1");
  let newDomainText = document.createElement("p");

  newDomain.classList.add("domain");
  newDomain.id = "domain";
  newDomainTitle.innerText = domain.title;
  newDomainText.innerText = domain.text;

  newDomain.appendChild(newDomainTitle);
  newDomain.appendChild(newDomainText);

  return newDomain;
}

function createConclusion(conclusion, changes = [], qualities = {}) {
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
  }
  return newConclusion
}

module.exports = { 
  createDomain,
  createAction, 
  createActionReq,
  createQualityCategory, 
  createQuality,
  createConclusion };