const u = require("../utilities");

class PlayManager {
  constructor(api) {
    this.api = api;
  }

  startupPlay() {
    const root = document.getElementById("root");
    u.removeChildren(root);
    
    const canvas = u.create({tag: "div", classes: ["canvas"], id: "canvas"});
    root.append(canvas);

    const qualitiesContainer = u.create({tag: "div", classes: ["qualities-container"], id: "qualities-container"});
    canvas.append(qualitiesContainer);
    
    const qualitiesTitle = u.create({tag: "h1", classes: ["qualities-title"], content: "Qualities"});
    qualitiesContainer.append(qualitiesTitle);
      
    const qualitiesCategoriesContainer = u.create({tag: "div", classes: ["qualities-catagories-container"], id: "qualities-catagories-container"});
    qualitiesContainer.append(qualitiesCategoriesContainer);

    const uncategorizedContainer = u.create({tag: "div", id: "cat-Uncategorized"});
    qualitiesContainer.append(uncategorizedContainer);

    const uncategorizedTitle = u.create({tag: "h1", classes: ["qualities-category-title"], content: "Uncategorized"});
    uncategorizedContainer.append(uncategorizedTitle);

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
}

module.exports = PlayManager