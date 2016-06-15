var GameView = function (game, ctx, canvasEl) {
  this.game = game;
  this.ctx = ctx;
  this.canvasEl = canvasEl;
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

  newGame.addEventListener('click', newGameListener);

  function newGameListener () {
    removeNewGameListener();
  }

  function removeNewGameListener () {
    newGame.removeEventListener('click', newGameListener);
  }
};

GameView.prototype.start = function () {
  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
