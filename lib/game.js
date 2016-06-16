var Cycle = require('./cycle');

var Game = function () {
  this.addCycles();
  this.isGameOver = false;
  this.trails = [];
};

Game.BG_COLOR = '#000000';
Game.DIM_X = 700;
Game.DIM_Y = 500;
Game.VEL = 0.25;

Game.prototype.addCycles = function () {
  var cycleOpts = {
    pos: [10, 25],
    direction: [Game.VEL, 0],
    color: '#FFF700',
    name: 'Player 1',
    keys: { up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD' }
  };

  this.cycle1 = new Cycle(cycleOpts);

  var cycleOpts = {
    pos: [60, 25],
    direction: [Game.VEL * -1, 0],
    color: '#FF00D0',
    name: 'Player 2',
    keys: { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' }
  };

  this.cycle2 = new Cycle(cycleOpts);
};

Game.prototype.checkCollisions = function () {
  this.checkBorderCollisions();
  this.checkCycleCollisions();
  this.checkTrailCollisions();
};

Game.prototype.checkBorderCollisions = function () {
  if (this.isOutOfBounds(this.cycle1) && this.isOutOfBounds(this.cycle2)) {
    this.isGameOver = true;
    this.message = 'Draw!';
  } else if (this.isOutOfBounds(this.cycle1)) {
    this.isGameOver = true;
    this.message = 'Player 2 wins!';
  } else if (this.isOutOfBounds(this.cycle2)) {
    this.isGameOver = true;
    this.message = 'Player 1 wins!';
  }
};

Game.prototype.checkCycleCollisions = function () {
  if (this.cycle1.isCollidedWith(this.cycle2)) {
    this.isGameOver = true;
    this.message = 'Draw!';
  }
};

Game.prototype.checkTrailCollisions = function () {
  this.trails.forEach(function (trail) {
    if (
      trail.pos[0] === this.cycle1.pos[0] &&
      trail.pos[1] === this.cycle1.pos[1]
    ) {
      this.isGameOver = true;
      this.message = 'Player 2 wins!';
    } else if (
      trail.pos[0] === this.cycle2.pos[0] &&
      trail.pos[1] === this.cycle2.pos[1]
    ) {
      this.isGameOver = true;
      this.message = 'Player 1 wins!';
    }
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
    var x = (trail.pos[0] * 10) + 3,
        y = (trail.pos[1] * 10) + 3;
    ctx.fillStyle = trail.color;
    ctx.fillRect(x, y, 4, 4);
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
    this.trails.push({
      pos: trailPos,
      color: cycle.color
    });
  }.bind(this));
};

Game.prototype.step = function () {
  this.moveCycles();
  this.checkCollisions();
};

module.exports = Game;
