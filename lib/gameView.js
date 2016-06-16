var GameView = function (game, ctx, canvasEl, restart) {
  this.game = game;
  this.ctx = ctx;
  this.canvasEl = canvasEl;
  this.restart = restart;
  this.start();
  this.menuItems = [];
};

GameView.prototype.animate = function () {
  var game = this.game;

  if (game.isGameOver) {
    this.showMenu(this.game.message);
  } else {
    game.step();
    game.draw(this.ctx);

    this.animation = requestAnimationFrame(this.animate.bind(this));
  }
};

GameView.prototype.clearMenuItems = function () {
  if ([].slice.call(arguments).length === 0) {
    this.menuItems.forEach(function (item) {
      item.innerHTML = '';
    });
  } else {
    var items = [].slice.call(arguments);
    [].slice.call(arguments).forEach(function (item) {
      item.innerHTML = '';
    });
  }
};

GameView.prototype.menuInstructions = function () {
  var instructionsButton =
  document.getElementById('tron-menu-instructions');
  instructionsButton.innerHTML = 'Instructions';

  var instructionsListener = function () {
    this.clearMenuItems();
    instructionsButton.removeEventListener('click', instructionsListener);
  }.bind(this)

  instructionsButton.addEventListener('click', instructionsListener);
  this.menuItems.push(instructionsButton);
};

GameView.prototype.menuNewGame = function () {
  var newGameButton = document.getElementById('tron-menu-new-game');
  newGameButton.innerHTML = 'New game';
  this.menuItems.push(newGameButton);

  var newGameListener = function () {
    newGameButton.removeEventListener('click', newGameListener);
    this.clearMenuItems();
    this.restart();
  }.bind(this);

  newGameButton.addEventListener('click', newGameListener);
};


GameView.prototype.menuWinnerMessage = function (message) {
  var winnerMessage = document.getElementById('tron-menu-winner');
  winnerMessage.innerHTML = message;
  this.menuItems.push(winnerMessage);
};

GameView.prototype.showMenu = function (message) {
  cancelAnimationFrame(this.animation);
  this.menuWinnerMessage(message);
  this.menuNewGame();
  this.menuInstructions();
};

GameView.prototype.start = function () {
  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
