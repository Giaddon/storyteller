const u = require("../utilities");

class HeaderDisplay {
  constructor({state}) {
    this.state = state;
  }

  render() {
    const {title, text} = this.state.getContext();
    const headerElement = u.create({tag:"div", classes:["header"], id: "header"});
    const titleElement = u.create({tag: "h1", content: title});
    const textElement = u.create({tag:"p", content: text}); 
    headerElement.append(titleElement, textElement);

    return headerElement;
  }
}

module.exports = HeaderDisplay;