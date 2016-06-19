var Constants = require('./constants');

var util = {
  illegalDirs: function (dir) {
    if (Math.abs(dir[0]) === 1) {
      return ['1,0', '-1,0'];
    } else {
      return ['0,1', '0,-1'];
    }
  },
  sliderWidth: function (message) {
    switch (message) {
      case 'Draw!':
        return Constants['DRAW_SLIDE'];
        break;
      default:
        return Constants['PLAYER_WIN_SLIDE'];
    }
  }
};

module.exports = util;
