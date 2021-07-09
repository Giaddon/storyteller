function replaceText(selector, text) {
  const element = document.getElementById(selector)
  if (element) element.innerText = text
}

function removeChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

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

module.exports = { replaceText, removeChildren, on };