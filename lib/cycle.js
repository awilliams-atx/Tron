var Constants = require('./constants'),
    CycleUtil = require('./util/cycleUtil');

var Cycle = function (opts) {
  this.pos = opts.pos;
  this.color = opts.color;
  this.direction = opts.direction;
  this.illegalDirs = CycleUtil.illegalDirs(opts.direction);
  this.keys = opts.keys;
  this.keysPressed = [];
  this.name = opts.name;
  this.bindKeyHandlers();
};

Cycle.prototype.bindKeyHandlers = function (keys) {
  this.keyListener = function (e) {
    if (['ArrowUp', 'ArrowDown'].includes(e.code)) { e.preventDefault(); }
    switch (e.code) {
      case this.keys.up:
        this.requestTurn([0, -1], '0,-1');
        break;
      case this.keys.down:
        this.requestTurn([0, 1], '0,1');
        break;
      case this.keys.left:
        this.requestTurn([-1, 0], '-1,0');
        break;
      case this.keys.right:
        this.requestTurn([1, 0], '1,0');
        break;
    }
  }.bind(this);

  document.addEventListener('keydown', this.keyListener);
};

Cycle.prototype.draw = function (ctx) {
  var x = this.pos[0] * 10,
      y = this.pos[1] * 10;

  ctx.fillStyle = this.color;
  ctx.fillRect(x, y, Constants.CYCLE_HEIGHT, Constants.CYCLE_WIDTH);
};

Cycle.prototype.isCollidedWith = function (object) {
  return CycleUtil.isCollision(this.pos, object.pos);
};

Cycle.prototype.move = function () {
  this.pos = [this.pos[0] + this.direction[0], this.pos[1] + this.direction[1]];
  this.illegalDirs = CycleUtil.illegalDirs(this.direction);
};

Cycle.prototype.requestTurn = function (dir, dirStr) {
  if (!this.illegalDirs.includes(dir.toString())) { this.direction = dir; }
};

Cycle.prototype.unbindKeyHandlers = function () {
  document.removeEventListener('keydown', this.keyListener);
};

module.exports = Cycle;
