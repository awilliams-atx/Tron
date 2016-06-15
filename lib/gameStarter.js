var Game = require('./game'),
    GameView = require('./gameView');

var GameStarter = function (canvasEl) {
  this.canvasEl = canvasEl;
  this.start();
};

GameStarter.prototype.start = function () {
  var canvasEl = this.canvasEl,
      ctx = this.canvasEl.getContext('2d'),
      game = new Game();

  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  new GameView(game, ctx, canvasEl, GameStarter.prototype.start);
};

module.exports = GameStarter;
