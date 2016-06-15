var Game = require('./game'),
    GameView = require('./gameView');


document.addEventListener('DOMContentLoaded', function () {
  var canvasEl = document.getElementById('tron-canvas');
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  var ctx = canvasEl.getContext('2d');
  var game = new Game();
  new GameView(game, ctx, canvasEl);
});
