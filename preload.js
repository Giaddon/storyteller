const Storyteller = require("./managers/Storyteller");

const storyteller = new Storyteller();

window.addEventListener('DOMContentLoaded', () => {
  storyteller.mainMenuManager.startup();
});