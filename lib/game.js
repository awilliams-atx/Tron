var CanvasUtil = require('./util/canvasUtil'),
    Computer = require('./computer'),
    Constants = require('./constants'),
    Cycle = require('./cycle'),
    CycleUtil = require('./util/cycleUtil');

var Game = function (numPlayers) {
  this.trails = {};
  this.addCycles(numPlayers);
  this.announcement = {};
  this.isGameOver = false;
  this.DIM_X = Game.DIM_X;
  this.DIM_Y = Game.DIM_Y;
  this.BG_COLOR = Game.BG_COLOR;
};

Game.prototype.addCycles = function (numPlayers) {
  var cycleOpts = {
    pos: [5, 15],
    direction: [1, 0],
    color: Constants.YELLOW_HEAD,
    name: 'Player 1',
    keys: { up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD' }
  };

  this.cycle1 = new Cycle(cycleOpts);

  if (numPlayers === 2) {
    var cycleOpts = {
      pos: [45, 15],
      direction: [-1, 0],
      color: Constants.PINK_HEAD,
      name: 'Player 2',
      keys: { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' }
    };

    this.cycle2 = new Cycle(cycleOpts);
  } else if (numPlayers === 1) {
    this.cycle2 = new Computer(this.cycle1, this.trails);
  }
};

Game.prototype.checkCollisions = function () {
  this.checkBorderCollisions();
  this.checkCycleCollisions();
  this.checkTrailCollisions();
};

Game.prototype.checkBorderCollisions = function () {
  if (CycleUtil.isOutOfBounds(this.cycle1.pos) &&
      CycleUtil.isOutOfBounds(this.cycle2.pos)) {
    this.isGameOver = true;
    this.announcement['announcement'] = 'Draw!';
  } else if (CycleUtil.isOutOfBounds(this.cycle1.pos)) {
    this.isGameOver = true;
    this.makeAnnouncement(this.cycle2);
  } else if (CycleUtil.isOutOfBounds(this.cycle2.pos)) {
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
  var collidedCycles = [],
      trails = this.trails;

  Object.keys(this.trails).forEach(function (pos) {
    if (
      trails[pos].pos[0] === this.cycle1.pos[0] &&
      trails[pos].pos[1] === this.cycle1.pos[1]
    ) {
      this.isGameOver = true;
      collidedCycles.push(this.cycle1);
    } else if (
      trails[pos].pos[0] === this.cycle2.pos[0] &&
      trails[pos].pos[1] === this.cycle2.pos[1]
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
  this.cycles().forEach(function (cycle) { cycle.draw(ctx); });
  CanvasUtil.drawTrails(ctx, this.trails);
};

Game.prototype.makeAnnouncement = function (cycle) {
  this.announcement = {
    announcement: cycle['name'] + ' wins!',
    color: cycle.color
  };
};

Game.prototype.moveCycles = function () {
  this.cycles().forEach(function (cycle) {
    this.trails[cycle.pos.toString()] = {
      color: cycle.color,
      pos: cycle.pos
    };
    cycle.move();
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
