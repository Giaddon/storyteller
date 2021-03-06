function replaceText(selector, text) {
  const element = document.getElementById(selector)
  if (element) element.innerText = text
}

function removeChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function create(elementObject) {
  const {tag, classes, id, content, value} = elementObject;
  const element = document.createElement(tag)
  if (classes) {
    for (let className of classes) {
      element.classList.add(className);
    }
  }
  if (id) element.id = id;
  if (content) element.innerText = content;
  if (value) element.value = value;
  return element;
}

function appendChildren(parent, children) {
  for (const child of children) {
    parent.append(child);
  }
}

//vanilla event delegation function taken from: 
//https://flaviocopes.com/javascript-event-delegation/
function on(selector, eventType, childSelector, eventHandler) {
  const elements = document.querySelectorAll(selector)
  for (element of elements) {
    element.addEventListener(eventType, eventOnElement => {
      if (eventOnElement.target.matches(childSelector)) {
        eventHandler(eventOnElement)
      }
    })
  }
}

module.exports = { 
  replaceText, 
  removeChildren, 
  on, 
  create,
  appendChildren, };