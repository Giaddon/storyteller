const u = require('./utilities.js');
const state = require('./state.js');
const story = require('./story.js');
const components = require('./components.js');

customElements.define('action-div', Action, { extends: 'div' });

window.addEventListener('DOMContentLoaded', () => {
  setupToolbar();
  renderDomain();
  for (const [quality, value] of Object.entries(state.qualities)) {
    renderQuality(quality, value);
  }
})

function renderDomain() {
  const activeDomain = story.domains[state.qualities.domain];
  const conclusionContainer = document.getElementById('conclusion-container');
  const actionsContainer = document.getElementById('actions-container');
  
  u.replaceText('domain-title', activeDomain.title);
  u.replaceText('domain-text', activeDomain.text);
  u.removeChildren(actionsContainer);
  if (!activeDomain.locked && state.game.lastDomain) {
    const backButton = document.getElementById('back-button');
    backButton.disabled = false;
    backButton.removeEventListener('click', clickBackButton);
    backButton.addEventListener('click', clickBackButton)
  }

  if (activeDomain.actions && activeDomain.actions.length > 0) {
    for (let actionId of activeDomain.actions) {
      const action = story.actions[actionId];
      let reqArray = [];
      if (action.reqs && action.reqs.qualities.length > 0) {
        for (let req of action.reqs.qualities) {
          let min = req.min || -Infinity;
          let max = req.max || Infinity;
          reqArray.push((state.qualities[req.quality] >= min && 
            state.qualities[req.quality] <= max))
        }
      }
      let disabled = false;
      if (action.reqs && action.reqs.type === 'all') {
        if (reqArray.length > 0 && !reqArray.every(passed => passed)) {
          disabled = true;
        }
      } else if (action.reqs && action.reqs.type === 'any') {
        if (reqArray.length > 0 && !reqArray.some(passed => passed)) {
          disabled = true;
        }
      }
      

      const newAction = document.createElement("div");
      newAction.classList.add('action');
      
      const newActionTitle = document.createElement("h1");
      newActionTitle.innerText = action.title;
      newAction.appendChild(newActionTitle);
      
      const newActionText = document.createElement("p");
      newActionText.innerText = action.text;
      newAction.appendChild(newActionText);

      if (disabled) { 
        newAction.classList.add('action-disabled');
      } else {
        newAction.setAttribute('tabindex', '0');
        
        newAction.addEventListener('click', (event) => {
          u.removeChildren(conclusionContainer);
          
          for (let change of action.results.changes) {
            switch (change.type) {
              case 'set':
                state.actions.set(change.quality, change.value);
                break;
              case 'adjust':
                state.actions.adjust(change.quality, change.value);
                break;
              default:
                console.error('No valid change type found.');
            }
            renderQuality(change.quality, state.qualities[change.quality]);

            if (action.results.conclusion) {
              u.removeChildren(conclusionContainer);
              const conclusion = action.results.conclusion;
              const newConclusion = document.createElement("div");
              const newConclusionTitle = document.createElement("h1");
              const newConclusionText = document.createElement("p");

              newConclusionTitle.innerText = conclusion.title;
              newConclusionText.innerText = conclusion.text;

              newConclusion.appendChild(newConclusionTitle);
              newConclusion.appendChild(newConclusionText);

              conclusionContainer.appendChild(newConclusion);

            }
          }
          renderDomain();
          
        }) // end click event
      } // end if disabled
      actionsContainer.append(newAction);
    }
  }
}

function renderQuality(qualityId, value) {  
  const quality = story.qualities[qualityId];
  if (quality.hidden) return;
  
  let displayValue = value.toString();
  let displayDescription = '';

  if (quality.altValue) {
    const keys = Object.keys(quality.altValue).sort((a, b) => a - b);
    displayValue = quality.altValue[Math.min(value, keys[keys.length - 1])];
  }
  if (quality.description) {
    const keys = Object.keys(quality.description).sort((a, b) => a - b);
    displayDescription = quality.description[Math.min(value, keys[keys.length - 1])];
  }

  const qualitiesContainer = document.getElementById('qualities-categories-container');
  const targetQuality = document.getElementById(`qual-${qualityId}`);
  if (targetQuality) {
    const parent = targetQuality.parentElement;
    if (!value) {
      targetQuality.remove();
      if (parent.classList.contains('quality-category') && parent.children.length < 2) {
        parent.remove();
      }
    } else targetQuality.firstElementChild.innerText = `${quality.label} • ${displayValue}`;
  }
  else {
    if (!value) return;

    let parent;
    const category = quality.category || 'Uncategorized';
    let targetCategory = document.getElementById(`cat-${category}`);
    if (targetCategory) {
      parent = targetCategory;
    }
    if (!parent) {
      const newCategory = document.createElement('div');
      const newCategoryTitle = document.createElement('h1');
      newCategory.id = `cat-${category}`;
      newCategory.classList.add('qualities-category');
      newCategoryTitle.classList.add('qualities-category-title');
      newCategoryTitle.innerText = category;
      newCategory.appendChild(newCategoryTitle);
      qualitiesContainer.appendChild(newCategory);
      parent = newCategory;
    }
    
    const newQuality = document.createElement('div');
    const newQualityTitle = document.createElement('p');
    newQualityTitle.classList.add('quality-title');
    newQualityTitle.innerText = `${quality.label} • ${displayValue}`

    newQuality.appendChild(newQualityTitle);

    if (displayDescription) {
      const newQualityDescription = document.createElement('p');
      newQualityDescription.innerHTML = displayDescription;
      newQualityDescription.classList.add('quality-description');
      newQuality.appendChild(newQualityDescription);
    }

    newQuality.classList.add('quality');
    newQuality.id = `qual-${qualityId}`;

    parent.appendChild(newQuality);
  }
}

function setupToolbar() {
  const qualitiesContainer = document.getElementById('qualities-container');
  document.getElementById('qualities-button').addEventListener('click', (event) => {
    event.preventDefault();
    qualitiesContainer.classList.toggle('offstage');
  }) // end quality button click handler
}

function clickBackButton(event) {
  event.preventDefault();
  const previousDomain = state.game.lastDomain;
  state.actions.set('domain', previousDomain);
  renderQuality('domain', previousDomain);
  u.removeChildren(document.getElementById('conclusion-container'));
  renderDomain();
}