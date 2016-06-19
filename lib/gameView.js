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

GameView.prototype.menuBackground = function () {
  document.getElementById('tron-menu-background')
    .setAttribute(
      'src',
      './assets/images/tron_background_' + this.backgroundCycle + '.gif'
    );
};

GameView.prototype.clearInstructions = function () {
  document.getElementById('tron-instructions').style.display = 'none';
};

GameView.prototype.clearMenu = function () {
  this.clearOuterMenu();
  this.clearInstructions();
};

GameView.prototype.clearMenuAnnouncement = function () {
  var announcement = document.getElementById('tron-menu-winner');
  announcement.removeAttribute('class');
  announcement.innerHTML = '';
};

GameView.prototype.clearMenuInstructions = function () {
  var instructionsButton = document.getElementById('tron-menu-instructions');
  instructionsButton.innerHTML = '';
  instructionsButton.removeAttribute('class');
};

GameView.prototype.clearMenuNewGame = function () {
  var newGameButton = document.getElementById('tron-menu-new-game');
  newGameButton.innerHTML = '';
  newGameButton.removeAttribute('class');
};

GameView.prototype.clearOuterMenu = function () {
  this.clearMenuAnnouncement();
  this.clearMenuInstructions();
  this.clearMenuNewGame();
  document.getElementById('tron-outer-menu').style.display = 'none';
};

GameView.prototype.endGame = function () {
  this.game.unbindKeyHandlers();
  setTimeout(function () {
    this.fanfare();
    setTimeout(function () {
      DOMUtil.fadeToBlack();
      setTimeout(function () {
        this.showMenu();
      }.bind(this), 1000)
    }.bind(this), 600)
  }.bind(this), 500);
};

GameView.prototype.fanfare = function () {
  if (this.game.announcement['announcement'] === 'Draw!') { return; }
  CanvasUtil.fanfare(this.ctx, this.game.announcement['color']);
  var x1 = 0, ctx = this.ctx;
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
        this.clearOuterMenu();
        this.showInstructions();
      }.bind(this));
    }.bind(this),
    instructionsBack: function () {
      this.buttons['instructionsBack']
        .removeEventListener('click', this.listeners['instructionsBack']);
      DOMUtil.fadeToBlack(function () {
        this.clearInstructions();
        this.showMenu();
      }.bind(this));
    }.bind(this),
    newGame: function () {
      this.buttons['newGame']
        .removeEventListener('click', this.listeners['newGame']);
      DOMUtil.fadeToBlack(function () {
        this.clearOuterMenu();
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

GameView.prototype.instructionsHeader = function () {
  document.getElementById('tron-instructions-header').innerHTML =
    'Instructions';
};

GameView.prototype.menuAnnouncement = function () {
  var announcement = document.getElementById('tron-menu-winner');
  announcement.innerHTML = this.game ?
    this.game.announcement['announcement'] : 'Tron!';
  announcement.setAttribute('class', 'tron-menu-animate');
};

GameView.prototype.menuInstructions = function () {
  var instructionsButton = this.buttons['instructions'];
  instructionsButton.addEventListener('click', this.listeners['instructions']);
  instructionsButton.innerHTML = 'Instructions';
  instructionsButton.setAttribute('class', 'tron-menu-animate');
};

GameView.prototype.menuItems = function () {
  setTimeout(function () { this.menuAnnouncement(); }.bind(this), 500);
  setTimeout(function () { this.menuNewGame(); }.bind(this), 600);
  setTimeout(function () { this.menuInstructions(); }.bind(this), 700);
};

GameView.prototype.menuNewGame = function () {
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
  this.clearInstructions();
  this.showMenu();
};

GameView.prototype.showInstructions = function () {
  this.instructionsBack();
  document.getElementById('tron-instructions').style.display = 'block';
};

GameView.prototype.showMenu = function () {
  CanvasUtil.clearPlayingArea(this.ctx);
  this.menuBackground();
  document.getElementById('tron-outer-menu').style.display = 'block';
  this.menuItems();
};

module.exports = GameView;
