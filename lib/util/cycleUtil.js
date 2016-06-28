var Constants = require('../constants');

var CycleUtil = {
  illegalDirs: function (dir) {
    if (Math.abs(dir[0]) === 1) {
      return ['1,0', '-1,0'];
    } else {
      return ['0,1', '0,-1'];
    }
  },
  isCollision: function (pos1, pos2) {
    return ((pos1[0] === pos2[0]) && (pos1[1] === pos2[1]));
  },
  isOutOfBounds: function (pos) {
    return pos[0] * 10 >= Constants.DIM_X ||
      pos[1] * 10 >= Constants.DIM_Y ||
      pos[0] < 0 ||
      pos[1] < 0;
  }
};

module.exports = CycleUtil;
