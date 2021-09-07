const u = require("../utilities");
const Quality = require("./Quality");

class QualityDisplay {
  constructor({state}) {
    this.state = state;
  }

  updateQualities(changes) {
    const qualitiesCategoriesContainer = document.getElementById("qualities-categories-container");
    const playerQualities = this.state.getPlayerQualities();
    //const changes = this.state.getChanges();

    for (const change of changes) {
      const qualityData = this.state.getQuality(change.quality);
      if (qualityData.hidden) {
        continue;
      }
      const value = playerQualities[change.quality] || 0;
      const quality = new Quality(qualityData, value, this.state.isInStorylet(), this.state);
      const targetQuality = document.getElementById(`q-${change.quality}`);
      const categoryData = this.state.getCategory(qualityData.category);
      const targetCategory = document.getElementById(`q-cat-${categoryData.id}`)
      if (targetQuality) {
        if (value < 1) {
          targetQuality.remove();
          if (targetCategory.children.length < 2) {
            targetCategory.remove();
          }
        } else {
          const renderedQuality = quality.render();
          targetQuality.replaceWith(renderedQuality);
        }
      } else {
        if (value < 1) {
          continue;
        } else {
          if (targetCategory) {
            const renderedQuality = quality.render();
            targetCategory.append(renderedQuality);
          } else {
            const renderedQuality = quality.render();
            const renderedCategory = this.renderQualityCategory({
              qualities: [renderedQuality],
              id: categoryData.id,
              order: categoryData.order,
              title: categoryData.title,
            })

            const categories = qualitiesCategoriesContainer.children;

            let nextCategory;
            for (const category of categories) {
              nextCategory = category;
              if (category.dataset.order > categoryData.order) {
                break;
              }
            }
            if (nextCategory) {
              if (nextCategory.dataset.order < categoryData.order) {
                nextCategory = null;
              }
            }
            qualitiesCategoriesContainer.insertBefore(renderedCategory, nextCategory);
          }
        }
      }
    }

    for (const [qualityId, value] of Object.entries(playerQualities)) {
      const qualityData = this.state.getQuality(qualityId);
      if (qualityData.storylet !== "none") {
        const targetQuality = document.getElementById(`q-${qualityId}`);
        const quality = new Quality(qualityData, value, this.state.isInStorylet(), this.state);
        const renderedQuality = quality.render();
        targetQuality.replaceWith(renderedQuality);
      }
    }

  }

  render() {
    const playerQualities = this.state.getPlayerQualities();
    
    const qualitiesList = u.create({tag: "div"});

    const qualitiesTitle = u.create({tag: "h1", classes: ["play-qualities-title"], content: "Qualities"});
    qualitiesList.append(qualitiesTitle);
      
    const qualitiesCategoriesContainer = u.create({
      tag: "div", 
      classes: ["play-qualities-categories-container"], 
      id: "qualities-categories-container"
    });
    qualitiesList.append(qualitiesCategoriesContainer);

    const uncategorizedContainer = u.create({tag: "div", id: "q-cat-uncategorized"});
    qualitiesList.append(uncategorizedContainer);

    const uncategorizedTitle = u.create({
      tag: "h1", 
      classes: ["play-qualities-category-title"], 
      content: "Uncategorized"
    });
    uncategorizedContainer.append(uncategorizedTitle);

    let categories = {};
    for (const [id, value] of Object.entries(playerQualities)) {
      const qualityData = this.state.getQuality(id)
      if (qualityData.hidden) continue;
      const quality = new Quality(qualityData, value, this.state.isInStorylet(), this.state)
      if (quality.category === "uncategorized") {
        uncategorizedContainer.append(quality.render()) 
      } else {
        if (categories[quality.category]) {
          categories[quality.category].qualities.push(quality.render())
        } else {
          const categoryData = this.state.getCategory(quality.category);
          categories[quality.category] = {
            qualities: [quality.render()],
            order: categoryData.order,
            title: categoryData.title,
            id: categoryData.id
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
    const newCategory = u.create({
      tag: "div", 
      classes: ["play-qualities-category"],
      id: `q-cat-${category.id}`
    })
    newCategory.dataset.order = category.order;

    const newCategoryTitle = u.create({
      tag: "h1", 
      classes:["play-qualities-category-title"], 
      content: category.title,
    }) 
    newCategory.append(newCategoryTitle);

    for (const quality of category.qualities) {
      newCategory.append(quality);
    }

    return newCategory;
  }

}

module.exports = QualityDisplay;