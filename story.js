let domains = {
  1: {
    title: 'A beginning.',
    text: 'Your adventure stretches before you, full of promise.',
    actions: ['rest', 'onward'],
  },
  2: {
    title: 'A nap, first.',
    text: 'Adventure? Sounds great! But first, perhaps a small nap to prepare yourself for the challenges ahead.',
    actions: ['onward'],
  },
}

let actions = {
  rest: {
    text: 'Rest.',
    results: {
      changes: [
        {
          type: 'modify',
          quality: 'domain',
          value: 2,
        }
      ]
    }
  },
  onward: {
    text: 'Onward!',
    results: {
      changes: [
        {
          type: 'modify',
          quality: 'domain',
          value: 2,
        }
      ]
    }
  },
}

module.exports = { domains, actions };