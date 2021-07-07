let qualities = {
  domain: 1,
  count: 1,
};

let actions = {
  modify: (quality, value) => {
    qualities[quality] = qualities[quality] ? value : 1; 
  },
  decrease: () => {
    qualities.count -= 1;
  }
}

module.exports = { qualities, actions };