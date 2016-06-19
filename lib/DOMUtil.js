var DOMUtil = {
  clearInstructions: function () {
    document.getElementById('tron-instructions').style.display = 'none';
  },
  clearMenuAnnouncement: function () {
    var announcement = document.getElementById('tron-menu-winner');
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
  clearOuterMenu: function () {
    DOMUtil.clearMenuAnnouncement();
    DOMUtil.clearMenuInstructions();
    DOMUtil.clearMenuNewGame();
    document.getElementById('tron-outer-menu').style.display = 'none';
  },
  fadeToBlack: function (callback) {
    var screenFader = document.getElementById('screen-fader');
    setTimeout(function () {
      callback && callback();
    }, 1000);
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
  },
  menuBackground: function (backgroundCycle) {
    document.getElementById('tron-menu-background')
      .setAttribute(
        'src',
        './assets/images/tron_background_' + backgroundCycle + '.gif'
      );
  }
};

module.exports = DOMUtil;
