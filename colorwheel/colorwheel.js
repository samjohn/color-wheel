var colorWheel = function(basecolors, delt, increment) {
  var BASECOLOR_H = basecolors[0] || 0;
  var BASECOLOR_S = basecolors[1] || 0;
  var BASECOLOR_B = basecolors[2] || 0;

  var bounded = function (colorvalue) {
    return colorvalue % 255;
  };
  var bounded_h = function(h_value) {
    return h_value % 361;
  }
  var bounded_s = function(s_value) {
    return s_value % 100;
  }
  var bounded_b = function(v_value) {
    return v_value % 100;
  }
  var delta_h = bounded_h(delt);
  var delta_s = bounded_s(delt);
  var delta_b = bounded_b(delt);
  var inc = increment || 10;
  var cycleDef = ['S', 'H', 'B', 'H'];
  var cycleCount = 0;
  var stepFinished = false;

  var BASECOLOR = [BASECOLOR_H, BASECOLOR_S, BASECOLOR_B];

  var slide_h = function (amount) {
    // what is the base 'h' value?
    BASECOLOR[0] = bounded(BASECOLOR_H + Math.floor(delta_h * amount));
    return BASECOLOR;
  };
  var slide_s = function (amount) {
    BASECOLOR[1] = bounded(BASECOLOR_S + Math.floor(delta_s * amount));
    return BASECOLOR;
  };
  var slide_b = function (amount) {
    BASECOLOR[2] = bounded(BASECOLOR_B + Math.floor(delta_b * amount));
    return BASECOLOR;
  };

  var spin = function(inc) {
    var increment = inc;
    var counter = 1;
    var up = 1;
    var finished = false;
    var checkCounter = function () {
      if (counter <= 0 || counter > increment) {
        finished = true;
        counter = counter > increment ? increment : 0;
      }
    };
    var moveCounter = function () {
      if (up == 1) {
        counter += 1;
      } else {
        counter += -1;
      }
    };
    return {
      up : function () {
        var factor = (Math.PI /2 ) * (counter / increment);
        moveCounter();
        checkCounter();
        return Math.sin(factor);
      },
      down: function () {
        var factor = (Math.PI * counter) / (increment * 2);
        moveCounter();
        checkCounter();
        return Math.cos(factor);
      },
      finished: function () {
        return finished;
      },
      reset : function () {
        finished = !finished;
        counter = 1;
      },
      toggleDirection : function () {
        up = up * -1;
      },
      getDirection : function () {
        return up;
      }
    }
  };
  var bounded = function (colorvalue) {
    return colorvalue % 255;
  };
  var bounded_h = function(h_value) {
    return h_value % 360;
  }
  var bounded_s = function(s_value) {
    return s_value % 100;
  }
  var bounded_b = function(v_value) {
    return v_value % 100;
  }
  var slider = function (inc) {
    var up = true;
    var spinner = spin(inc);
    var getValue = function () {
      return nextval = up ? spinner.up() : spinner.down();
    }
    return {
      nextLoop: function () {
        var nextval = getValue();
        if (spinner.finished()) {
          spinner.reset();
          stepFinished = true;
          up = !up;
        }
        return nextval;
      },
      nextStep: function () {
        return getValue();
      },
      toggle : function() {
        up = !up;
      },
      toggleSpinner : function () {
        spinner.toggleDirection();
      },
      getSpinnerDirection : function () {
        return spinner.getDirection();
      }
    }
  };
  var spinner_h = slider(inc);
  var spinner_s = slider(inc);
  var spinner_b = slider(inc);
  var setSpinners = function (inc) {
    spinner_h = slider(inc);
    spinner_s = slider(inc);
    spinner_b = slider(inc);
  };
  var setDeltas = function (startColor, endColor) {
    delta_h = endColor[0] - startColor[0];
    delta_s = endColor[1] - startColor[1];
    delta_b = endColor[2] - startColor[2];
  };

  setSpinners(inc);
  return {
    getBase : function () {
      return BASECOLOR;
    },
    h : function () {
      return BASECOLOR[0];
    },
    s : function () {
      return BASECOLOR[1];
    },
    b : function () {
      return BASECOLOR[2];
    },
    toString : function () {
      return "hsl(" + BASECOLOR[0] + "," + BASECOLOR[1] + "%," + BASECOLOR[2] + "%)";
    },
    toHex : function () {
      var r = this.r().toString(16);
      var g = this.g().toString(16);
      var b = this.b().toString(16);
      if (r.length < 2) r = "0" + r;
      if (g.length < 2) g = "0" + g;
      if (b.length < 2) b = "0" + b;
      return "#" + r + g + b;
    },
    setBase : function (array) {
      BASECOLOR_H = array[0];
      BASECOLOR_S = array[1];
      BASECOLOR_B = array[2];
      for (var i = 0; i < BASECOLOR.length; i++) {
        BASECOLOR[i] = array[i];
      }
      return this;
    },
    setCycle : function (array) {
      cycleDef = array;
      return this;
    },
    cycle : function () {
      if (stepFinished) {
        stepFinished = false;
        cycleCount = (cycleCount + 1) % cycleDef.length;
      }
      switch (cycleDef[cycleCount]) {
        case 'H': slide_h(spinner_h.nextLoop()); break;
        case 'S': slide_s(spinner_s.nextLoop()); break;
        case 'B': slide_b(spinner_b.nextLoop()); break;
      }
    },
    step : function () {
      switch (cycleDef[cycleCount]) {
        case 'H': slide_h(spinner_h.nextStep()); break;
        case 'S': slide_s(spinner_s.nextStep()); break;
        case 'B': slide_b(spinner_b.nextStep()); break;
      }
    },
    toggleStep : function () {
      switch (cycleDef[cycleCount]) {
        case 'H': spinner_h.toggleSpinner(); break;
        case 'S': spinner_s.toggleSpinner(); break;
        case 'B': spinner_b.toggleSpinner(); break;
      }
    },
    nextInCycle : function () {
      cycleCount = (cycleCount + 1) % cycleDef.length;
    },
    cycleConcurrent: function () {
      slide_h(spinner_h.nextLoop());
      slide_s(spinner_s.nextLoop());
      slide_b(spinner_b.nextLoop());
    },
    stepConcurrent: function () {
      slide_h(spinner_h.nextStep());
      slide_s(spinner_s.nextStep());
      slide_b(spinner_b.nextStep());
    },
    setTransform : function (startcolor, endcolor, increment) {
      setSpinners(increment);
      this.setBase(startcolor);
      setDeltas(startcolor, endcolor);
    },
    getCurrentSpinnerDirection : function () {
      return this.getSpinnerDirection(cycleDef[cycleCount]);
    },
    getSpinnerDirection : function (color) {
      var direction;
      switch (color) {
        case 'H': direction = spinner_h.getSpinnerDirection(); break;
        case 'S': direction = spinner_s.getSpinnerDirection(); break;
        case 'B': direction = spinner_b.getSpinnerDirection(); break;
      }
      return direction;
    }
  }
};

