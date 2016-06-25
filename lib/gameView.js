var CanvasUtil = require('./util/canvasUtil'),
    Constants = require('./constants'),
    DOM = require('./DOM'),
    DOMUtil = require('./util/DOMUtil'),
    Game = require('./game');

var GameView = function (canvasEl) {
  canvasEl.width = Constants.DIM_X;
  canvasEl.height = Constants.DIM_Y;
  this.backgroundCycle = 1;
  this.ctx = canvasEl.getContext('2d');
  this.frames = 0;
  this.game = null;
  this.numPlayers = 1;
  this.state = 'menu';
  this.initialize();
  this.run();
};

GameView.prototype.addEventListeners = function () {
  document.addEventListener('keydown', this.listeners['gameState']);
  DOM.newGameButton.el
    .addEventListener('click', this.listeners.newGameButton);
  DOM.instructionsButton.el
    .addEventListener('click', this.listeners.instructions);
  DOM.instructionsBack.el
    .addEventListener('click', this.listeners.instructionsBack);
  DOM.singlePlayer.el
    .addEventListener('click', this.listeners.newSinglePlayerGame);
  DOM.twoPlayer.el
    .addEventListener('click', this.listeners.newTwoPlayerGame);
};

GameView.prototype.cycleBackground = function () {
  this.backgroundCycle += 1;
  if (this.backgroundCycle > 4) {
    this.backgroundCycle = 1;
  }
};

GameView.prototype.endGame = function () {
  DOMUtil.toggleModal('tron-modal-pause');
  this.state = 'endGame';
  setTimeout(function () {
    this.fanfare();
    setTimeout(function () {
      DOMUtil.fadeToBlack(function () {
        this.showMenu();
      }.bind(this));
    }.bind(this), 600);
  }.bind(this), 600);
};

GameView.prototype.fanfare = function () {
  if (this.game.announcement['announcement'] === 'Draw!') { return; }
  this.state = 'fanfare';
  CanvasUtil.fanfare(this.ctx, this.game.announcement['color']);
  var x1 = 0, ctx = this.ctx;
};

GameView.prototype.flyInMenuItems = function () {
  this.setAnnouncement();
  setTimeout(function () {
    DOMUtil.flyIn(DOM.announcement);
    DOMUtil.flyIn(DOM.newGameButton, 100);
    DOMUtil.flyIn(DOM.instructionsButton, 200);
  }.bind(this), 500)
};

GameView.prototype.flyOutMenuItems = function () {
  DOMUtil.flyOut(DOM.instructionsButton);
  DOMUtil.flyOut(DOM.newGameButton, 100);
  DOMUtil.flyOut(DOM.announcement, 200);
};

GameView.prototype.initialize = function () {
  this.initializeListeners();
  this.addEventListeners();
};

GameView.prototype.initializeListeners = function () {
  this.listeners = {
    gameState: function (e) {
      if (e.code === 'Space') {
        e.preventDefault();
        if (this.isInTransition) { return }
        if (this.state === 'paused') {
          this.state = 'playing';
          DOMUtil.modalPause(
          false,
          DOM.modalPauseHeader,
          DOM.modalPauseBody
        );
          this.play();
        } else if (this.state === 'playing') {
          this.state = 'paused';
          DOMUtil.modalPause(
            true,
            DOM.modalPauseHeader,
            DOM.modalPauseBody
          );
        } else if (this.state === 'menu') {
          this.flyOutMenuItems();
          DOMUtil.fadeToBlack(function () {
            DOMUtil.undisplay(DOM.outerMenu);
            this.newGame(this.numPlayers);
          }.bind(this));
        } else if (this.state === 'instructions') {
          DOMUtil.fadeToBlack(function () {
            DOMUtil.undisplay(DOM.instructions);
            this.newGame();
          }.bind(this));
        } else if (this.state === 'fanfare') { return
        } else if (this.state === 'endGame') { return
        }
      }
    }.bind(this),
    instructions: function () {
      this.flyOutMenuItems();
      DOMUtil.fadeToBlack(function () {
        DOMUtil.undisplay(DOM.outerMenu);
        DOMUtil.display(DOM.instructions);
        this.state = 'instructions';
      }.bind(this));
    }.bind(this),
    instructionsBack: function () {
      DOMUtil.fadeToBlack(function () {
        DOMUtil.undisplay(DOM.instructions);
        this.showMenu();
      }.bind(this));
    }.bind(this),
    newGameButton: function () {
      this.flyOutMenuItems();
      DOMUtil.cycleKlass(DOM.singlePlayer);
      DOMUtil.cycleKlass(DOM.twoPlayer);
      DOMUtil.fadeToBlack(function () {
        DOMUtil.undisplay(DOM.outerMenu);
        DOMUtil.cycleKlass(DOM.singlePlayer, 200);
        DOMUtil.cycleKlass(DOM.twoPlayer, 200);
      }.bind(this), 200);
    }.bind(this),
    newSinglePlayerGame: function () {
      DOMUtil.cycleKlass(DOM.singlePlayer);
      DOMUtil.cycleKlass(DOM.twoPlayer);
      DOMUtil.fadeToBlack(function () {
        DOMUtil.cycleKlass(DOM.singlePlayer);
        DOMUtil.cycleKlass(DOM.twoPlayer);
        this.newGame(1);
      }.bind(this))
    }.bind(this),
    newTwoPlayerGame: function () {
      DOMUtil.cycleKlass(DOM.singlePlayer);
      DOMUtil.cycleKlass(DOM.twoPlayer);
      DOMUtil.fadeToBlack(function () {
        DOMUtil.cycleKlass(DOM.singlePlayer, 500);
        DOMUtil.cycleKlass(DOM.twoPlayer, 500);
        this.newGame(2);
      }.bind(this))
    }.bind(this)
  };
};

GameView.prototype.newGame = function (numPlayers) {
  this.numPlayers = numPlayers;
  if (this.game) { this.game.terminate(); }
  this.state = 'playing';
  this.game = new Game(numPlayers);
  this.play();
  this.flyOutMenuItems();
  DOMUtil.toggleModal('tron-modal-pause', true);
  this.cycleBackground();
};

GameView.prototype.play = function () {
  if (this.game.isGameOver) {
    this.endGame();
  } else if (this.state === 'paused') {
    this.frames = 0;
    return;
  } else {
    if (this.frames > Constants.FRAMES_PER_STEP) {
      this.frames = 0;
      this.game.step();
      this.game.draw(this.ctx)
    }
    this.frames += 1;
    requestAnimationFrame(this.play.bind(this));
  }
};

GameView.prototype.promptGameTypeSelection = function () {
  DOMUtil.klassify(DOM.singlePlayer);
  DOMUtil.klassify(DOM.twoPlayer);
};

GameView.prototype.run = function () {
  DOMUtil.undisplay(DOM.instructions);
  DOMUtil.clearModal('tron-modal-pause');
  DOMUtil.flyOut(DOM.modalPauseHeader);
  DOMUtil.flyOut(DOM.modalPauseBody);
  DOMUtil.fadeIn(100, this.showMenu.bind(this));
};

GameView.prototype.setAnnouncement = function () {
  DOM.announcement.el.innerHTML = this.game ? this.game.announcement.announcement : 'Tron!';
};

GameView.prototype.showMenu = function (timeout) {
  timeout = timeout || 0;
  DOMUtil.display(DOM.outerMenu, timeout, function () {
    this.state = 'menu';
    CanvasUtil.clearPlayingArea(this.ctx);
    DOMUtil.menuBackground(this.backgroundCycle);
    this.flyInMenuItems();
  }.bind(this));
};

module.exports = GameView;
