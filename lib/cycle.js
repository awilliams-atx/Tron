var Util = require('./util');

var Cycle = function (opts) {
  this.pos = opts.pos;
  this.direction = opts.direction;
  this.color = opts.color;
  this.name = opts.name;
  this.keys = opts.keys;
  this.bindKeyHandlers();
  this.keysPressed = [];
};

Cycle.HEIGHT = 10;
Cycle.WIDTH = 10;

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
}

Cycle.prototype.draw = function (ctx) {
  var x = this.pos[0] * 10,
      y = this.pos[1] * 10;

  ctx.fillStyle = this.color;
  ctx.fillRect(x, y, Cycle.HEIGHT, Cycle.WIDTH);
};

Cycle.prototype.isCollidedWith = function (object) {
  var x1 = this.pos[0],
      y1 = this.pos[1],
      x2 = object.pos[0],
      y2 = object.pos[1];

  if (x1 === x2 && y1 === y2) {
    return true;
  } else {
    return false;
  }
};

Cycle.prototype.move = function () {
  var prevPos = this.pos;

  this.pos = [
    this.pos[0] + this.direction[0],
    this.pos[1] + this.direction[1]
  ];

  this.illegalDirs = Util.illegalDirs(this.direction);
};

Cycle.prototype.movingDown = function (dir) {
  return dir[1] === 1;
};

Cycle.prototype.movingLeft = function (dir) {
  return dir[0] === -1;
};

Cycle.prototype.movingRight = function (dir) {
  return dir[0] === 1;
};

Cycle.prototype.movingUp = function (dir) {
  return dir[0] === -1;
};

Cycle.prototype.requestTurn = function (vel, velStr) {
  var authorized = true;

  this.illegalDirs.forEach(function (forbiddenVel) {
    if (velStr === forbiddenVel) { authorized = false; }
  }.bind(this));

  if (authorized) { this.direction = vel; }
};

Cycle.prototype.unbindKeyHandlers = function () {
  document.removeEventListener('keydown', this.keyListener);
};

module.exports = Cycle;
