function createAction(action) {
  const newAction = document.createElement("div");
  newAction.classList.add('action');

  const newActionTitle = document.createElement("h1");
  newActionTitle.innerText = action.title;
  newAction.appendChild(newActionTitle);
  
  const newActionText = document.createElement("p");
  newActionText.innerText = action.text;
  newAction.appendChild(newActionText);

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

module.exports = { 
  createAction, 
  createActionReq,
  createQualityCategory, 
  createQuality };