const u = require("../utilities");

class HeaderDisplay {
  constructor(api) {
    this.api = api;
  }

  render() {
    const {title, text} = this.api.getContext();
    const headerElement = u.create({tag:"div", classes:["header"], id: "header"});
    const titleElement = u.create({tag: "h1", content: title});
    const textElement = u.create({tag:"p", content: text}); 
    headerElement.append(titleElement);
    headerElement.append(textElement);
    return headerElement;
  }
}

module.exports = HeaderDisplay;