var GameView = function (game, ctx, canvasEl, restart) {
  this.game = game;
  this.ctx = ctx;
  this.canvasEl = canvasEl;
  this.restart = restart;
  this.menuItems = [];
  this.frames = 0;
  this.play();
};

GameView.prototype.clearMenuItems = function () {
  if ([].slice.call(arguments).length === 0) {
    this.menuItems.forEach(function (item) {
      item.innerHTML = '';
      item.removeAttribute('src');
    });
  } else {
    var items = [].slice.call(arguments);
    [].slice.call(arguments).forEach(function (item) {
      item.innerHTML = '';
    });
  }
};

GameView.prototype.clearPlayingArea = function () {
  var ctx = this.ctx,
      Game = this.game;

  ctx.clearRect(0, 0, Game.DIM_X * 10, Game.DIM_Y * 10);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X * 10, Game.DIM_Y * 10);
};

GameView.prototype.instructionsHeader = function () {
  document.getElementById('tron-instructions-header').innerHTML =
    'Instructions';
};

GameView.prototype.instructionsPlayerOne = function () {
  var playerOne = document.getElementById('tron-instructions-player-one');
  playerOne.innerHTML = 'Player One'

  var playerOneKeys =
    document.getElementById('tron-instructions-player-one-keys')
      .setAttribute('src', './assets/images/tron_keys_wasd.png');

  var playerOneKeyInfo =
    document.getElementById('tron-instructions-player-one-key-info');
  playerOneKeyInfo.innerHTML = 'Use these keys to move:';

  this.menuItems.push(playerOne, playerOneKeys, playerOneKeyInfo);
};

GameView.prototype.instructionsPlayerTwo = function () {
  var playerTwo = document.getElementById('tron-instructions-player-two');
  playerTwo.innerHTML = 'Player Two'

  var playerTwoKeys =
    document.getElementById('tron-instructions-player-two-keys')
      .setAttribute('src', './assets/images/tron_keys_arrows.png');

  var playerTwoKeyInfo =
    document.getElementById('tron-instructions-player-two-key-info');
  playerTwoKeyInfo.innerHTML = 'Use these keys to move:';

  this.menuItems.push(playerTwo, playerTwoKeys, playerTwoKeyInfo);
};

GameView.prototype.menuInstructions = function () {
  var instructionsButton =
  document.getElementById('tron-menu-instructions');
  instructionsButton.innerHTML = 'Instructions';

  var instructionsListener = function () {
    instructionsButton.removeEventListener('click', instructionsListener);
    this.showInstructions();
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

GameView.prototype.menuWinnerAnnouncement = function (message) {
  var winnerMessage = document.getElementById('tron-menu-winner');
  winnerMessage.innerHTML = message;
  this.menuItems.push(winnerMessage);
};

GameView.prototype.play = function () {
  this.frames += 1;
  var game = this.game;

  if (game.isGameOver) {
    this.showMenu(this.game.message);
  } else {
    if (this.frames >= 10) {
      this.frames = 0;
      game.step();
      game.draw(this.ctx);
    }
    requestAnimationFrame(this.play.bind(this));
  }

};

GameView.prototype.showInstructions = function () {
  this.clearMenuItems();
  this.clearPlayingArea();
  this.instructionsHeader();
  this.instructionsPlayerOne();
  this.instructionsPlayerTwo();
};

GameView.prototype.showMenu = function (winnerAnnouncement) {
  cancelAnimationFrame(this.animation);
  this.menuWinnerAnnouncement(winnerAnnouncement);
  this.menuNewGame();
  this.menuInstructions();
};

// GameView.prototype.start = function () {
//   requestAnimationFrame(this.animate.bind(this));
// };

module.exports = GameView;
