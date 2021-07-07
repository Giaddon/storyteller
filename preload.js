const u = require('./utilities.js');
const state = require('./state.js');
const story = require('./story.js');

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
  
  for (let selector of ['title', 'text']) {
    u.replaceText(`${selector}`, activeDomain[selector]);
  }

  u.removeChildren(actionsContainer);

  if (activeDomain.actions.length > 0) {
    for (let actionId of activeDomain.actions) {
      const action = story.actions[actionId];
      let reqArray = [];
      if (action.reqs && action.reqs.length > 0) {
        for (let req of action.reqs) {
          switch (req.type) {
            case 'min':
              reqArray.push(state.qualities[req.quality] >= req.value)
              break;
            default:
              console.error('No valid requirement type found.')
          }
        }
      }
      if (reqArray.length > 0 && !reqArray.every(passed => passed)) continue;

      const newAction = document.createElement("div");
      newAction.classList.add('action');
      
      const newActionTitle = document.createElement("h1");
      newActionTitle.innerText = action.title;
      newAction.appendChild(newActionTitle);
      
      const newActionText = document.createElement("p");
      newActionText.innerText = action.text;
      newAction.appendChild(newActionText);

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

      actionsContainer.append(newAction);
    }
  }
}

function renderQuality(quality, value) {  
  const qualitiesContainer = document.getElementById('qualities-container');
  const targetQuality = document.getElementById(quality);
  if (targetQuality) {
    if (!value) targetQuality.remove();
    else targetQuality.lastElementChild.innerText = `${value.toString()}`;
  }
  else {
    if (!value) return;
    const newQuality = document.createElement('div');
    const newQualityTitle = document.createElement('h1');
    const newQualityValue = document.createElement('p');

    newQualityTitle.innerText = `${quality}:`
    newQualityValue.innerText = `${value.toString()}`

    newQuality.appendChild(newQualityTitle);
    newQuality.appendChild(newQualityValue);

    newQuality.classList.add('quality');
    newQuality.id = quality;

    qualitiesContainer.appendChild(newQuality);
  }
}

function setupToolbar() {
  const qualitiesContainer = document.getElementById('qualities-container');
  document.getElementById('qualities-button').addEventListener('click', (event) => {
    event.preventDefault();
    qualitiesContainer.classList.toggle('offstage');
  }) // end quality button click handler
}