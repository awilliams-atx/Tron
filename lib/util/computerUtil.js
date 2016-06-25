var Constants = require('../constants');

var ComputerUtil = {
  isAboutToCollide: function (pos, direction) {
    return pos[0] === 0 && direction[0] === -1 ||
      pos[0] === Constants.DIM_X / 10 - 1 && direction[0] === 1 ||
      pos[1] === 0 && direction[1] === -1 ||
      pos[1] === Constants.DIM_Y / 10 - 1 && direction[1] === 1
  }
};

module.exports = ComputerUtil;
