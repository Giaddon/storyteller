let qualities = {
  domain: 1,
};

let game = {
  lastDomain: null,
}

let actions = {
  set: (quality, value) => {
    if (quality === 'domain') game.lastDomain = qualities.domain;
    qualities[quality] = value; 
  },

  adjust: (quality, value) => {
    if (quality === 'domain') game.lastDomain = qualities.domain;
    if (!qualities[quality]) qualities[quality] = 0;
    qualities[quality] += value;
    if (qualities[quality] < 1) delete qualities[quality];
  },

}

module.exports = { qualities, actions, game };