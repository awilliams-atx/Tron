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
