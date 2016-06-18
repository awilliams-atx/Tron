var Constants = require('./constants');

var util = {
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
