var Cycle = function (opts) {
  this.pos = opts.pos;
  this.direction = opts.direction;
  this.color = opts.color;
};

Cycle.HEIGHT = 10;
Cycle.WIDTH = 10;

Cycle.prototype.draw = function (ctx) {
  var x = this.pos[0] * 10,
      y = this.pos[1] * 10;

  ctx.fillStyle = this.color;
  ctx.fillRect(x, y, Cycle.HEIGHT, Cycle.WIDTH);
};

Cycle.prototype.move = function () {
  this.pos = [
    this.pos[0] + this.direction[0],
    this.pos[1] + this.direction[1]
  ];
};

module.exports = Cycle;
