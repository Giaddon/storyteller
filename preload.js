const u = require('./utilities.js');
const state = require('./state.js');
const story = require('./story.js');

window.addEventListener('DOMContentLoaded', () => {
  renderDomain();

  document.getElementById('increase').addEventListener('click', (event) => {
    state.actions.increase();
    refreshCount();
  })
  document.getElementById('decrease').addEventListener('click', (event) => {
    state.actions.decrease();
    refreshCount();
  })

})

function renderDomain() {
  const activeDomain = story.domains[state.qualities.domain];
  for (let selector of ['title', 'text']) {
    u.replaceText(`${selector}`, activeDomain[selector]);
  }
  const actionsContainer = document.getElementById('actions-container');
  while (actionsContainer.firstChild) {
    actionsContainer.removeChild(actionsContainer.firstChild);
  }

  if (activeDomain.actions.length > 0) {
    for (let actionId of activeDomain.actions) {
      const action = story.actions[actionId];
      
      const newAction = document.createElement("div");
      newAction.classList.add('action');
      
      const newActionText = document.createElement("p");
      newActionText.innerText = action.text;
      newAction.appendChild(newActionText);
      
      newAction.addEventListener('click', (event) => {
        for (let change of action.results.changes) {
          switch (change.type) {
            case 'modify':
              state.actions.modify(change.quality, change.value);
              break;
            default:
              console.log('No valid change type found.');
          }
          renderDomain();
        }
        
        
      })

      actionsContainer.append(newAction);
    }
  }
}



function refreshCount() {
  for (const id of ['count']) {
    u.replaceText(`${id}`, state.qualities.count);
  }
}