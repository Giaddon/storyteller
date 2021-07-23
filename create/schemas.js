const schemas = {
  storylet: {
    title: "Storylet Title.",
    text: "Storylet text.",
    reqs: {
      visibility: "always",
      qualities: [],
    },
    actions: {},
    locked: false,
  },
  quality: {
    name: "New Quality",
    startvalue: 0,
    descriptions: [],
    labels: [],
    category: "",
    hidden: false,
  },
  domain: {
    title: "New Domain",
    text: "Domain text.",
    locked: false,
    storylets: [],
    decks: [],
    events: [],
  },

}

module.exports = schemas;