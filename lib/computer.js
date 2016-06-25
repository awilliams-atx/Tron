var ComputerUtil = require('./util/computerUtil'),
    Constants = require('./constants'),
    CycleUtil = require('./util/cycleUtil');

var Computer = function (opponent, trails) {
  this.color = '#00ff0a';
  this.direction = [-1, 0];
  this.illegalDirs = CycleUtil.illegalDirs(this.direction);
  this.name = 'Computer';
  this.opponent = opponent;
  this.pos = [Constants.DIM_X / 10 - 1, 15];
  this.trails = trails;
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
  Object.keys(this.legalMoves()).forEach(function (posKey) {
    var pos = legalMoves[posKey].pos;
    if (!CycleUtil.isOutOfBounds(pos) &&
        !this.trails[pos.toString()]) {
        goodMoves[posKey] = legalMoves[posKey];
      }
    }.bind(this));

    return goodMoves
  };

Computer.prototype.isAboutToCollide = function () {
  return ComputerUtil.isAboutToCollide(this.pos, this.direction, this.trails);
};

Computer.prototype.isCollidedWith = function (object) {
  return CycleUtil.isCollision(this.pos, object.pos);
};

Computer.prototype.move = function () {
  this.turn();
  this.pos = [this.pos[0] + this.direction[0], this.pos[1] + this.direction[1]];
  this.illegalDirs = CycleUtil.illegalDirs(this.direction);
};

Computer.prototype.legalMoves = function () {
  var posKeys = ['1,0', '-1,0', '0,1', '0,-1'].filter(function (direction) {
      return !this.illegalDirs.includes(direction)
  }.bind(this));

  var legalMoves = {};

  [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (dir) {
    if (posKeys.includes(dir.toString())) {
      legalMoves[dir.toString()] = {
        dir: dir,
        pos: [this.pos[0] + dir[0], this.pos[1] + dir[1]]
      }
    }
  }.bind(this));

  return legalMoves
};

Computer.prototype.turn = function () {
  var moves = this.goodMoves();
  if (Object.keys(moves).length === 0) { return }
  var turnProbability = Math.random();
  if (this.isAboutToCollide()) { turnProbability = 1; }
  if (turnProbability >= 0.6) {
    var moves = this.goodMoves();
    var posKeys = Object.keys(moves);
    var posKey = posKeys[Math.floor(Math.random() * posKeys.length)];
    this.direction = moves[posKey].dir;
  }
};

Computer.prototype.unbindKeyHandlers = function () { 'quack quack' };


module.exports = Computer;
