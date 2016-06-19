var Constants = require('./constants'),
    Game = require('./game');
    // Util = require('./util');

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

GameView.prototype.clearPlayingArea = function () {
  var ctx = this.ctx,
      Game = this.game;

  ctx.clearRect(0, 0, Constants.DIM_X * 10, Constants.DIM_Y * 10);
  ctx.fillStyle = Constants.BG_COLOR;
  ctx.fillRect(0, 0, Constants.DIM_X * 10, Constants.DIM_Y * 10);
};

GameView.prototype.endGame = function () {
  this.game.unbindKeyHandlers();
  setTimeout(function () {
    this.fanfare();
    setTimeout(function () {
      this.fadeToBlack();
      setTimeout(function () {
        this.showMenu();
      }.bind(this), 1000)
    }.bind(this), 600)
  }.bind(this), 500);
};

GameView.prototype.fadeToBlack = function () {
  var screenFader = document.getElementById('screen-fader');
  screenFader.setAttribute('class', 'transparent-block')
  setTimeout(function () {
    screenFader.setAttribute('class', 'fade-out');
  }, 10);
  setTimeout(function () {
    screenFader.setAttribute('class', 'fade-in');
  }, 1000);
  setTimeout(function () {
    screenFader.setAttribute('class', 'nowhere');
  }, 2000);
};

GameView.prototype.fanfare = function () {
  if (this.game.announcement['announcement'] === 'Draw!') { return; }
  var x1 = 0, ctx = this.ctx;

  var fanfareStep = function () {
    var x2 = x1 + 20, x3 = x1 - 60, x4 = x1 - 80, y1 = 0, y2 = 500;
    // console.log('x1: ' + x1 + ', x2: ' + x2 + ', x3: ' + x3 + ', x4: ' + x4);
    if (x4 < 500) {
      setTimeout(function () {
        ctx.fillStyle = this.game.announcement['color'];
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y1);
        ctx.lineTo(x3, y2);
        ctx.lineTo(x4, y2);
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x4, y2);
        ctx.lineTo(0, 300);
        ctx.fill();
        ctx.closePath();
        x1 += 5;
        fanfareStep();
      }.bind(this), 1);
    }
  }.bind(this);

  fanfareStep();
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
      // this.fadeToBlack();
      // setTimeout(function () {
        this.clearOuterMenu();
        this.showInstructions();
      // }.bind(this), 1000)
    }.bind(this),
    instructionsBack: function () {
      this.buttons['instructionsBack']
        .removeEventListener('click', this.listeners['instructionsBack']);
      // this.fadeToBlack();
      // setTimeout(function () {
        this.clearInstructions();
        this.showMenu();
      // }.bind(this), 1000)
    }.bind(this),
    newGame: function () {
      this.buttons['newGame']
        .removeEventListener('click', this.listeners['newGame']);
      // this.fadeToBlack();
      // setTimeout(function () {
        this.clearOuterMenu();
        this.newGame();
      // }.bind(this), 1000);
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
  if (this.tronGameLoad) {
    this.clearInstructions();
    this.showMenu();
  } else {
    this.play.bind(this);
  }
};

GameView.prototype.showInstructions = function () {
  this.instructionsBack();
  document.getElementById('tron-instructions').style.display = 'block';
};

GameView.prototype.showMenu = function () {
  this.clearPlayingArea();
  this.menuBackground();
  document.getElementById('tron-outer-menu').style.display = 'block';
  this.menuItems();
};

module.exports = GameView;
