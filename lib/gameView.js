var Util = require('./util');

var GameView = function (opts) {
  this.game = opts.game;
  this.ctx = opts.ctx;
  this.restart = opts.restart;
  this.menuItems = [];
  this.frames = 0;
  this.backgroundCycle = opts.backgroundCycle;
  this.play();
};

GameView.prototype.backgroundImage = function () {
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

  ctx.clearRect(0, 0, Game.DIM_X * 10, Game.DIM_Y * 10);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X * 10, Game.DIM_Y * 10);
};

GameView.prototype.endGame = function () {
  setTimeout(function () {
    this.fanfare();
    setTimeout(function () {
      this.fadeToBlack();
      setTimeout(function () {
        this.showMenu();
      }.bind(this), 1000)
    }.bind(this), 100)
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
  var x1 = 0, ctx = this.ctx;

  var fanfareStep = function () {
    var x2 = x1 + 20, x3 = x1 - 60, x4 = x1 - 80, y1 = 0, y2 = 500;
    console.log('x1: ' + x1 + ', x2: ' + x2 + ', x3: ' + x3 + ', x4: ' + x4);
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

GameView.prototype.instructionsBack = function () {
  var back = document.getElementById('tron-instructions-back');

  this.instructionsBackListener = function () {
    back.removeEventListener('click', this.instructionsBackListener);
    this.fadeToBlack();
    setTimeout(function () {
      this.showMenu();
    }.bind(this), 1000)
  }.bind(this);

  back.addEventListener('click', this.instructionsBackListener);
};

GameView.prototype.instructionsHeader = function () {
  document.getElementById('tron-instructions-header').innerHTML =
    'Instructions';
};

GameView.prototype.menuAnnouncement = function () {
  var announcement = document.getElementById('tron-menu-winner');
  announcement.innerHTML =
    this.game.announcement['announcement'] || 'Tron!';
  announcement.setAttribute('class', 'tron-menu-animate');
};

GameView.prototype.menuInstructions = function () {
  var instructionsButton =
  document.getElementById('tron-menu-instructions');

  var instructionsListener = function () {
    instructionsButton.removeEventListener('click', instructionsListener);
    this.fadeToBlack();
    setTimeout(function () {
      this.showInstructions();
    }.bind(this), 1000)
  }.bind(this)

  instructionsButton.addEventListener('click', instructionsListener);
  instructionsButton.innerHTML = 'Instructions';
  instructionsButton.setAttribute('class', 'tron-menu-animate');
};

GameView.prototype.menuNewGame = function () {
  var newGameButton = document.getElementById('tron-menu-new-game');

  var newGameListener = function () {
    newGameButton.removeEventListener('click', newGameListener);
    this.fadeToBlack();
    setTimeout(function () {
      this.clearMenu();
      this.restart();
    }.bind(this), 1000);
  }.bind(this);

  newGameButton.addEventListener('click', newGameListener);
  newGameButton.innerHTML = 'New Game';
  newGameButton.setAttribute('class', 'tron-menu-animate');
};

GameView.prototype.play = function () {
  this.clearMenu();
  this.frames += 1;
  var game = this.game;

  if (game.isGameOver) {
    this.endGame();
  } else {
    this.step();
  }
};

GameView.prototype.showInstructions = function () {
  this.clearMenu();
  this.clearPlayingArea();
  this.instructionsBack();
  document.getElementById('tron-instructions').style.display = 'block';
};

GameView.prototype.showMenu = function () {
  cancelAnimationFrame(this.animation);
  this.clearInstructions();
  this.clearPlayingArea();
  this.backgroundImage();
  document.getElementById('tron-outer-menu').style.display = 'block';
  setTimeout(function () { this.menuAnnouncement(); }.bind(this), 300);
  setTimeout(function () { this.menuNewGame(); }.bind(this), 400);
  setTimeout(function () { this.menuInstructions(); }.bind(this), 500);
};

GameView.prototype.step = function () {
  if (this.frames >= 5) {
    this.frames = 0;
    this.game.step();
    this.game.draw(this.ctx);
  }
  requestAnimationFrame(this.play.bind(this));
};

module.exports = GameView;
