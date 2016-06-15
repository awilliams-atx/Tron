var Cycle = function (opts) {
  this.pos = opts.pos;
  this.direction = opts.direction;
  this.color = opts.color;
  this.name = opts.name;
};

Cycle.HEIGHT = 10;
Cycle.WIDTH = 10;

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
  this.pos = [
    this.pos[0] + this.direction[0],
    this.pos[1] + this.direction[1]
  ];
};

module.exports = Cycle;
