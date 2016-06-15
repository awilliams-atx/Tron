var GameStarter = require('./gameStarter');


document.addEventListener('DOMContentLoaded', function () {
  var canvasEl = document.getElementById('tron-canvas');

  new GameStarter(canvasEl);
});
