var ComputerUtil = require('./util/computerUtil'),
    Constants = require('./constants'),
    CycleUtil = require('./util/cycleUtil'),
    Queue = require('./util/queue');

var Computer = function (opponent, trails, newMoves) {
  this.color = '#00ff0a';
  this.direction = [-1, 0];
  this.name = 'Computer';
  this.newMoves = newMoves;
  this.opponent = opponent;
  this.pos = [44, 15];
  this.trails = trails;
};

Computer.prototype.bestMove = function () {
  var goodMoves = this.goodMoves();
  if (Object.keys(goodMoves) === 0) { return false; }
  var bestMove = {realEstate: 0};
  Object.keys(goodMoves).forEach(function (posKey) {
    var move = goodMoves[posKey];
    move.realEstate = this.relativeRealEstate(move);
    if (move.realEstate > bestMove.realEstate) {
      bestMove = move;
    }
  }.bind(this));

  return bestMove.realEstate > 0 ? bestMove : false;
};

Computer.prototype.draw = function (ctx) {
  var x = this.pos[0] * 10,
      y = this.pos[1] * 10;

  ctx.fillStyle = this.color;
  ctx.fillRect(x, y, Constants.CYCLE_HEIGHT, Constants.CYCLE_WIDTH);
};

Computer.prototype.goodMoves = function () {
  var legalMoves = this.legalMoves();
  var goodMoves = {};
  Object.keys(legalMoves).forEach(function (posKey) {
    var pos = legalMoves[posKey].pos;
    if (!CycleUtil.isOutOfBounds(pos) &&
        !this.trails[pos.toString()]) {
        goodMoves[posKey] = legalMoves[posKey];
      }
    }.bind(this));

    return goodMoves;
  };

Computer.prototype.isCollidedWith = function (object) {
  return CycleUtil.isCollision(this.pos, object.pos);
};

Computer.prototype.move = function () {
  this.updateBounds();
  var bestMove = this.bestMove();
  if (bestMove) { this.direction = bestMove.dir }
  this.pos = [this.pos[0] + this.direction[0], this.pos[1] + this.direction[1]];
};

Computer.prototype.legalMoves = function () {
  var dirs = ComputerUtil.legalDirs(this.direction);
  var dirKeys = dirs.map(function (dir) { return dir.toString(); });

  var legalMoves = {};

  [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (dir) {
    if (dirKeys.includes(dir.toString())) {
      legalMoves[dir.toString()] = {
        dir: dir,
        pos: [this.pos[0] + dir[0], this.pos[1] + dir[1]]
      };
    }
  }.bind(this));

  return legalMoves;
};

Computer.prototype.relativeRealEstate = function (move) {
  var pos = move.pos;
  var checkedMoves = {};
  checkedMoves[this.pos.toString()] = true;
  var movesQueue = new Queue(pos);
  var perps;
  if (Math.abs(move.dir[0]) === 1) {
    perps = [[0, 1], [0, -1]];
  } else if (Math.abs(move.dir[1]) === 1) {
    perps = [[1, 0], [-1, 0]];
  }

  perps.forEach(function (perpendicular) {
    var boundary = null;
    var perpPos = [move.pos[0], move.pos[1]];

    while (boundary === null) {
      perpPos[0] += perpendicular[0];
      perpPos[1] += perpendicular[1];
      if (this.bounds[perpPos.toString()]) {
        boundary = perpPos;
      } else {
        checkedMoves[perpPos.toString()] = true;
      }
    }
  }.bind(this));

  while (movesQueue.length > 0) {
    pos = movesQueue.dequeue();
    var deltaPositions = ComputerUtil.deltas(pos);
    deltaPositions.forEach(function (deltaPos) {
      var str = deltaPos.toString();
      if (!checkedMoves[str] && !this.bounds[str]) {
        movesQueue.enqueue(deltaPos);
        checkedMoves[str] = true;
      }
    }.bind(this));
  }

  return Object.keys(checkedMoves).length;
};

Computer.prototype.unbindKeyHandlers = function () {};

Computer.prototype.updateBounds = function () {
  if (this.bounds) {
    this.newMoves.forEach(function (pos) {
      this.bounds[pos.toString()] = true;
    }.bind(this));
  } else {
    var positions = Object.keys(this.trails)
    .concat(this.opponent.pos.toString(), this.pos.toString());

    var allBounds = {};
    positions.forEach(function (pos) {
      allBounds[pos.toString()] = true;
    });
    Object.assign(allBounds, ComputerUtil.boxBounds());
    this.bounds = allBounds;
  }
};

module.exports = Computer;
