let qualities = {
};

let actions = {
  get: (quality) => qualities[quality],
  getAll: () => qualities,
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