var GameView = function (game, ctx) {
  this.game = game;
  this.ctx = ctx;
  this.start();
};

GameView.prototype.animate = function () {
  var game = this.game;

  if (game.isGameOver) {
    GameView.endGame();
  } else {
    game.step();
    game.draw(this.ctx);

    requestAnimationFrame(this.animate.bind(this));
  }
};

GameView.prototype.endGame = function (endOpts) {
  cancelAnimationFrame();
};

GameView.prototype.start = function () {
  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
