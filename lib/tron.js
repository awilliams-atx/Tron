var GameView = require('./gameView');

document.addEventListener('DOMContentLoaded', function () {
  var canvasEl = document.getElementById('tron-canvas');
  new GameView(canvasEl);
});
