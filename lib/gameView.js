var CanvasUtil = require('./canvasUtil'),
    Constants = require('./constants'),
    DOMUtil = require('./DOMUtil'),
    Game = require('./game');

var GameView = function (opts) {
  this.backgroundCycle = 1;
  this.ctx = opts.ctx;
  this.frames = 0;
  this.game = null;
  this.state = 'menu';
  console.log(this.state);
  this.initializeButtons();
  this.initializeListeners();
  this.bindHotkeys();
  this.run();
};

GameView.prototype.bindHotkeys = function () {
  document.addEventListener('keydown', this.listeners['gameState']);
};

GameView.prototype.endGame = function () {
  this.state = 'endGame';
  console.log(this.state);
  setTimeout(function () {
    this.fanfare();
    setTimeout(function () {
      DOMUtil.fadeToBlack(function () {
        this.showMenu();
      }.bind(this));
    }.bind(this), 600)
  }.bind(this), 200);
};

GameView.prototype.fanfare = function () {
  if (this.game.announcement['announcement'] === 'Draw!') { return; }
  this.state = 'fanfare';
  console.log(this.state);
  CanvasUtil.fanfare(this.ctx, this.game.announcement['color']);
  var x1 = 0, ctx = this.ctx;
};

GameView.prototype.flyInMenuItems = function () {
  // this.flyOutMenuItems();
  setTimeout(function () {
    if (this.state === 'menu') {
      this.menuAnnouncement();
      setTimeout(function () { this.menuListenNewGame(); }.bind(this), 100);
      setTimeout(function () { this.menuListenInstructions(); }.bind(this), 200);
    };
  }.bind(this), 500)
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
    gameState: function (e) {
      if (this.isInTransition) { return; console.log('return from il');}
      if (e.code === 'Space') {
        e.preventDefault();
        if (this.state === 'paused') {
          this.state = 'playing';
          console.log(this.state);
          this.play();
        } else if (this.state === 'playing') {
          this.state = 'paused';
          console.log(this.state);
        } else if (this.state === 'menu') {
          DOMUtil.fadeToBlack(function () {
            DOMUtil.clearOuterMenu();
            this.newGame();
          }.bind(this));
        } else if (this.state === 'instructions') {
          DOMUtil.fadeToBlack(function () {
            DOMUtil.clearInstructions();
            this.newGame();
          }.bind(this));
        } else if (this.state === 'fanfare') { return
        } else if (this.state === 'endGame') { return
        }
      }
    }.bind(this),
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

GameView.prototype.menuAnnouncement = function (emptyKlass) {
  var announcement = document.getElementById('tron-menu-winner');
  announcement.innerHTML = this.game ?
    this.game.announcement['announcement'] : 'Tron!';
  if (emptyKlass) {
    announcement.removeAttribute('class');
  } else {
    announcement.setAttribute('class', 'tron-menu-animate');
  }
};

GameView.prototype.menuListenInstructions = function (emptyKlass) {
  var instructionsButton = this.buttons['instructions'];
  instructionsButton.addEventListener('click', this.listeners['instructions']);
  instructionsButton.innerHTML = 'Instructions';
  if (emptyKlass) {
    instructionsButton.removeAttribute('class');
  } else {
    instructionsButton.setAttribute('class', 'tron-menu-animate');
  }
};

GameView.prototype.menuListenNewGame = function (emptyKlass) {
  var newGameButton = this.buttons['newGame'];
  newGameButton.innerHTML = 'New Game';
  newGameButton.addEventListener('click', this.listeners['newGame']);
  if (emptyKlass) {
    newGameButton.removeAttribute('class');
  } else {
    newGameButton.setAttribute('class', 'tron-menu-animate');
  }
};

GameView.prototype.newGame = function () {
  if (this.game) { this.game.terminate(); }
  this.state = 'playing';
  console.log(this.state);
  this.game = new Game();
  this.play();
};

GameView.prototype.play = function () {
  if (this.game.isGameOver) {
    this.endGame();
  } else if (this.state === 'paused') {
    this.frames = 0;
    return;
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
  DOMUtil.clearInstructions();
  this.showMenu();
};

GameView.prototype.showInstructions = function () {
  this.state = 'instructions';
  console.log('instructions');
  this.instructionsBack();
  document.getElementById('tron-instructions').style.display = 'block';
};

GameView.prototype.showMenu = function () {
  this.state = 'menu';
  console.log(this.state);
  CanvasUtil.clearPlayingArea(this.ctx);
  DOMUtil.menuBackground(this.backgroundCycle);
  document.getElementById('tron-outer-menu').style.display = 'block';
  this.flyInMenuItems();
};

GameView.prototype.togglePauseStart = function () {

};

module.exports = GameView;
