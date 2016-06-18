var Game = require('./game'),
    GameView = require('./gameView');

var GameStarter = function (canvasEl) {
  this.backgroundCycle = 1;
  this.canvasEl = canvasEl;
  this.tronGameLoad = true;
  this.start();
};

GameStarter.prototype.start = function () {
  var canvasEl = this.canvasEl,
      ctx = this.ctx || this.canvasEl.getContext('2d'),
      game = new Game();

  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  new GameView({
    backgroundCycle: this.backgroundCycle,
    canvasEl: canvasEl,
    ctx: ctx,
    game: game,
    restart: GameStarter.prototype.start.bind(this),
    tronGameLoad: this.tronGameLoad
  });

  this.backgroundCycle += 1;
  if (this.backgroundCycle > 4) { this.backgroundCycle = 1; }
  this.tronGameLoad = false;
};

module.exports = GameStarter;
