const schemas = {
  storylet: {
    title: "Storylet Title.",
    text: "Storylet text.",
    reqs: {
      visibility: "always",
      qualities: [],
    },
    actions: {},
  },
  quality: {
    name: "New Quality",
    startvalue: 0,
    descriptions: [],
    labels: [],
    category: "",
    hidden: false,
  }
}

module.exports = schemas;