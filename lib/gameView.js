var GameView = function (game, ctx, canvasEl, restart) {
  this.game = game;
  this.ctx = ctx;
  this.canvasEl = canvasEl;
  this.restart = restart;
  this.start();
};

GameView.prototype.animate = function () {
  var game = this.game;

  if (game.isGameOver) {
    this.endGame(this.game.message);
  } else {
    game.step();
    game.draw(this.ctx);

    this.animation = requestAnimationFrame(this.animate.bind(this));
  }
};

GameView.prototype.endGame = function (message) {
  cancelAnimationFrame(this.animation);

  var messages = document.getElementById('tron-messages-winner');
  messages.innerHTML = message;

  var newGame = document.getElementById('tron-messages-new-game');
  newGame.innerHTML = 'New game';

  var newGameListener = function () {
    removeNewGameListener();
    messages.innerHTML = '';
    newGame.innerHTML = '';
    this.restart();
  }.bind(this);

  var removeNewGameListener = function () {
    newGame.removeEventListener('click', newGameListener);
  };

  newGame.addEventListener('click', newGameListener);
};

GameView.prototype.prompt = function () {

};

GameView.prototype.start = function () {
  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
