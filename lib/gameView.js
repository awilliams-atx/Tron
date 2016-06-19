var CanvasUtil = require('./canvasUtil'),
    Constants = require('./constants'),
    DOMUtil = require('./DOMUtil'),
    Game = require('./game');

var GameView = function (opts) {
  this.tronGameLoad = true;
  this.game = null;
  this.ctx = opts.ctx;
  this.frames = 0;
  this.backgroundCycle = 1;
  this.run();
};

GameView.prototype.clearMenu = function () {
  DOMUtil.clearOuterMenu();
  DOMUtil.clearInstructions();
};

GameView.prototype.endGame = function () {
  this.game.unbindKeyHandlers();
  setTimeout(function () {
    this.fanfare();
    setTimeout(function () {
      DOMUtil.fadeToBlack(function () {
        this.showMenu();
      }.bind(this));
    }.bind(this), 600)
  }.bind(this), 500);
};

GameView.prototype.fanfare = function () {
  if (this.game.announcement['announcement'] === 'Draw!') { return; }
  CanvasUtil.fanfare(this.ctx, this.game.announcement['color']);
  var x1 = 0, ctx = this.ctx;
};

GameView.prototype.flyInMenuItems = function () {
  setTimeout(function () { this.menuAnnouncement(); }.bind(this), 500);
  setTimeout(function () { this.menuListenNewGame(); }.bind(this), 600);
  setTimeout(function () { this.menuListenInstructions(); }.bind(this), 700);
};

GameView.prototype.initializeButtons = function () {
  this.buttons = {
    instructions: document.getElementById('tron-menu-instructions'),
    instructionsBack: document.getElementById('tron-instructions-back'),
    newGame: document.getElementById('tron-menu-new-game')
  };
};

GameView.prototype.initializeListeners = function () {
  this.listeners = {
    instructions: function () {
      this.buttons['instructions']
        .removeEventListener('click', this.listeners['instructionsListener']);
      DOMUtil.fadeToBlack(function () {
        DOMUtil.clearOuterMenu();
        this.showInstructions();
      }.bind(this));
    }.bind(this),
    instructionsBack: function () {
      this.buttons['instructionsBack']
        .removeEventListener('click', this.listeners['instructionsBack']);
      DOMUtil.fadeToBlack(function () {
        DOMUtil.clearInstructions();
        this.showMenu();
      }.bind(this));
    }.bind(this),
    newGame: function () {
      this.buttons['newGame']
        .removeEventListener('click', this.listeners['newGame']);
      DOMUtil.fadeToBlack(function () {
        DOMUtil.clearOuterMenu();
        this.newGame();
      }.bind(this));
    }.bind(this)
  };
};

GameView.prototype.instructionsBack = function () {
  var instructionsBack = this.buttons['instructionsBack'];
  instructionsBack
    .addEventListener('click', this.listeners['instructionsBack']);
};

GameView.prototype.menuAnnouncement = function () {
  var announcement = document.getElementById('tron-menu-winner');
  announcement.innerHTML = this.game ?
    this.game.announcement['announcement'] : 'Tron!';
  announcement.setAttribute('class', 'tron-menu-animate');
};

GameView.prototype.menuListenInstructions = function () {
  var instructionsButton = this.buttons['instructions'];
  instructionsButton.addEventListener('click', this.listeners['instructions']);
  instructionsButton.innerHTML = 'Instructions';
  instructionsButton.setAttribute('class', 'tron-menu-animate');
};

GameView.prototype.menuListenNewGame = function () {
  var newGameButton = this.buttons['newGame'];
  newGameButton.innerHTML = 'New Game';
  newGameButton.addEventListener('click', this.listeners['newGame']);
  newGameButton.setAttribute('class', 'tron-menu-animate');
};

GameView.prototype.newGame = function () {
  console.log('newGame');
  if (this.game) { this.game.terminate(); }
  this.game = new Game();
  this.play();
};

GameView.prototype.play = function () {
  if (this.game.isGameOver) {
    this.endGame();
  } else {
    if (this.frames > Constants.FRAMES_PER_STEP) {
      this.frames = 0
      this.game.step();
      this.game.draw(this.ctx)
    }
    this.frames += 1;
    requestAnimationFrame(this.play.bind(this));
  }
};

GameView.prototype.run = function () {
  this.initializeButtons();
  this.initializeListeners();
  DOMUtil.clearInstructions();
  this.showMenu();
};

GameView.prototype.showInstructions = function () {
  this.instructionsBack();
  document.getElementById('tron-instructions').style.display = 'block';
};

GameView.prototype.showMenu = function () {
  CanvasUtil.clearPlayingArea(this.ctx);
  DOMUtil.menuBackground(this.backgroundCycle);
  document.getElementById('tron-outer-menu').style.display = 'block';
  this.flyInMenuItems();
};

module.exports = GameView;
