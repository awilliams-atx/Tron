var Constants = require('../constants');

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
        }.bind(this), 1);
      }
    }
  }
};

module.exports = CanvasUtil;
