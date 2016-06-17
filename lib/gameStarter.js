var Game = require('./game'),
    GameView = require('./gameView');

var GameStarter = function (canvasEl) {
  this.canvasEl = canvasEl;
  this.backgroundCycle = 1;
  this.start();
};

GameStarter.prototype.start = function () {
  var canvasEl = this.canvasEl,
      ctx = this.ctx || this.canvasEl.getContext('2d'),
      game = new Game();

  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  new GameView({
    game: game,
    ctx: ctx,
    canvasEl: canvasEl,
    restart: GameStarter.prototype.start.bind(this),
    backgroundCycle: this.backgroundCycle
  });

  this.backgroundCycle += 1;
  if (this.backgroundCycle > 4) { this.backgroundCycle = 1; }
};

module.exports = GameStarter;
