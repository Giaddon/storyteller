function replaceText(selector, text) {
  const element = document.getElementById(selector)
  if (element) element.innerText = text
}

function removeChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

module.exports = { replaceText, removeChildren };