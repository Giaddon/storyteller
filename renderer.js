let qualityData; // holds the quality object imported from the game .json.
let activeDomain; // holds the active domain, built from the game .json.

window.addEventListener('DOMContentLoaded', () => {
  setupToolbar();
  startGame("bluesun.json"); 
  for (const [quality, value] of Object.entries(game.getAllQualities())) {
    renderQuality(quality, value);
  }
})


function startGame(gameName) {
  qualityData = window.game.loadStory(gameName);
  if (qualityData) {
    Object.freeze(qualityData);
    let qualityArray = Object.entries(qualityData);
    for (let [id, quality] of qualityArray) {
      if (quality.startvalue) {
        console.log(game);
        game.actions.set(id, quality.startvalue);
      }
    }

    const playerDomain = window.game.getQuality('domain');
    activeDomain = window.game.loadDomain(playerDomain);
    renderDomain(activeDomain);
  } else {
    console.error("Error loading story!");
  }
}

function renderDomain(domain) {
  const actionsContainer = document.querySelector("#actions-container");
  
  game.u.replaceText('domain-title', domain.title);
  game.u.replaceText('domain-text', domain.text);
  game.u.removeChildren(actionsContainer);

  if (domain.actions && domain.actions.length > 0) {
    for (let action of domain.actions) {
      let newAction = game.components.createAction(actionId, action, game.getAllQualities());
      prepareAction(newAction, action, window.game.getAllQualities(), )
      actionsContainer.appendChild(newAction);
    }
  }
}

function prepareAction(actionElement, actionData, qualities) {
  actionElement.addEventListener('click', (event) => {
    for (let change of actionData.results.changes) {
      switch (change.type) {
        case 'set':
          game.actions.set(change.quality, change.value);
          break;
        case 'adjust':
          game.actions.adjust(change.quality, change.value);
          break;
        default:
          console.error('No valid change type found.');
      }
      //renderQuality(change.quality, qualities[change.quality]);

      // if (action.results.conclusion) {
      //   u.removeChildren(conclusionContainer);
      //   const conclusion = actionData.results.conclusion;
      //   const newConclusion = document.createElement("div");
      //   const newConclusionTitle = document.createElement("h1");
      //   const newConclusionText = document.createElement("p");

      //   newConclusionTitle.innerText = conclusion.title;
      //   newConclusionText.innerText = conclusion.text;

      //   newConclusion.appendChild(newConclusionTitle);
      //   newConclusion.appendChild(newConclusionText);

      //   conclusionContainer.appendChild(newConclusion);

      // }
    }
      const activeDomain = story.domains[game.getQuality("domain")]
      renderDomain(activeDomain);
  }) // end click event
}

function setupToolbar() {
  const qualitiesContainer = document.getElementById('qualities-container');
  document.getElementById('qualities-button').addEventListener('click', (event) => {
    event.preventDefault();
    qualitiesContainer.classList.toggle('offstage');
  }) // end quality button click handler
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