const u = require("../utilities");
const Quality = require("./Quality");

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

  renderQuality(qualityData, value) {
    let quality = new Quality(qualityData, value);
    let displayValue = value.toString();

    const newQuality = u.create({tag: "div", classes: ["quality"]});
    const newQualityTitle = u.create({
      tag:"p", 
      classes:["quality-title"], 
      content:`${quality.name} • ${quality.label || displayValue}`
    });

    newQuality.append(newQualityTitle);
    const newQualityDescription = u.create({
      tag: "p",
      classes: ["quality-description"],
      content: quality.description || "",
    });
    newQuality.append(newQualityDescription);
  
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