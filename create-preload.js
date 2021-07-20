const CreateManager = require("./create/CreateManager");
const StateAPI = require("./create/StateAPI");

// TODO
// RESULTS
// - More change logic 
// -- if x then y?
// -- using other qualities numbers?
// -- Change type random (set to a random # within range.)
// QUALITIES
// - Quality types (items vs attribues)?
// - Messages? 
// DOMAINS
// - Figure out event and card implementation. 

const api = new StateAPI("newworld.json");
const manager = new CreateManager(api);

window.addEventListener('DOMContentLoaded', () => {
  manager.populateSectionList();

});