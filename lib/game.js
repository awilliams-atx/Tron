var CanvasUtil = require('./util/canvasUtil'),
    Constants = require('./constants'),
    Cycle = require('./cycle');

var Game = function (opts) {
  this.addCycles();
  this.announcement = {};
  this.isGameOver = false;
  this.trails = [];
  this.DIM_X = Game.DIM_X;
  this.DIM_Y = Game.DIM_Y;
  this.BG_COLOR = Game.BG_COLOR;
};

Game.prototype.addCycles = function () {
  var cycleOpts = {
    pos: [5, 15],
    direction: [1, 0],
    color: Constants.YELLOW_HEAD,
    name: 'Player 1',
    keys: { up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD' }
  };

  this.cycle1 = new Cycle(cycleOpts);

  var cycleOpts = {
    pos: [45, 15],
    direction: [-1, 0],
    color: Constants.PINK_HEAD,
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
    this.announcement['announcement'] = 'Draw!';
  } else if (this.isOutOfBounds(this.cycle1)) {
    this.isGameOver = true;
    this.makeAnnouncement(this.cycle2);
  } else if (this.isOutOfBounds(this.cycle2)) {
    this.isGameOver = true;
    this.makeAnnouncement(this.cycle1);
  }
};

Game.prototype.checkCycleCollisions = function () {
  if (this.cycle1.isCollidedWith(this.cycle2)) {
    this.isGameOver = true;
    this.announcement['announcement'] = 'Draw!';
  }
};

Game.prototype.checkTrailCollisions = function () {
  var collidedCycles = [];

  this.trails.forEach(function (trail) {
    if (
      trail.pos[0] === this.cycle1.pos[0] &&
      trail.pos[1] === this.cycle1.pos[1]
    ) {
      this.isGameOver = true;
      collidedCycles.push(this.cycle1);
    } else if (
      trail.pos[0] === this.cycle2.pos[0] &&
      trail.pos[1] === this.cycle2.pos[1]
    ) {
      this.isGameOver = true;
      collidedCycles.push(this.cycle2);
    }
  }.bind(this));

  if (collidedCycles.length === 2) {
    this.announcement['announcement'] = 'Draw!';
  } else if (collidedCycles[0] === this.cycle1) {
    this.makeAnnouncement(this.cycle2);
  } else if (collidedCycles[0] === this.cycle2) {
    this.makeAnnouncement(this.cycle1);
  }
};
Game.prototype.clearPlayingArea = function (ctx) {
  ctx.clearRect(0, 0, Constants.DIM_X, Constants.DIM_Y);
  ctx.fillStyle = Constants.BG_COLOR;
  ctx.fillRect(0, 0, Constants.DIM_X, Constants.DIM_Y);
};

Game.prototype.cycles = function () {
  return [this.cycle1, this.cycle2];
};

Game.prototype.draw = function(ctx) {
  CanvasUtil.clearPlayingArea(ctx);
  this.drawCycles(ctx);
  this.drawTrails(ctx);
};

Game.prototype.drawCycles = function (ctx) {
  this.cycles().forEach(function (cycle) {
    cycle.draw(ctx);
  });
};

Game.prototype.drawTrails = function (ctx) {
  this.trails.forEach(function (trail) {
    var x = (trail.pos[0] * 10) + 1,
        y = (trail.pos[1] * 10) + 1;
    ctx.fillStyle = trail.color;
    ctx.fillRect(x, y, 8, 8);
  });
};

Game.prototype.isOutOfBounds = function (cycle) {
  return cycle.pos[0] * 10 > Constants.DIM_X ||
    cycle.pos[1] * 10 > Constants.DIM_Y ||
    cycle.pos[0] < 0 ||
    cycle.pos[1] < 0;
};

Game.prototype.makeAnnouncement = function (cycle) {
  this.announcement = {
    announcement: cycle['name'] + ' wins!',
    color: cycle.color
  };
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

Game.prototype.terminate = function () {
  this.cycles().forEach(function (cycle) {
    cycle.unbindKeyHandlers();
  });
};

Game.prototype.unbindKeyHandlers = function () {
  this.cycles().forEach(function (cycle) {
    cycle.unbindKeyHandlers();
  });
};

module.exports = Game;
