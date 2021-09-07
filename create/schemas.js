const schemas = {
  world: {
    details: {},
    qualities: {},
    categories: {},
    storylets: {},
    domains: {},
  },
  details: {
    name: "Game Name",
    author: "Author",
    description: "Description text.",
    version: "Version"
  },
  storylet: {
    title: "Storylet Title.",
    text: "Storylet text.",
    domain: "",
    start: false,
    locked: false,
    reqs: {
      visibility: "always",
      qualities: [],
    },
    actions: {},
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
  change: {
    quality: "",
    min: 0,
    max: 0,
    logic: [],
  },
  quality: {
    name: "New Quality",
    startvalue: 0,
    max: 0,
    descriptions: [],
    labels: [],
    category: "uncategorized",
    hidden: false,
    storylet: "none",
  },
  category: {
    title: "New Category",
    order: 0,
  },
  domain: {
    title: "New Domain",
    text: "Domain text.",
    locked: false,
    destination: true,
    storylets: [],
    decks: {},
    events: [],
  },

}

module.exports = schemas;