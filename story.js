let qualities = {
  domain: {
    label: 'Domain',
    hidden: true,
  },
  archetype: {
    label: 'Archetype',
    category: 'Background',
    altValue: {
      1: 'Hero',
      2: 'Trader',
    },
    description: {
      1: "You've always been skilled at violence. You tried to use those skills in the right way.",
      2: "You're a trader!",
    }
  },
  strength: {
    label: 'Strength',
    category: 'Attributes',
    description: {
      1: "Your ability to hurt things.",
    },
  },
  cunning: {
    label: 'Cunning',
    category: 'Attributes',
    description: {
      1: "Your ability to trick things.",
    },
  },
  debt: {
    label: 'Debt',
  },
  credits: {
    label: 'Credits',
    category: 'Currency',
  },
}

let domains = {
  1: {
    title: 'Staring Down the Barrel of a Modified X-42 Laser Blaster',
    text: 'It\'s true what they say about your life flashing before your eyes when you\'re about to die. As the finger on the trigger starts to squeeze, what do you see?',
    actions: ['warrior', 'trader',],
  },
  2: {
    title: 'ZAP!',
    text: "The searing hot bolt of purple energy grazes your cheek. You're alive.\n\"Your kind isn't so useful with a laser-hole in your skull. Bring back a thousand credits. Or you're dead for real.\" \nThe enforcer whips her scaled tale behind her with a flourish and is gone.",
    actions: ['getUpTrader', 'getUpWarrior'],
  },
  3: {
    title: 'Blue Sun Station',
    text: 'A nexus of illegal trade, gambling, criminality, and other profitable activities. Orbits an ancient, artificial sun left behind by one of the countless species lost to the galaxy.',
    actions: ['casino', 'bazaar', 'shuttle'],
  },
  4: {
    title: 'The potion-seller\'s stall.',
    text: 'The stall has been sey set up on the side of the road. Numerous bottles populate the shelves.',
    actions: ['buyPotion']
  },
}

let actions = {
  warrior: {
    title: 'A life of adventure and conflict.',
    text: 'I was an explorer. A warrior. And to some, a hero.',
    results: {
      conclusion: {
        title: "A Hero.",
        text: "Of course it would end this way. You've made a lot of enemies as you fought your way across the galaxy.",
      },
      changes: [
        {
          type: 'set',
          quality: 'domain',
          value: 2,
        },
        {
          type: 'set',
          quality: 'archetype',
          value: 1,
        },
        {
          type: 'set',
          quality: 'cunning',
          value: 1,
        },
        {
          type: 'set',
          quality: 'strength',
          value: 3,
        },
      ]
    }
  },
  
  trader: {
    title: 'A life of industry and trade.',
    text: 'I was a negotiator. A merchant. I found opportunities few could.',
    results: {
      conclusion: {
        title: "A Trader",
        text: "Is this the result of an exchange gone wrong? With a little more time, you're sure you could find a way out of this. There's always a way to make a deal.",
      },
      changes: [
        {
          type: 'set',
          quality: 'domain',
          value: 2,
        },
        {
          type: 'set',
          quality: 'archetype',
          value: 2,
        },
        {
          type: 'set',
          quality: 'cunning',
          value: 3,
        },
        {
          type: 'set',
          quality: 'strength',
          value: 1,
        },
      ]
    }
  },

  getUpTrader: {
    title: 'Pick yourself up.',
    text: 'All this over a thousand credits?',
    reqs: {
      type: 'all',
      qualities: [
        {
          quality: 'archetype',
          min: 2,
          max: 2
        }
      ]
    },
    results: {
      changes: [
        {
          quality: 'domain',
          type: 'set',
          value: 3,
        }
      ]
    }
  },
 
  getUpWarrior: {
    title: 'Pick yourself up.',
    text: 'A thousand credits!?',
    reqs: {
      type: 'all',
      qualities: [
        {
          quality: 'archetype',
          min: 1,
          max: 1
        }
      ]
    },
    results: {
      conclusion: {
        title: "A debt to pay.",
        text: "A thousand credits is a lot to scrape together quickly. Fortunately this station is home to a lot of black market hustlers and gangsters. Plenty of people with money who need some muscle."
      },
      changes: [
        {
          quality: 'domain',
          type: 'set',
          value: 3,
        },
        {
          quality: 'debt',
          type: 'set',
          value: 1,
        },
        {
          quality: 'credits',
          type: 'set',
          value: 10,
        },
      ]
    }
  },

  buyPotion: {
    title: 'Buy a potion.',
    text: 'What kind of potion? So many questions!',
    reqs: {
      type: 'any',
      qualities: [
        {
          quality: 'coins',
          type: 'min',
          value: 3,
        },
      ]
    },
    results: {
      changes: [
        {
          type: 'adjust',
          quality: 'coins',
          value: -3,
        },
        {
          type: 'adjust',
          quality: 'potions',
          value: 1,
        }
      ]
    }
  },

  drinkPotion: {
    title: 'Drink a potion.',
    text: 'The liquid glows in the umber bottle.',
    reqs: {
      type: 'any',
      qualities: [
        {
          quality: 'potions',
          type: 'min',
          value: 1,
        },
      ]
    },
    results: {
      conclusion: {
        title: 'You quaff the potion.',
        text: 'It\'s surprisingly sweet.',
      },
      changes: [
        {
          type: 'adjust',
          quality: 'potions',
          value: -1,
        },
      ]
    }
  },

}

module.exports = { domains, actions, qualities };