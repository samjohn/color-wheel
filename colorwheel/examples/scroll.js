var colors = [0, 80, 80];
var colorSteps = [['H'],['S'],['B']];
var colorStep = 0;
var colors = colorWheel(colors, 360, 250);
colors.setCycle(colorSteps[0]);

var directionChanged = function (e) {
  var delta = e.detail ? e.detail : e.wheelDelta;
  var sign = delta && delta / Math.abs(delta);
  if (colors.getCurrentSpinnerDirection() * sign == -1) {
    return true;
  }
  return false;
}

var scroll = function (e) {
  e.preventDefault();
  if (e.target.id === "scroll") {
    if (directionChanged(e)) {
      colors.toggleStep();
    };
    colors.step();
    e.target.style.backgroundColor = colors.toString();
    console.log(colors.toString());
    // document.getElementsByTagName("p")[0].innerHTML = colors.toHex();
  }
}

var changeColors = function (e) {
  colors.setCycle(colorSteps[colorStep]);
  colorStep = (colorStep + 1) % colorSteps.length;
}

var load = function () {
  var scroll = document.getElementById("scroll");
  scroll.addEventListener('click', changeColors, false);
}

window.addEventListener('mousewheel', scroll, false);
window.addEventListener('load', load, false);
