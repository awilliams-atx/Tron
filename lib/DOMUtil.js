var DOMUtil = {
  clearMenuAnnouncement: function () {
    var announcement = document.getElementById('tron-menu-announcement');
    announcement.removeAttribute('class');
    announcement.innerHTML = '';
  },
  clearMenuInstructions: function () {
    var instructionsButton = document.getElementById('tron-menu-instructions');
    instructionsButton.innerHTML = '';
    instructionsButton.removeAttribute('class');
  },
  clearMenuNewGame: function () {
    var newGameButton = document.getElementById('tron-menu-new-game');
    newGameButton.innerHTML = '';
    newGameButton.removeAttribute('class');
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
  fadeToBlack: function (callback) {
    this.isInTransition = true;
    var screenFader = document.getElementById('tron-screen-fader');
    setTimeout(function () {
      callback && callback();
    }, 250);
    screenFader.setAttribute('class', 'nowhere');
    setTimeout(function () {
      screenFader.setAttribute('class', 'transparent-block')
    }.bind(this), 10);
    setTimeout(function () {
      screenFader.setAttribute('class', 'fade-out');
    }, 20);
    setTimeout(function () {
      screenFader.setAttribute('class', 'fade-in');
    }, 250);
    setTimeout(function () {
      screenFader.setAttribute('class', 'nowhere');
      this.isInTransition = false;
    }.bind(this), 500);
  },
  flyIn: function(domEl, timeout) {
    timeout = timeout || 0;
    setTimeout(function () {
      domEl.el.setAttribute('class', domEl.flyInKlass);
    }, timeout);
  },
  flyOut: function (domEl) {
    domEl.el.setAttribute('class', domEl.flyOutKlass);
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
    }.bind(this), timeout);
  }
};

module.exports = DOMUtil;
