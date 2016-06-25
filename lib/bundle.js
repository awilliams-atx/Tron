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
	  this.state = 'menu';
	  this.initialize();
	  this.run();
	};
	
	GameView.prototype.addEventListeners = function () {
	  document.addEventListener('keydown', this.listeners['gameState']);
	  DOM.newGameButton.el.addEventListener('click', this.listeners.newGameButton);
	  DOM.instructionsButton.el
	    .addEventListener('click', this.listeners.instructions);
	  DOM.instructionsBack.el
	    .addEventListener('click', this.listeners.instructionsBack);
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
	            this.newGame();
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
	      DOMUtil.fadeToBlack(function () {
	        DOMUtil.undisplay(DOM.outerMenu);
	        this.newGame();
	      }.bind(this), 200);
	    }.bind(this)
	  };
	};
	
	GameView.prototype.newGame = function () {
	  if (this.game) { this.game.terminate(); }
	  this.state = 'playing';
	  this.game = new Game();
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
	        }.bind(this), 1);
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
	  outerMenu: {
	    el: document.getElementById('tron-outer-menu'),
	    display: 'block',
	    undisplay: 'none'
	  }
	}
	
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
	  display: function (domEl, timeout, callback) {
	    timeout = timeout || 0;
	    setTimeout(function () {
	      domEl.el.style.display = domEl.display;
	      callback && callback();
	    }.bind(this), timeout);
	  },
	  fadeIn: function (timeout, callback) {
	    var screenFader = document.getElementById('tron-screen-fader');
	    setTimeout(function () {
	      callback && callback();
	    }.bind(this), timeout);
	    setTimeout(function () {
	      screenFader.setAttribute('class', 'fade-in');
	    }.bind(this), timeout + 100);
	    setTimeout(function () {
	      screenFader.setAttribute('class', 'nowhere');
	    }.bind(this), timeout + 350);
	  },
	  fadeToBlack: function (callback, timeout) {
	    timeout = timeout || 250;
	    this.isInTransition = true;
	    var screenFader = document.getElementById('tron-screen-fader');
	    screenFader.setAttribute('class', 'transparent-block')
	    setTimeout(function () {
	      screenFader.setAttribute('class', 'fade-out');
	    }, timeout + 1);
	    setTimeout(function () {
	      screenFader.setAttribute('class', 'fade-in');
	    }, timeout + 200);
	    setTimeout(function () {
	      callback && callback();
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
	    }, timeout)
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
	      }, 200)
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
	    Constants = __webpack_require__(3),
	    Cycle = __webpack_require__(7);
	
	var Game = function (opts) {
	  this.addCycles();
	  this.announcement = {};
	  this.isGameOver = false;
	  this.trails = [];
	  this.DIM_X = Game.DIM_X;
	  this.DIM_Y = Game.DIM_Y;
	  this.BG_COLOR = Game.BG_COLOR;
	};
	
	Game.prototype.addCycles = function () {
	  var cycleOpts = {
	    pos: [5, 15],
	    direction: [1, 0],
	    color: Constants.YELLOW_HEAD,
	    name: 'Player 1',
	    keys: { up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD' }
	  };
	
	  this.cycle1 = new Cycle(cycleOpts);
	
	  var cycleOpts = {
	    pos: [45, 15],
	    direction: [-1, 0],
	    color: Constants.PINK_HEAD,
	    name: 'Player 2',
	    keys: { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' }
	  };
	
	  this.cycle2 = new Cycle(cycleOpts);
	};
	
	Game.prototype.checkCollisions = function () {
	  this.checkBorderCollisions();
	  this.checkCycleCollisions();
	  this.checkTrailCollisions();
	};
	
	Game.prototype.checkBorderCollisions = function () {
	  if (this.isOutOfBounds(this.cycle1) && this.isOutOfBounds(this.cycle2)) {
	    this.isGameOver = true;
	    this.announcement['announcement'] = 'Draw!';
	  } else if (this.isOutOfBounds(this.cycle1)) {
	    this.isGameOver = true;
	    this.makeAnnouncement(this.cycle2);
	  } else if (this.isOutOfBounds(this.cycle2)) {
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
	  var collidedCycles = [];
	
	  this.trails.forEach(function (trail) {
	    if (
	      trail.pos[0] === this.cycle1.pos[0] &&
	      trail.pos[1] === this.cycle1.pos[1]
	    ) {
	      this.isGameOver = true;
	      collidedCycles.push(this.cycle1);
	    } else if (
	      trail.pos[0] === this.cycle2.pos[0] &&
	      trail.pos[1] === this.cycle2.pos[1]
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
	  this.drawTrails(ctx);
	};
	
	Game.prototype.drawTrails = function (ctx) {
	  this.trails.forEach(function (trail) {
	    var x = (trail.pos[0] * 10) + 1,
	        y = (trail.pos[1] * 10) + 1;
	    ctx.fillStyle = trail.color;
	    ctx.fillRect(x, y, 8, 8);
	  });
	};
	
	Game.prototype.isOutOfBounds = function (cycle) {
	  return cycle.pos[0] * 10 > Constants.DIM_X ||
	    cycle.pos[1] * 10 > Constants.DIM_Y ||
	    cycle.pos[0] < 0 ||
	    cycle.pos[1] < 0;
	};
	
	Game.prototype.makeAnnouncement = function (cycle) {
	  this.announcement = {
	    announcement: cycle['name'] + ' wins!',
	    color: cycle.color
	  };
	};
	
	Game.prototype.moveCycles = function () {
	  this.cycles().forEach(function (cycle) {
	    var trailPos = cycle.pos;
	    cycle.move();
	    this.trails.push({
	      pos: trailPos,
	      color: cycle.color
	    });
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

	var Constants = __webpack_require__(3),
	    CycleUtil = __webpack_require__(8);
	
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


/***/ },
/* 8 */
/***/ function(module, exports) {

	var CycleUtil = {
	  illegalDirs: function (dir) {
	    if (Math.abs(dir[0]) === 1) {
	      return ['1,0', '-1,0'];
	    } else {
	      return ['0,1', '0,-1'];
	    }
	  },
	  isCollision: function (pos1, pos2) {
	    return (pos1[0] === pos2[0]) && (pos1[1] === pos2[1])
	  }
	};
	
	module.exports = CycleUtil;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map