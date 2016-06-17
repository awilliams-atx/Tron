var GameView = function (game, ctx, canvasEl, restart) {
  this.game = game;
  this.ctx = ctx;
  this.canvasEl = canvasEl;
  this.restart = restart;
  this.menuItems = [];
  this.frames = 0;
  this.play();
};

GameView.prototype.clearMenu = function () {
  this.clearOuterMenu();
  this.clearInstructions();
};

GameView.prototype.clearOuterMenu = function () {
  document.getElementById('tron-outer-menu').style.display = 'none';
};

GameView.prototype.clearInstructions = function () {
  document.getElementById('tron-instructions').style.display = 'none';
};

GameView.prototype.clearPlayingArea = function () {
  var ctx = this.ctx,
      Game = this.game;

  ctx.clearRect(0, 0, Game.DIM_X * 10, Game.DIM_Y * 10);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X * 10, Game.DIM_Y * 10);
};

GameView.prototype.instructionsBack = function () {
  var back = document.getElementById('tron-instructions-back');

  this.instructionsBackListener = function () {
    back.removeEventListener('click', this.instructionsBackListener);
    this.showMenu();
  }.bind(this);

  back.addEventListener('click', this.instructionsBackListener);
};

GameView.prototype.instructionsHeader = function () {
  document.getElementById('tron-instructions-header').innerHTML =
    'Instructions';
};

GameView.prototype.menuInstructions = function () {
  var instructionsButton =
  document.getElementById('tron-menu-instructions');

  var instructionsListener = function () {
    instructionsButton.removeEventListener('click', instructionsListener);
    this.showInstructions();
  }.bind(this)

  instructionsButton.addEventListener('click', instructionsListener);
};

GameView.prototype.menuNewGame = function () {
  var newGameButton = document.getElementById('tron-menu-new-game');

  var newGameListener = function () {
    newGameButton.removeEventListener('click', newGameListener);
    this.clearMenu();
    this.restart();
  }.bind(this);

  newGameButton.addEventListener('click', newGameListener);
};

GameView.prototype.menuWinnerAnnouncement = function (message) {
  document.getElementById('tron-menu-winner').innerHTML = message || 'Tron!';
};

GameView.prototype.play = function () {
  this.clearMenu();

  this.frames += 1;
  var game = this.game;

  if (game.isGameOver) {
    this.showMenu(this.game.message);
  } else {
    if (this.frames >= 5) {
      this.frames = 0;
      game.step();
      game.draw(this.ctx);
    }
    requestAnimationFrame(this.play.bind(this));
  }
};

GameView.prototype.showInstructions = function () {
  this.clearMenu();
  this.clearPlayingArea();
  this.instructionsBack();
  document.getElementById('tron-instructions').style.display = 'block';
};

GameView.prototype.showMenu = function (winnerAnnouncement) {
  this.clearMenu();
  this.menuWinnerAnnouncement(winnerAnnouncement);
  this.menuNewGame();
  this.menuInstructions();
  cancelAnimationFrame(this.animation);
  document.getElementById('tron-outer-menu').style.display = 'block';
};

module.exports = GameView;
