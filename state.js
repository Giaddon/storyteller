let qualities = {
  domain: 1,
  coins: 15,
};

let actions = {
  set: (quality, value) => {
    qualities[quality] = value; 
  },
  adjust: (quality, value) => {
    if (!qualities[quality]) qualities[quality] = 0;
    qualities[quality] += value;
    if (qualities[quality] < 1) delete qualities[quality];
  },

}

module.exports = { qualities, actions };