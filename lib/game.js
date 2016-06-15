var Cycle = require('./cycle');

var Game = function () {
  this.addCycles();
  this.isGameOver = false;
  this.trails = [];
};

Game.prototype.addCycles = function () {
  var cycleOpts = {
    pos: [10, 25],
    direction: [0, 0],
    color: '#FFF700',
    message: 'Player 2 wins!'
  };

  this.cycle1 = new Cycle(cycleOpts);

  var cycleOpts = {
    pos: [25, 25],
    direction: [-0.5, 0],
    color: '#FF00D0',
    message: 'Player 1 wins!'
  };

  this.cycle2 = new Cycle(cycleOpts);
};

Game.prototype.checkCollisions = function () {
  this.cycles().forEach(function (cycle) {
    if (this.isOutOfBounds(cycle)) {
      this.isGameOver = true;
    }

    if (this.cycle1.isCollidedWith(this.cycle2)) {
      this.isGameOver = true;
    }

    this.message = cycle.message;
  }.bind(this));

};

Game.prototype.cycles = function () {
  return [this.cycle1, this.cycle2];
};

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  this.cycles().forEach(function (cycle) {
    cycle.draw(ctx);
  });

  this.trails.forEach(function (trail) {
    var x = (trail[0] * 10) + 3,
        y = (trail[1] * 10) + 3;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, 4, 4)
  });
};

Game.prototype.isOutOfBounds = function (cycle) {
  return cycle.pos[0] * 10 > Game.DIM_X ||
    cycle.pos[1] * 10 > Game.DIM_Y ||
    cycle.pos[0] * 10 < 0 ||
    cycle.pos[1] * 10 < 0;
};

Game.prototype.moveCycles = function () {
  this.cycles().forEach(function (cycle) {
    var trailPos = cycle.pos;
    cycle.move();
    this.trails.push(trailPos);
  }.bind(this));
};

Game.prototype.step = function () {
  this.moveCycles();
  this.checkCollisions();
};

Game.BG_COLOR = '#000000';
Game.DIM_X = 800;
Game.DIM_Y = 500;

module.exports = Game;
