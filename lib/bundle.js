/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var GameView = __webpack_require__(1);
	
	document.addEventListener('DOMContentLoaded', function () {
	  var canvasEl = document.getElementById('tron-canvas');
	  new GameView(canvasEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var CanvasUtil = __webpack_require__(2),
	    Constants = __webpack_require__(3),
	    DOM = __webpack_require__(4),
	    DOMUtil = __webpack_require__(5),
	    Game = __webpack_require__(6);
	
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
	  }, 500);
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
	        if (this.isInTransition) { return; }
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
	            this.newGame(this.numPlayers);
	          }.bind(this));
	        } else if (this.state === 'game-type-selection') {
	          DOMUtil.cycleKlass(DOM.singlePlayer);
	          DOMUtil.cycleKlass(DOM.twoPlayer);
	          DOMUtil.fadeToBlack(function () {
	            DOMUtil.cycleKlass(DOM.singlePlayer);
	            DOMUtil.cycleKlass(DOM.twoPlayer);
	            this.newGame(this.numPlayers);
	          }.bind(this));
	        } else if (this.state === 'fanfare') { return;
	        } else if (this.state === 'endGame') { return;
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
	      this.state = 'game-type-selection';
	      this.flyOutMenuItems();
	      DOMUtil.cycleKlass(DOM.singlePlayer);
	      DOMUtil.cycleKlass(DOM.twoPlayer);
	      DOMUtil.fadeToBlack(function () {
	        DOMUtil.undisplay(DOM.outerMenu);
	        DOMUtil.cycleKlass(DOM.singlePlayer, 200);
	        DOMUtil.cycleKlass(DOM.twoPlayer, 200);
	      }, 200);
	    }.bind(this),
	    newSinglePlayerGame: function () {
	      DOMUtil.cycleKlass(DOM.singlePlayer);
	      DOMUtil.cycleKlass(DOM.twoPlayer);
	      DOMUtil.fadeToBlack(function () {
	        DOMUtil.cycleKlass(DOM.singlePlayer);
	        DOMUtil.cycleKlass(DOM.twoPlayer);
	        this.newGame(1);
	      }.bind(this));
	    }.bind(this),
	    newTwoPlayerGame: function () {
	      DOMUtil.cycleKlass(DOM.singlePlayer);
	      DOMUtil.cycleKlass(DOM.twoPlayer);
	      DOMUtil.fadeToBlack(function () {
	        DOMUtil.cycleKlass(DOM.singlePlayer, 500);
	        DOMUtil.cycleKlass(DOM.twoPlayer, 500);
	        this.newGame(2);
	      }.bind(this));
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
	      this.game.draw(this.ctx);
	    }
	    this.frames += 1;
	    requestAnimationFrame(this.play.bind(this));
	  }
	};
	
	GameView.prototype.run = function () {
	  DOMUtil.undisplay(DOM.instructions);
	  DOMUtil.clearModal('tron-modal-pause');
	  DOMUtil.flyOut(DOM.modalPauseHeader);
	  DOMUtil.flyOut(DOM.modalPauseBody);
	  DOMUtil.fadeIn(200, this.showMenu.bind(this));
	};
	
	GameView.prototype.setAnnouncement = function () {
	  DOM.announcement.el.innerHTML =
	    this.game ? this.game.announcement.announcement : 'Tron!';
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Constants = __webpack_require__(3);
	
	var CanvasUtil = {
	  clearPlayingArea: function (ctx) {
	    ctx.clearRect(0, 0, Constants.DIM_X * 10, Constants.DIM_Y * 10);
	    ctx.fillStyle = Constants.BG_COLOR;
	    ctx.fillRect(0, 0, Constants.DIM_X * 10, Constants.DIM_Y * 10);
	  },
	  drawTrails: function (ctx, trails) {
	    Object.keys(trails).forEach(function (pos) {
	      var x = trails[pos].pos[0] * 10 + 1,
	          y = trails[pos].pos[1] * 10 + 1;
	      ctx.fillStyle = trails[pos].color;
	      ctx.fillRect(x, y, 8, 8);
	    });
	  },
	  fanfare: function (ctx, color) {
	    var x1 = 0;
	    fanfareStep();
	
	    function fanfareStep () {
	      var x2 = x1 + 20, x3 = x1 - 60, x4 = x1 - 80, y1 = 0, y2 = 500;
	      if (x4 < 500) {
	        setTimeout(function () {
	          ctx.fillStyle = color;
	          ctx.beginPath();
	          ctx.moveTo(x1, y1);
	          ctx.lineTo(x2, y1);
	          ctx.lineTo(x3, y2);
	          ctx.lineTo(x4, y2);
	          ctx.lineTo(x1, y1);
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
	          x1 += 9;
	          fanfareStep();
	        }, 1);
	      }
	    }
	  }
	};
	
	module.exports = CanvasUtil;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Constants = {
	  BG_COLOR: '#000000',
	  CYCLE_HEIGHT: 10,
	  CYCLE_WIDTH: 10,
	  DIM_X: 500,
	  DIM_Y: 300,
	  DRAW_SLIDE: '380px',
	  FRAMES_PER_STEP: 5,
	  PINK_HEAD: '#FF00D0',
	  PLAYER_WIN_SLIDE: '470px',
	  VEL: 1,
	  YELLOW_HEAD: '#FFF700'
	};
	
	module.exports = Constants;


/***/ },
/* 4 */
/***/ function(module, exports) {

	var DOM = {
	  announcement: {
	    el: document.getElementById('tron-menu-announcement'),
	    flyInKlass: 'tron-menu-animate',
	    flyOutKlass: 'tron-menu-nowhere'
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
	  singlePlayer: {
	    cycle: 0,
	    cycleKlass: function () {
	      this.cycle += 1;
	      if (this.cycle >= this.klasses.length) { this.cycle = 0; }
	      return this.klasses[this.cycle];
	    },
	    el: document.getElementById('tron-single-player'),
	    klasses: [
	      'nowhere',
	      'single-player-transparent',
	      'single-player-fly-in',
	      'single-player-transparent'
	    ]
	  },
	  twoPlayer: {
	    cycle: 0,
	    cycleKlass: function () {
	      this.cycle += 1;
	      if (this.cycle >= this.klasses.length) { this.cycle = 0; }
	      return this.klasses[this.cycle];
	    },
	    el: document.getElementById('tron-two-player'),
	    klasses: [
	      'nowhere',
	      'two-player-transparent',
	      'two-player-fly-in',
	      'two-player-transparent'
	    ]
	  },
	  outerMenu: {
	    el: document.getElementById('tron-outer-menu'),
	    display: 'block',
	    undisplay: 'none'
	  }
	};
	
	module.exports = DOM;


/***/ },
/* 5 */
/***/ function(module, exports) {

	var DOMUtil = {
	  clearMenuAnnouncement: function () {
	    var announcement = document.getElementById('tron-menu-announcement');
	    announcement.removeAttribute('class');
	    announcement.innerHTML = '';
	  },
	  clearMenuInstructions: function () {
	    var instructionsButton = document.getElementById('tron-menu-instructions');
	    instructionsButton.setAttribute('class', 'tron-menu-fly-out');
	  },
	  clearMenuNewGame: function () {
	    var newGameButton = document.getElementById('tron-menu-new-game');
	    newGameButton.setAttribute('class', 'tron-menu-fly-out');
	  },
	  clearModal: function (id) {
	    document.getElementById(id).style.display = 'none';
	  },
	  clearOuterMenu: function () {
	    DOMUtil.clearMenuAnnouncement();
	    DOMUtil.clearMenuInstructions();
	    DOMUtil.clearMenuNewGame();
	    document.getElementById('tron-outer-menu').style.display = 'none';
	  },
	  cycleKlass: function (domEl, timeout) {
	    timeout = timeout || 0;
	    setTimeout(function () {
	      domEl.el.setAttribute('class', domEl.cycleKlass());
	    }, timeout);
	  },
	  display: function (domEl, timeout, callback) {
	    timeout = timeout || 0;
	    setTimeout(function () {
	      domEl.el.style.display = domEl.display;
	      if (callback) { callback(); }
	    }, timeout);
	  },
	  fadeIn: function (timeout, callback) {
	    var screenFader = document.getElementById('tron-screen-fader');
	    setTimeout(function () {
	      if (callback) { callback(); }
	    }, timeout);
	    setTimeout(function () {
	      screenFader.setAttribute('class', 'fade-in');
	    }, timeout + 100);
	    setTimeout(function () {
	      screenFader.setAttribute('class', 'nowhere');
	    }, timeout + 350);
	  },
	  fadeToBlack: function (callback, timeout) {
	    timeout = timeout || 250;
	    this.isInTransition = true;
	    var screenFader = document.getElementById('tron-screen-fader');
	    screenFader.setAttribute('class', 'transparent-block');
	    setTimeout(function () {
	      screenFader.setAttribute('class', 'fade-out');
	    }, timeout + 1);
	    setTimeout(function () {
	      screenFader.setAttribute('class', 'fade-in');
	    }, timeout + 200);
	    setTimeout(function () {
	      if (callback) { callback(); }
	    }, timeout + 200);
	    setTimeout(function () {
	      screenFader.setAttribute('class', 'nowhere');
	      this.isInTransition = false;
	    }.bind(this), timeout + 400);
	  },
	  flyIn: function(domEl, timeout) {
	    timeout = timeout || 0;
	    setTimeout(function () {
	      domEl.el.setAttribute('class', domEl.flyInKlass);
	    }, timeout);
	  },
	  flyOut: function (domEl, timeout) {
	    timeout = timeout || 0;
	    setTimeout(function () {
	      domEl.el.setAttribute('class', domEl.flyOutKlass);
	    }, timeout);
	  },
	  menuBackground: function (backgroundCycle) {
	    document.getElementById('tron-menu-background')
	      .setAttribute(
	        'src',
	        './assets/images/tron_background_' + backgroundCycle + '.gif'
	      );
	  },
	  modalPause: function (isPaused, header, body) {
	    if (isPaused) {
	      document.getElementById('tron-modal-pause').style.opacity = .5;
	      DOMUtil.flyIn(header);
	      DOMUtil.flyIn(body);
	    } else {
	      DOMUtil.flyOut(header);
	      DOMUtil.flyOut(body);
	      setTimeout(function () {
	        document.getElementById('tron-modal-pause').style.opacity = 0;
	      }, 200);
	    }
	  },
	  toggleModal: function (id, isToggled) {
	    var el = document.getElementById(id);
	    if (isToggled)
	    {
	      el.style.display = 'block';
	    } else {
	      el.style.display = 'none';
	    }
	  },
	  undisplay: function (domEl, timeout) {
	    timeout = timeout || 0;
	    setTimeout(function () {
	      domEl.el.style.display = domEl.undisplay;
	    }, timeout);
	  }
	};
	
	module.exports = DOMUtil;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var CanvasUtil = __webpack_require__(2),
	    Computer = __webpack_require__(7),
	    Constants = __webpack_require__(3),
	    Cycle = __webpack_require__(11),
	    CycleUtil = __webpack_require__(9);
	
	var Game = function (numPlayers) {
	  this.newMoves = [];
	  this.trails = {};
	  this.addCycles(numPlayers);
	  this.announcement = {};
	  this.isGameOver = false;
	  this.DIM_X = Game.DIM_X;
	  this.DIM_Y = Game.DIM_Y;
	  this.BG_COLOR = Game.BG_COLOR;
	};
	
	Game.prototype.addCycles = function (numPlayers) {
	  var cycleOpts = {
	    pos: [5, 15],
	    direction: [1, 0],
	    color: Constants.YELLOW_HEAD,
	    name: 'Player 1',
	    keys: { up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD' }
	  };
	
	  this.cycle1 = new Cycle(cycleOpts);
	  this.newMoves.push(this.cycle1.pos);
	
	  if (numPlayers === 2) {
	    cycleOpts = {
	      pos: [45, 15],
	      direction: [-1, 0],
	      color: Constants.PINK_HEAD,
	      name: 'Player 2',
	      keys: {
	        up: 'ArrowUp',
	        down: 'ArrowDown',
	        left: 'ArrowLeft',
	        right: 'ArrowRight'
	      }
	    };
	
	    this.cycle2 = new Cycle(cycleOpts);
	  } else if (numPlayers === 1) {
	    this.cycle2 = new Computer(this.cycle1, this.trails, this.newMoves);
	  }
	
	  this.newMoves.push(this.cycle2.pos);
	};
	
	Game.prototype.checkCollisions = function () {
	  this.checkBorderCollisions();
	  this.checkCycleCollisions();
	  this.checkTrailCollisions();
	};
	
	Game.prototype.checkBorderCollisions = function () {
	  if (CycleUtil.isOutOfBounds(this.cycle1.pos) &&
	      CycleUtil.isOutOfBounds(this.cycle2.pos)) {
	    this.isGameOver = true;
	    this.announcement['announcement'] = 'Draw!';
	  } else if (CycleUtil.isOutOfBounds(this.cycle1.pos)) {
	    this.isGameOver = true;
	    this.makeAnnouncement(this.cycle2);
	  } else if (CycleUtil.isOutOfBounds(this.cycle2.pos)) {
	    this.isGameOver = true;
	    this.makeAnnouncement(this.cycle1);
	  }
	};
	
	Game.prototype.checkCycleCollisions = function () {
	  if (this.cycle1.isCollidedWith(this.cycle2)) {
	    this.isGameOver = true;
	    this.announcement['announcement'] = 'Draw!';
	  }
	};
	
	Game.prototype.checkTrailCollisions = function () {
	  var collidedCycles = [],
	      trails = this.trails;
	
	  Object.keys(this.trails).forEach(function (pos) {
	    if (
	      trails[pos].pos[0] === this.cycle1.pos[0] &&
	      trails[pos].pos[1] === this.cycle1.pos[1]
	    ) {
	      this.isGameOver = true;
	      collidedCycles.push(this.cycle1);
	    } else if (
	      trails[pos].pos[0] === this.cycle2.pos[0] &&
	      trails[pos].pos[1] === this.cycle2.pos[1]
	    ) {
	      this.isGameOver = true;
	      collidedCycles.push(this.cycle2);
	    }
	  }.bind(this));
	
	  if (collidedCycles.length === 2) {
	    this.announcement['announcement'] = 'Draw!';
	  } else if (collidedCycles[0] === this.cycle1) {
	    this.makeAnnouncement(this.cycle2);
	  } else if (collidedCycles[0] === this.cycle2) {
	    this.makeAnnouncement(this.cycle1);
	  }
	};
	Game.prototype.clearPlayingArea = function (ctx) {
	  ctx.clearRect(0, 0, Constants.DIM_X, Constants.DIM_Y);
	  ctx.fillStyle = Constants.BG_COLOR;
	  ctx.fillRect(0, 0, Constants.DIM_X, Constants.DIM_Y);
	};
	
	Game.prototype.cycles = function () {
	  return [this.cycle1, this.cycle2];
	};
	
	Game.prototype.draw = function(ctx) {
	  CanvasUtil.clearPlayingArea(ctx);
	  this.cycles().forEach(function (cycle) { cycle.draw(ctx); });
	  CanvasUtil.drawTrails(ctx, this.trails);
	};
	
	Game.prototype.makeAnnouncement = function (cycle) {
	  this.announcement = {
	    announcement: cycle['name'] + ' wins!',
	    color: cycle.color
	  };
	};
	
	Game.prototype.moveCycles = function () {
	  this.cycles().forEach(function (cycle) {
	    this.trails[cycle.pos.toString()] = {
	      color: cycle.color,
	      pos: cycle.pos
	    };
	    cycle.move();
	    this.newMoves.shift();
	    this.newMoves.push(cycle.pos);
	  }.bind(this));
	};
	
	Game.prototype.step = function () {
	  this.moveCycles();
	  this.checkCollisions();
	};
	
	Game.prototype.terminate = function () {
	  this.cycles().forEach(function (cycle) {
	    cycle.unbindKeyHandlers();
	  });
	};
	
	Game.prototype.unbindKeyHandlers = function () {
	  this.cycles().forEach(function (cycle) {
	    cycle.unbindKeyHandlers();
	  });
	};
	
	module.exports = Game;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var ComputerUtil = __webpack_require__(8),
	    Constants = __webpack_require__(3),
	    CycleUtil = __webpack_require__(9),
	    Queue = __webpack_require__(10);
	
	var Computer = function (opponent, trails, newMoves) {
	  this.color = '#00ff0a';
	  this.direction = [-1, 0];
	  this.name = 'Computer';
	  this.newMoves = newMoves;
	  this.opponent = opponent;
	  this.pos = [44, 15];
	  this.trails = trails;
	};
	
	Computer.prototype.bestMove = function () {
	  var bounds = this.bounds();
	  var goodMoves = this.goodMoves();
	  if (Object.keys(goodMoves) === 0) { return false; }
	  var bestMove = {realEstate: 0};
	  Object.keys(goodMoves).forEach(function (posKey) {
	    var move = goodMoves[posKey];
	    move.realEstate = this.relativeRealEstate(move, bounds);
	    if (move.realEstate > bestMove.realEstate) {
	      bestMove = move;
	    }
	  }.bind(this));
	
	  return bestMove.realEstate > 0 ? bestMove : false;
	};
	
	Computer.prototype.bounds = function () {
	  if (this.allBounds) {
	    this.newMoves.forEach(function (pos) {
	      this.allBounds[pos.toString()] = true;
	    }.bind(this));
	  } else {
	    var positions = Object.keys(this.trails)
	    .concat(this.opponent.pos.toString(), this.pos.toString());
	
	    var allBounds = {};
	    positions.forEach(function (pos) {
	      allBounds[pos.toString()] = true;
	    });
	    Object.assign(allBounds, ComputerUtil.boxBounds());
	    this.allBounds = allBounds;
	  }
	  return this.allBounds;
	};
	
	Computer.prototype.draw = function (ctx) {
	  var x = this.pos[0] * 10,
	      y = this.pos[1] * 10;
	
	  ctx.fillStyle = this.color;
	  ctx.fillRect(x, y, Constants.CYCLE_HEIGHT, Constants.CYCLE_WIDTH);
	};
	
	Computer.prototype.goodMoves = function () {
	  var legalMoves = this.legalMoves();
	  var goodMoves = {};
	  Object.keys(legalMoves).forEach(function (posKey) {
	    var pos = legalMoves[posKey].pos;
	    if (!CycleUtil.isOutOfBounds(pos) &&
	        !this.trails[pos.toString()]) {
	        goodMoves[posKey] = legalMoves[posKey];
	      }
	    }.bind(this));
	
	    return goodMoves;
	  };
	
	Computer.prototype.isAboutToCollide = function () {
	  return ComputerUtil.isAboutToCollide(this.pos, this.direction, this.trails);
	};
	
	Computer.prototype.isCollidedWith = function (object) {
	  return CycleUtil.isCollision(this.pos, object.pos);
	};
	
	Computer.prototype.move = function () {
	  var bestMove = this.bestMove();
	  if (bestMove) { this.direction = bestMove.dir; }
	  this.pos = [this.pos[0] + this.direction[0], this.pos[1] + this.direction[1]];
	};
	
	Computer.prototype.legalMoves = function () {
	  var dirs = ComputerUtil.legalDirs(this.direction);
	  var dirKeys = dirs.map(function (dir) { return dir.toString(); });
	
	  var legalMoves = {};
	
	  [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (dir) {
	    if (dirKeys.includes(dir.toString())) {
	      legalMoves[dir.toString()] = {
	        dir: dir,
	        pos: [this.pos[0] + dir[0], this.pos[1] + dir[1]]
	      };
	    }
	  }.bind(this));
	
	  return legalMoves;
	};
	
	Computer.prototype.relativeRealEstate = function (move, bounds) {
	  var pos = move.pos;
	  var checkedMoves = { length: 0 };
	  checkedMoves[this.pos.toString()] = true;
	  var movesQueue = new Queue(pos);
	  var perps;
	  if (Math.abs(move.dir[0]) === 1) {
	    perps = [[0, 1], [0, -1]];
	  } else if (Math.abs(move.dir[1]) === 1) {
	    perps = [[1, 0], [-1, 0]];
	  }
	
	  perps.forEach(function (perpendicular) {
	    var boundary = null;
	    var perpPos = [move.pos[0], move.pos[1]];
	
	    while (boundary === null) {
	      perpPos[0] += perpendicular[0];
	      perpPos[1] += perpendicular[1];
	      if (bounds[perpPos.toString()]) {
	        boundary = perpPos;
	      } else {
	        checkedMoves[perpPos.toString()] = true;
	        checkedMoves.length += 1;
	      }
	    }
	  });
	
	  while (movesQueue.length > 0 && checkedMoves.length < 500 ) {
	    pos = movesQueue.dequeue();
	    var deltaPositions = ComputerUtil.deltas(pos);
	    deltaPositions.forEach(function (deltaPos) {
	      var str = deltaPos.toString();
	      if (!checkedMoves[str] && !bounds[str]) {
	        movesQueue.enqueue(deltaPos);
	        checkedMoves[str] = true;
	        checkedMoves.length += 1;
	      }
	    });
	  }
	
	  return checkedMoves.length;
	};
	
	Computer.prototype.unbindKeyHandlers = function () {};
	
	module.exports = Computer;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Constants = __webpack_require__(3);
	
	var ComputerUtil = {
	  boxBounds: function () {
	    var bounds = {};
	    var x = -1, y = -1;
	
	    while (x <= (Constants.DIM_X / 10)) {
	      bounds[[x, y].toString()] = true;
	      x += 1;
	    }
	
	    y += 1;
	    x -= 1;
	    while (y <= (Constants.DIM_Y / 10)) {
	      bounds[[x, y].toString()] = true;
	      y += 1;
	    }
	
	    x -= 1;
	    y -= 1;
	    while (x >= 0) {
	      bounds[[x, y].toString()] = true;
	      x -= 1;
	    }
	
	    y -= 1;
	    x += 1;
	    while (y >= 0) {
	      bounds[[x, y].toString()] = true;
	      y -= 1;
	    }
	    return bounds;
	  },
	  deltas: function (pos) {
	    return [
	      [pos[0] + 1, pos[1]],
	      [pos[0] - 1, pos[1]],
	      [pos[0], pos[1] + 1],
	      [pos[0], pos[1] - 1]
	    ];
	  },
	  legalDirs: function (dir) {
	    if (dir.toString() === '1,0') {
	      return [[1, 0], [0, 1], [0, -1]];
	    } else if (dir.toString() === '-1,0') {
	      return [[-1, 0], [0, 1], [0, -1]];
	    } else if (dir.toString() === '0,1') {
	      return [[1, 0], [-1, 0], [0, 1]];
	    } else if (dir.toString() === '0,-1') {
	      return [[1, 0], [-1, 0], [0, -1]];
	    }
	  },
	  isAboutToCollide: function (pos, direction, trails) {
	    return pos[0] === 0 && direction[0] === -1 ||
	      pos[0] === Constants.DIM_X / 10 - 1 && direction[0] === 1 ||
	      pos[1] === 0 && direction[1] === -1 ||
	      pos[1] === Constants.DIM_Y / 10 - 1 && direction[1] === 1 ||
	      this.trailAhead(this.posAhead(pos, direction), trails);
	  },
	  posAhead: function (pos, direction) {
	    return [pos[0] + direction[0], pos[1] + direction[1]];
	  },
	  trailAhead: function (pos, trails) {
	    return trails.hasOwnProperty(pos.toString());
	  }
	};
	
	module.exports = ComputerUtil;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Constants = __webpack_require__(3);
	
	var CycleUtil = {
	  illegalDirs: function (dir) {
	    if (Math.abs(dir[0]) === 1) {
	      return ['1,0', '-1,0'];
	    } else {
	      return ['0,1', '0,-1'];
	    }
	  },
	  isCollision: function (pos1, pos2) {
	    return ((pos1[0] === pos2[0]) && (pos1[1] === pos2[1]));
	  },
	  isOutOfBounds: function (pos) {
	    return pos[0] * 10 >= Constants.DIM_X ||
	      pos[1] * 10 >= Constants.DIM_Y ||
	      pos[0] < 0 ||
	      pos[1] < 0;
	  }
	};
	
	module.exports = CycleUtil;


/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	function Queue (el) {
	  this.in = [];
	  this.out = [];
	  if (el) { this.in.push(el) }
	  this.length = this.in.length;
	}
	
	Queue.prototype.enqueue = function (el) {
	  this.in.push(el);
	  this.length += 1;
	};
	
	Queue.prototype.dequeue = function () {
	  if (this.out.length === 0) {
	    while (this.in.length > 0) {
	      this.out.push(this.in.pop());
	    }
	  }
	  if (this.out[0]) { this.length -= 1 }
	  return this.out.pop();
	}
	
	module.exports = Queue;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var Constants = __webpack_require__(3),
	    CycleUtil = __webpack_require__(9);
	
	var Cycle = function (opts) {
	  this.pos = opts.pos;
	  this.color = opts.color;
	  this.direction = opts.direction;
	  this.illegalDirs = CycleUtil.illegalDirs(opts.direction);
	  this.keys = opts.keys;
	  this.keysPressed = [];
	  this.name = opts.name;
	  this.bindKeyHandlers();
	};
	
	Cycle.prototype.bindKeyHandlers = function (keys) {
	  this.keyListener = function (e) {
	    if (['ArrowUp', 'ArrowDown'].includes(e.code)) { e.preventDefault(); }
	    switch (e.code) {
	      case this.keys.up:
	        this.requestTurn([0, -1], '0,-1');
	        break;
	      case this.keys.down:
	        this.requestTurn([0, 1], '0,1');
	        break;
	      case this.keys.left:
	        this.requestTurn([-1, 0], '-1,0');
	        break;
	      case this.keys.right:
	        this.requestTurn([1, 0], '1,0');
	        break;
	    }
	  }.bind(this);
	
	  document.addEventListener('keydown', this.keyListener);
	};
	
	Cycle.prototype.draw = function (ctx) {
	  var x = this.pos[0] * 10,
	      y = this.pos[1] * 10;
	
	  ctx.fillStyle = this.color;
	  ctx.fillRect(x, y, Constants.CYCLE_HEIGHT, Constants.CYCLE_WIDTH);
	};
	
	Cycle.prototype.isCollidedWith = function (object) {
	  return CycleUtil.isCollision(this.pos, object.pos);
	};
	
	Cycle.prototype.move = function () {
	  this.pos = [this.pos[0] + this.direction[0], this.pos[1] + this.direction[1]];
	  this.illegalDirs = CycleUtil.illegalDirs(this.direction);
	};
	
	Cycle.prototype.requestTurn = function (dir, dirStr) {
	  if (!this.illegalDirs.includes(dir.toString())) { this.direction = dir; }
	};
	
	Cycle.prototype.unbindKeyHandlers = function () {
	  document.removeEventListener('keydown', this.keyListener);
	};
	
	module.exports = Cycle;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map