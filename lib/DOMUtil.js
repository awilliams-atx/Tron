var DOMUtil = {
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
  }
};

module.exports = DOMUtil;
