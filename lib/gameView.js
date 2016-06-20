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
  this.buttons.newGame.addEventListener('click', this.listeners.newGame);
  this.buttons.instructions
    .addEventListener('click', this.listeners.instructions);
  this.buttons.instructionsBack
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
  setTimeout(function () {
    this.menuAnnouncement();
    setTimeout(function () { this.menuListenNewGame(); }.bind(this), 100);
    setTimeout(function () { this.menuListenInstructions(); }.bind(this), 200);
  }.bind(this), 500)
};

GameView.prototype.flyOutMenuItems = function () {
  // timeout to ensure async flyIn completes
  setTimeout(function () {
    this.menuAnnouncement('emptyClass');
    this.menuListenNewGame('emptyClass');
    this.menuListenInstructions('emptyClass');
  }.bind(this), 700);
};

GameView.prototype.initializeButtons = function () {
  this.buttons = {
    instructions: document.getElementById('tron-menu-instructions'),
    instructionsBack: document.getElementById('tron-instructions-back'),
    newGame: document.getElementById('tron-menu-new-game')
  };
};

GameView.prototype.initialize = function () {
  this.initializeButtons();
  this.initializeDomEls();
  this.initializeListeners();
  this.addEventListeners();
};

GameView.prototype.initializeDomEls = function () {
  this.domEls = {
    modalPauseHeader: {
      el: document.getElementById('tron-modal-pause-header'),
      flyInKlass: 'tron-modal-pause-header-animate',
      flyOutKlass: 'tron-modal-pause-header-nowhere'
    },
    modalPauseBody: {
      el: document.getElementById('tron-modal-pause-body'),
      flyInKlass: 'tron-modal-pause-body-animate',
      flyOutKlass: 'tron-modal-pause-body-nowhere'
    }
  }
};


GameView.prototype.initializeListeners = function () {
  this.listeners = {
    gameState: function (e) {
      if (this.isInTransition) { return; console.log('return from il');}
      if (e.code === 'Space') {
        e.preventDefault();
        if (this.state === 'paused') {
          this.state = 'playing';
          DOMUtil.modalPause(
          false,
          this.domEls.modalPauseHeader,
          this.domEls.modalPauseBody
        );
          this.play();
        } else if (this.state === 'playing') {
          this.state = 'paused';
          DOMUtil.modalPause(
            true,
            this.domEls.modalPauseHeader,
            this.domEls.modalPauseBody
          );
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
      DOMUtil.fadeToBlack(function () {
        DOMUtil.clearOuterMenu();
        this.showInstructions();
      }.bind(this));
    }.bind(this),
    instructionsBack: function () {
      DOMUtil.fadeToBlack(function () {
        DOMUtil.clearInstructions();
        this.showMenu();
      }.bind(this));
    }.bind(this),
    newGame: function () {
      DOMUtil.fadeToBlack(function () {
        DOMUtil.clearOuterMenu();
        this.newGame();
      }.bind(this));
    }.bind(this)
  };
};

GameView.prototype.instructionsBack = function () {
  var instructionsBack = this.buttons['instructionsBack'];
};

GameView.prototype.menuAnnouncement = function (emptyKlass) {
  var announcement = document.getElementById('tron-menu-winner');
  if (emptyKlass) {
    announcement.innerHTML = '';
    announcement.removeAttribute('class');
  } else {
    announcement.innerHTML = this.game ?
    this.game.announcement['announcement'] : 'Tron!';
    announcement.setAttribute('class', 'tron-menu-animate');
  }
};

GameView.prototype.menuListenInstructions = function (emptyKlass) {
  if (emptyKlass) {
    this.buttons.instructions.innerHTML = '';
    this.buttons.instructions.removeAttribute('class');
  } else {
    this.buttons.instructions.innerHTML = 'Instructions';
    this.buttons.instructions.setAttribute('class', 'tron-menu-animate');
  }
};

GameView.prototype.menuListenNewGame = function (emptyKlass) {
  if (emptyKlass) {
    this.buttons.newGame.innerHTML = '';
    this.buttons.newGame.removeAttribute('class');
  } else {
    this.buttons.newGame.innerHTML = 'New Game';
    this.buttons.newGame.setAttribute('class', 'tron-menu-animate');
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
  DOMUtil.clearModal('tron-modal-pause');
  DOMUtil.flyOut(this.domEls.modalPauseHeader);
  DOMUtil.flyOut(this.domEls.modalPauseBody);
  DOMUtil.clearInstructions();
  this.showMenu();
};

GameView.prototype.showInstructions = function () {
  this.state = 'instructions';
  this.instructionsBack();
  document.getElementById('tron-instructions').style.display = 'block';
};

GameView.prototype.showMenu = function () {
  this.state = 'menu';
  CanvasUtil.clearPlayingArea(this.ctx);
  DOMUtil.menuBackground(this.backgroundCycle);
  document.getElementById('tron-outer-menu').style.display = 'block';
  this.flyInMenuItems();
};

module.exports = GameView;
