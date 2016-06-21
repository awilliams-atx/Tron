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
  this.initialize();
  this.run();
};

GameView.prototype.addEventListeners = function () {
  document.addEventListener('keydown', this.listeners['gameState']);
  this.DOM.newGameButton.el.addEventListener('click', this.listeners.newGameButton);
  this.DOM.instructionsButton.el
    .addEventListener('click', this.listeners.instructions);
  this.DOM.instructionsBack.el
    .addEventListener('click', this.listeners.instructionsBack);
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
    DOMUtil.flyIn(this.DOM.announcement);
    DOMUtil.flyIn(this.DOM.newGameButton, 100);
    setTimeout(function () { this.menuListenInstructions(); }.bind(this), 200);
  }.bind(this), 500)
};

GameView.prototype.flyOutMenuItems = function () {
  DOMUtil.flyOut(this.DOM.announcement);
  DOMUtil.flyOut(this.DOM.newGameButton);
  this.menuListenInstructions('emptyClass');
};

GameView.prototype.initialize = function () {
  this.initializeDOM();
  this.initializeListeners();
  this.addEventListeners();
};

GameView.prototype.initializeDOM = function () {
  this.DOM = {
    announcement: {
      el: document.getElementById('tron-menu-announcement'),
      flyInKlass: 'tron-menu-animate',
      flyOutKlass: 'tron-menu-nowhere',
    },
    instructions: {
      el: document.getElementById('tron-instructions'),
      display: 'block',
      undisplay: 'none'
    },
    instructionsButton: {
      el: document.getElementById('tron-menu-instructions'),
      flyInKlass: 'tron-menu-animate',
      flyOutKlass: 'tron-menu-nowhere',
    },
    instructionsBack: {
      el: document.getElementById('tron-instructions-back')
    },
    modalPauseHeader: {
      el: document.getElementById('tron-modal-pause-header'),
      flyInKlass: 'tron-modal-pause-header-animate',
      flyOutKlass: 'tron-modal-pause-header-nowhere'
    },
    modalPauseBody: {
      el: document.getElementById('tron-modal-pause-body'),
      flyInKlass: 'tron-modal-pause-body-animate',
      flyOutKlass: 'tron-modal-pause-body-nowhere'
    },
    newGameButton: {
      el: document.getElementById('tron-menu-new-game'),
      flyInKlass: 'tron-menu-animate',
      flyOutKlass: 'tron-menu-nowhere',
    },
    outerMenu: {
      el: document.getElementById('tron-outer-menu'),
      display: 'block',
      undisplay: 'none'
    }
  }
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
          this.DOM.modalPauseHeader,
          this.DOM.modalPauseBody
        );
          this.play();
        } else if (this.state === 'playing') {
          this.state = 'paused';
          DOMUtil.modalPause(
            true,
            this.DOM.modalPauseHeader,
            this.DOM.modalPauseBody
          );
        } else if (this.state === 'menu') {
          this.flyOutMenuItems();
          DOMUtil.fadeToBlack(function () {
            DOMUtil.undisplay(this.DOM.outerMenu);
            this.newGame();
          }.bind(this));
        } else if (this.state === 'instructions') {
          DOMUtil.fadeToBlack(function () {
            DOMUtil.undisplay(this.DOM.instructions);
            this.newGame();
          }.bind(this));
        } else if (this.state === 'fanfare') { return
        } else if (this.state === 'endGame') { return
        }
      }
    }.bind(this),
    instructions: function () {
      DOMUtil.fadeToBlack(function () {
        DOMUtil.clearOuterMenu();
        DOMUtil.display(this.DOM.instructions);
        this.state = 'instructions';
      }.bind(this));
    }.bind(this),
    instructionsBack: function () {
      DOMUtil.fadeToBlack(function () {
        DOMUtil.undisplay(this.DOM.instructions);
        this.showMenu();
      }.bind(this));
    }.bind(this),
    newGameButton: function () {
      this.flyOutMenuItems();
      DOMUtil.fadeToBlack(function () {
        DOMUtil.undisplay(this.DOM.outerMenu);
        this.newGame();
      }.bind(this));
    }.bind(this)
  };
};

GameView.prototype.menuListenInstructions = function (emptyKlass) {
  if (emptyKlass) {
  } else {
    this.DOM.instructionsButton.el.setAttribute('class', 'tron-menu-animate');
  }
};

GameView.prototype.menuListenNewGame = function (emptyKlass) {
  if (emptyKlass) {
  } else {
    console.log('menuListenNewGame');
    this.DOM.newGame.el.setAttribute('class', 'tron-menu-animate');
  }
};

GameView.prototype.newGame = function () {
  if (this.game) { this.game.terminate(); }
  this.state = 'playing';
  this.game = new Game();
  this.play();
  this.flyOutMenuItems();
  DOMUtil.toggleModal('tron-modal-pause', true);
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

GameView.prototype.run = function () {
  DOMUtil.undisplay(this.DOM.instructions);
  DOMUtil.clearModal('tron-modal-pause');
  DOMUtil.flyOut(this.DOM.modalPauseHeader);
  DOMUtil.flyOut(this.DOM.modalPauseBody);
  DOMUtil.fadeIn(100, this.showMenu.bind(this));
};

GameView.prototype.setAnnouncement = function () {
  this.DOM.announcement.el.innerHTML = this.game ? this.game.announcement.announcement : 'Tron!';
};

GameView.prototype.showMenu = function (timeout) {
  timeout = timeout || 0;
  DOMUtil.display(this.DOM.outerMenu, timeout, function () {
    this.state = 'menu';
    CanvasUtil.clearPlayingArea(this.ctx);
    DOMUtil.menuBackground(this.backgroundCycle);
    this.flyInMenuItems();
  }.bind(this));
};

module.exports = GameView;
