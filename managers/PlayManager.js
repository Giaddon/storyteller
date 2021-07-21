const u = require("../utilities");
const QualityDisplay = require("../play/QualityDisplay");
const OptionsDisplay = require("../play/OptionsDisplay");

class PlayManager {
  constructor(api) {
    this.api = api;
    this.qualityDisplay = null;
    this.optionsDisplay = null;
  }

  startupPlay() {
    const root = document.getElementById("root");
    u.removeChildren(root);
    
    const canvas = u.create({tag: "div", classes: ["canvas"], id: "canvas"});
    root.append(canvas);

    const qualitiesContainer = u.create({tag: "div", classes: ["qualities-container"], id: "qualities-container"});
    canvas.append(qualitiesContainer);
    
    this.qualityDisplay = new QualityDisplay(this.api);
    const renderedQualities = this.qualityDisplay.render();
    qualitiesContainer.append(renderedQualities);

    const storyContainer = u.create({tag: "div", classes:["story-container"]});
    canvas.append(storyContainer);

    const resultContainer = u.create({tag: "div", classes:["result-container"], id: "result-container"});
    storyContainer.append(resultContainer);

    const headerContainer = u.create({tag: "div", classes:["header-container"], id: "header-container"});
    storyContainer.append(headerContainer);

    const optionsContainer = u.create({tag: "div", classes:["options-container"], id: "options-container"});
    storyContainer.append(optionsContainer);

    const start = this.api.getStart()
    const header = this.createHeader(start);

    this.optionsDisplay = new OptionsDisplay(this.api);
    const renderedOptions = this.optionsDisplay.render();
    optionsContainer.append(renderedOptions)
    
    headerContainer.append(header);

  }

  createHeader(headerData) {
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

  renderQuality(qualityId, value) {  
    const quality = this.api.getQuality(qualityId);
    if (quality.hidden) return;
    
    let displayValue = value.toString();
    let displayDescription = '';
  
    if (quality.labels && quality.labels.length > 0) {
      const keys = quality.labels.sort((a, b) => a.value - b.value);
      displayValue = quality.labels[Math.min(value, keys[keys.length - 1])];
    }

    if (quality.descriptions) {
      const keys = quality.descriptions.sort((a, b) => a.value - b.value);
      displayDescription = quality.descriptions[Math.min(value, keys[keys.length - 1])];
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


  createQualityCategory(category) {
    const newCategory = document.createElement('div');
    const newCategoryTitle = document.createElement('h1');
    newCategory.id = `cat-${category}`;
    newCategory.classList.add('qualities-category');
    newCategoryTitle.classList.add('qualities-category-title');
    newCategoryTitle.innerText = category;
    newCategory.appendChild(newCategoryTitle);

    return newCategory;
  }

  createQuality(id, label, value, description = "", ) {
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

}

module.exports = PlayManager