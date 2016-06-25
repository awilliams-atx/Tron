var Constants = require('./constants'),
    CycleUtil = require('./util/cycleUtil');

var Computer = function () {
  this.color = '#00ff0a';
  this.direction = [-1, 0];
  this.name = 'Computer';
  this.pos = [45, 14];
};

Computer.prototype.draw = function (ctx) {
  var x = this.pos[0] * 10,
      y = this.pos[1] * 10;

  ctx.fillStyle = this.color;
  ctx.fillRect(x, y, Constants.CYCLE_HEIGHT, Constants.CYCLE_WIDTH);
};

Computer.prototype.isCollidedWith = function (object) {
  return CycleUtil.isCollision(this.pos, object.pos);
};

Computer.prototype.move = function () {
  if (Math.random() < 0.5) { this.turn(); }
  this.pos = [this.pos[0] + this.direction[0], this.pos[1] + this.direction[1]];
  this.illegalDirs = CycleUtil.illegalDirs(this.direction);
};

Computer.prototype.turn = function (dir, dirStr) {
  if (this.direction[0] === 0) {
    this.direction[1] = 0;
    this.direction[0] = Math.random() < 0.5 ? 1 : -1;
  } else if (this.direction[1] === 0) {
    this.direction[0] = 0;
    this.direction[1] = Math.random() < 0.5 ? 1 : -1;
  }
};

Computer.prototype.unbindKeyHandlers = function () {};


module.exports = Computer;
