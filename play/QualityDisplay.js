const u = require("../utilities");
const Quality = require("./Quality");

class QualityDisplay {
  constructor(api, mainCycle) {
    this.api = api;
    this.mainCycle = mainCycle;
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

    let categories = {};
    for (const [id, value] of Object.entries(playerQualities)) {
      const qualityData = this.api.getQuality(id)
      if (qualityData.hidden) continue;
      const quality = new Quality(qualityData, value, this.api.isInStorylet(), this.mainCycle)
      if (quality.category === "uncategorized") {
        uncategorizedContainer.append(quality.render()) 
      } else {
        if (categories[quality.category]) {
          categories[quality.category].qualities.push(quality.render())
        } else {
          const categoryData = this.api.getCategory(quality.category);
          categories[quality.category] = {
            qualities: [quality.render()],
            order: categoryData.order,
            title: categoryData.title,
          } 
        }
      }
    }

    const orderedCategories = Object.values(categories).sort((a, b) => a.order - b.order);

    for (const category of orderedCategories) {
      let renderedCategory = this.renderQualityCategory(category);
      qualitiesCategoriesContainer.append(renderedCategory);
    }

    if (uncategorizedContainer.children.length < 2) {
      uncategorizedContainer.remove();
    }

    return qualitiesList;
  }

  renderQualityCategory(category) {
    const newCategory = u.create({tag: "div", classes: ["qualities-catagory"]})
    
    const newCategoryTitle = u.create({
      tag: "h1", 
      classes:["qualities-category-title"], 
      content: category.title
    }) 
    newCategory.append(newCategoryTitle);

    for (const quality of category.qualities) {
      newCategory.append(quality);
    }

    return newCategory;
  }

}

module.exports = QualityDisplay;