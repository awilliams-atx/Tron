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

  var winnerMessage = document.getElementById('tron-menu-winner');
  winnerMessage.innerHTML = message;

  var newGameButton = document.getElementById('tron-menu-new-game');
  newGameButton.innerHTML = 'New game';

  var instructionsButton =
    document.getElementById('tron-menu-instructions');

  instructionsButton.innerHTML = 'Instructions';

  var newGameListener = function () {
    removeNewGameListener();
    winnerMessage.innerHTML = '';
    newGameButton.innerHTML = '';
    this.restart();
  }.bind(this);

  var removeNewGameListener = function () {
    newGameButton.removeEventListener('click', newGameListener);
  };

  newGameButton.addEventListener('click', newGameListener);
};

GameView.prototype.prompt = function () {

};

GameView.prototype.start = function () {
  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
