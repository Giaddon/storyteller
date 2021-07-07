let domains = {
  1: {
    title: 'A beginning.',
    text: 'Your adventure stretches before you, full of promise.',
    actions: ['rest', 'onward', 'buyPotion', 'drinkPotion'],
  },
  2: {
    title: 'A nap, first.',
    text: 'Adventure? Sounds great! But first, perhaps a small nap to prepare yourself for the challenges ahead.',
    actions: ['onward'],
  },
}

let actions = {
  rest: {
    title: 'Rest.',
    text: 'Rest.',
    reqs: [
      {
        quality: 'coins',
        type: 'min',
        value: 11,
      },
    ],
    results: {
      changes: [
        {
          type: 'set',
          quality: 'domain',
          value: 2,
        }
      ]
    }
  },
  
  onward: {
    title: 'Onward',
    text: 'Onward!',
    results: {
      changes: [
        {
          type: 'set',
          quality: 'domain',
          value: 2,
        }
      ]
    }
  },

  buyPotion: {
    title: 'Buy a potion.',
    text: 'What kind of potion? So many questions!',
    reqs: [
      {
        quality: 'coins',
        type: 'min',
        value: 3,
      },
    ],
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
    reqs: [
      {
        quality: 'potions',
        type: 'min',
        value: 1,
      },
    ],
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

module.exports = { domains, actions };