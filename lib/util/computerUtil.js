var Constants = require('../constants');

var ComputerUtil = {
  boxBounds: function () {
    var bounds = {};
    var x = -1, y = -1;

    while (x <= (Constants.DIM_X / 10)) {
      bounds[[x, y].toString()] = true;
      x += 1;
    }

    y += 1;
    x -= 1;
    while (y <= (Constants.DIM_Y / 10)) {
      bounds[[x, y].toString()] = true;
      y += 1;
    }

    x -= 1;
    y -= 1;
    while (x >= 0) {
      bounds[[x, y].toString()] = true;
      x -= 1;
    }

    y -= 1;
    x += 1;
    while (y >= 0) {
      bounds[[x, y].toString()] = true;
      y -= 1;
    }
    return bounds;
  },
  deltas: function (pos) {
    return [
      [pos[0] + 1, pos[1]],
      [pos[0] - 1, pos[1]],
      [pos[0], pos[1] + 1],
      [pos[0], pos[1] - 1]
    ];
  },
  legalDirs: function (dir) {
    if (dir.toString() === '1,0') {
      return [[1, 0], [0, 1], [0, -1]];
    } else if (dir.toString() === '-1,0') {
      return [[-1, 0], [0, 1], [0, -1]];
    } else if (dir.toString() === '0,1') {
      return [[1, 0], [-1, 0], [0, 1]];
    } else if (dir.toString() === '0,-1') {
      return [[1, 0], [-1, 0], [0, -1]];
    }
  },
  isAboutToCollide: function (pos, direction, trails) {
    return pos[0] === 0 && direction[0] === -1 ||
      pos[0] === Constants.DIM_X / 10 - 1 && direction[0] === 1 ||
      pos[1] === 0 && direction[1] === -1 ||
      pos[1] === Constants.DIM_Y / 10 - 1 && direction[1] === 1 ||
      this.trailAhead(this.posAhead(pos, direction), trails);
  },
  posAhead: function (pos, direction) {
    return [pos[0] + direction[0], pos[1] + direction[1]];
  },
  trailAhead: function (pos, trails) {
    return trails.hasOwnProperty(pos.toString());
  }
};

module.exports = ComputerUtil;
