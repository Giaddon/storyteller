class Quality {
  constructor(data, value) {
    this.name = data.name;
    if (data.labels && data.labels.length > 0) {
      this.label = this.computeText(data.labels, value);
    }
    if (data.descriptions && data.descriptions.length > 0) {
      this.description = this.computeText(data.descriptions, value);
    }
    this.hidden = data.hidden;
    this.category = data.category;
    


  }

  computeText(textArrays, value) {
    let text;
    for (const item of textArrays) {
      if (Number(item.value) <= value) {
        text = item.text;
      } else {
        break;
      }
    }
    return text;
  }
}

module.exports = Quality;