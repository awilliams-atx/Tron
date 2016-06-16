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

GameView.prototype.showMenu = function (message) {
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
    this.clearMenuItems();
    this.restart();
  }.bind(this);

  var removeNewGameListener = function () {
    newGameButton.removeEventListener('click', newGameListener);
  };

  newGameButton.addEventListener('click', newGameListener);

  var instructionsListener = function () {
    this.clearMenuItems(winnerMessage, newGameButton);

    removeInstructionsListener();
  }.bind(this);

  var removeInstructionsListener = function () {
    instructionsButton.removeEventListener('click', instructionsListener);
  };

  instructionsButton.addEventListener('click', instructionsListener);

  this.menuItems.push(winnerMessage, newGameButton, instructionsButton);
};

GameView.prototype.start = function () {
  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
