const u = require("../utilities");

class QualityDisplay {
  constructor(api) {
    this.api = api;
  }

  render() {
    const playerQualities = this.api.getPlayerQualities();
    
    const qualitiesList = u.create({tag: "div"});

    const qualitiesTitle = u.create({tag: "h1", classes: ["qualities-title"], content: "Qualities"});
    qualitiesList.append(qualitiesTitle);
      
    const qualitiesCategoriesContainer = u.create({tag: "div", classes: ["qualities-catagories-container"], id: "qualities-catagories-container"});
    qualitiesList.append(qualitiesCategoriesContainer);

    const uncategorizedContainer = u.create({tag: "div", id: "cat-Uncategorized"});
    qualitiesList.append(uncategorizedContainer);

    const uncategorizedTitle = u.create({tag: "h1", classes: ["qualities-category-title"], content: "Uncategorized"});
    uncategorizedContainer.append(uncategorizedTitle);

    let categories = {}
    for (const [id, value] of Object.entries(playerQualities)) {
      const quality = this.api.getQuality(id)
      if (quality.hidden) continue;
      if (!quality.category) {
        uncategorizedContainer.append(this.renderQuality(quality, value)) 
      } else {
        if (categories[quality.category]) {
          categories[quality.category].push(this.renderQuality(quality, value))
        } else {
          categories[quality.category] = [this.renderQuality(quality, value)]
        }
      }
    }
    for (const [category, qualities] of Object.entries(categories)) {
      let renderedCategory = this.renderQualityCategory(category);
      for (const renderedQuality of qualities) {
        renderedCategory.append(renderedQuality);
      }
      qualitiesCategoriesContainer.append(renderedCategory);
    }

    return qualitiesList;
  }

  renderQuality(quality, value) {
    let displayValue = value.toString();
    let displayDescription = '';
  
    if (quality.labels && quality.labels.length > 0) {
      for (const label of quality.labels) {
        if (Number(label.value) <= value) {
          displayValue = label.label;
        } else {
          break;
        }
      }
    }

    if (quality.descriptions && quality.descriptions.length > 0) {
      for (const description of quality.descriptions) {
        if (Number(description.value) <= value) {
          displayDescription = description.description;
        } else {
          break;
        }
      }
    }
  
    const newQuality = u.create({tag: "div", classes: ["quality"]});
    const newQualityTitle = u.create({
      tag:"p", 
      classes:["quality-title"], 
      content:`${quality.name} • ${displayValue}`
    });

    newQuality.append(newQualityTitle);
  
    if (displayDescription) {
      const newQualityDescription = u.create({
        tag: "p",
        classes: ["quality-description"],
        content: displayDescription,
      });
      newQuality.append(newQualityDescription);
    }
    return newQuality;
  }

  renderQualityCategory(category) {
    const newCategory = u.create({tag: "div", classes: ["qualities-catagory"], id: `cat-${category}`})
    
    const newCategoryTitle = u.create({
      tag: "h1", 
      classes:["qualities-category-title"], 
      content: category
    }) 

    newCategory.append(newCategoryTitle);

    return newCategory;
  }

}

module.exports = QualityDisplay;