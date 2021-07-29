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
      
    const qualitiesCategoriesContainer = u.create({
      tag: "div", 
      classes: ["qualities-catagories-container"], 
      id: "qualities-catagories-container"
    });
    qualitiesList.append(qualitiesCategoriesContainer);

    const uncategorizedContainer = u.create({tag: "div", id: "cat-Uncategorized"});
    qualitiesList.append(uncategorizedContainer);

    const uncategorizedTitle = u.create({
      tag: "h1", 
      classes: ["qualities-category-title"], 
      content: "Uncategorized"
    });
    uncategorizedContainer.append(uncategorizedTitle);

    let categories = {}
    for (const [id, value] of Object.entries(playerQualities)) {
      const qualityData = this.api.getQuality(id)
      if (qualityData.hidden) continue;
      const quality = new Quality(qualityData, value)
      if (!quality.category) {
        uncategorizedContainer.append(quality.render()) 
      } else {
        if (categories[quality.category]) {
          categories[quality.category].push(quality.render())
        } else {
          categories[quality.category] = [quality.render()]
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