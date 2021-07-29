const schemas = {
  world: {
    qualities: {},
    categories: {},
    storylets: {},
    domains: {},
  },
  storylet: {
    title: "Storylet Title.",
    text: "Storylet text.",
    domain: "",
    start: false,
    reqs: {
      visibility: "always",
      qualities: [],
    },
    actions: {},
    locked: false,
    results: {
      neutral: {
        flow: "return"
      }
    }
  },
  action: {
    title: "New action",
    text: "Action text.",
    reqs: {
      visibility: "always",
      qualities: [],
    },
    challenges: [],
    results: {
      neutral: {
        title: "Neutral Result",
        text: "Result text.",
        flow: "return",
        changes: [],
      },
      success: {
        title: "Success Result",
        text: "Result text.",
        flow: "return",
        changes: [],
      },
      failure: {
        title: "Failure Result",
        text: "Result text.",
        flow: "return",
        changes: [],
      }
    },
  },
  quality: {
    name: "New Quality",
    startvalue: 0,
    descriptions: [],
    labels: [],
    category: "uncategorized",
    hidden: false,
  },
  category: {
    title: "New Category",
    order: 0,
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