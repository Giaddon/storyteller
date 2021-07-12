let qualities = {};

const actions = {
  get: (qualityId) => qualities[qualityId],
  getAll: () => qualities,
  set: (data) => {
    qualities = data;
  },
}


module.exports = { actions }