let world = {
  qualities: {
    coins: {
      id: "coins",
      name: "Coins",
      startvalue: 5,
      category: "Currency",
      hidden: false,
    },
    credits: {
      id: "credits",
      name: "Credits",
      category: "Currency",
      hidden: false,
    },
    archetype: {
      id: "archetype",
      name: "Archetype",
      category: "Background",
      hidden: false,
    },
    spices: {
      id: "spices",
      name: "Spices",
      startvalue: 20,
      category: "Goods",
      hidden: false,
    },
    gems: {
      id: "gems",
      name: "Gems",
      startvalue: 4,
      category: "Goods",
      hidden: false,
    }
  },
}

let actions = {
  setWorld: (data) => {world = data},
  getQualities: () => ({...world.qualities}), 
}

module.exports = {actions};