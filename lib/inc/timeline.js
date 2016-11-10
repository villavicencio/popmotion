'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = timeline;

var _Tween = require('../actions/Tween');

var _Tween2 = _interopRequireDefault(_Tween);

var _presetEasing = require('../actions/easing/preset-easing');

var _presetEasing2 = _interopRequireDefault(_presetEasing);

var _calc = require('./calc');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  @param [array]
    Sequential array of tweens, each item can be a tween or definition obj:

    [
      new Tween(),
      stagger(),
      timeline(),
      {
        tween: new Tween(),
        at: 100,
        offset: "+=100"
      }
    ]
*/
var analyze = function (defs) {
  var timeline = [];
  var numDefs = defs.length;
  var currentPlayhead = 0;

  var _loop = function (i) {
    var def = defs[i];
    var defIsObj = def.tween ? true : false;
    var tween = defIsObj ? def.tween : def;

    if (defIsObj) {
      if (def.offset !== undefined) {
        currentPlayhead = (0, _calc.relativeValue)(currentPlayhead, def.offset);
      } else if (def.at !== undefined) {
        currentPlayhead = def.at;
      }
    }

    var duration = 0;
    for (var key in tween.values) {
      if (tween.values.hasOwnProperty(key)) {
        var value = tween.values[key];
        duration = Math.max(duration, value.duration);
      }
    }

    timeline.push({
      from: currentPlayhead,
      duration: duration,
      fire: function (time) {
        return tween.seekTime(time);
      }
    });

    currentPlayhead += duration;
  };

  for (var i = 0; i < numDefs; i++) {
    _loop(i);
  }

  return { totalTime: currentPlayhead, timeline: timeline };
};

var setTweens = function (_ref) {
  var timeline = _ref.timeline,
      timelineLength = _ref.timelineLength,
      values = _ref.values,
      duration = _ref.duration;

  for (var i = 0; i < timelineLength; i++) {
    var _tween = timeline[i];
    var tweenTime = values.p.current * duration - _tween.from;

    if (tweenTime >= -50 && tweenTime <= _tween.duration + 50) {
      _tween.fire(tweenTime);
    }
  }
};

function timeline(def) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _analyze = analyze(def),
      totalTime = _analyze.totalTime,
      timeline = _analyze.timeline;

  return new _Tween2.default(_extends({
    ease: _presetEasing2.default.linear
  }, props, {
    duration: totalTime,
    values: {
      p: { from: 0, to: 1 }
    },
    timeline: timeline,
    timelineLength: timeline.length,
    onRender: setTweens
  }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmMvdGltZWxpbmUuanMiXSwibmFtZXMiOlsidGltZWxpbmUiLCJhbmFseXplIiwiZGVmcyIsIm51bURlZnMiLCJsZW5ndGgiLCJjdXJyZW50UGxheWhlYWQiLCJpIiwiZGVmIiwiZGVmSXNPYmoiLCJ0d2VlbiIsIm9mZnNldCIsInVuZGVmaW5lZCIsImF0IiwiZHVyYXRpb24iLCJrZXkiLCJ2YWx1ZXMiLCJoYXNPd25Qcm9wZXJ0eSIsInZhbHVlIiwiTWF0aCIsIm1heCIsInB1c2giLCJmcm9tIiwiZmlyZSIsInRpbWUiLCJzZWVrVGltZSIsInRvdGFsVGltZSIsInNldFR3ZWVucyIsInRpbWVsaW5lTGVuZ3RoIiwidHdlZW5UaW1lIiwicCIsImN1cnJlbnQiLCJwcm9wcyIsImVhc2UiLCJsaW5lYXIiLCJ0byIsIm9uUmVuZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7a0JBb0V3QkEsUTs7QUFwRXhCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7QUFlQSxJQUFNQyxVQUFVLFVBQUNDLElBQUQsRUFBVTtBQUN4QixNQUFNRixXQUFXLEVBQWpCO0FBQ0EsTUFBTUcsVUFBVUQsS0FBS0UsTUFBckI7QUFDQSxNQUFJQyxrQkFBa0IsQ0FBdEI7O0FBSHdCLHdCQUtmQyxDQUxlO0FBTXRCLFFBQU1DLE1BQU1MLEtBQUtJLENBQUwsQ0FBWjtBQUNBLFFBQU1FLFdBQVdELElBQUlFLEtBQUosR0FBWSxJQUFaLEdBQW1CLEtBQXBDO0FBQ0EsUUFBTUEsUUFBU0QsUUFBRCxHQUFhRCxJQUFJRSxLQUFqQixHQUF5QkYsR0FBdkM7O0FBRUEsUUFBSUMsUUFBSixFQUFjO0FBQ1osVUFBSUQsSUFBSUcsTUFBSixLQUFlQyxTQUFuQixFQUE4QjtBQUM1Qk4sMEJBQWtCLHlCQUFjQSxlQUFkLEVBQStCRSxJQUFJRyxNQUFuQyxDQUFsQjtBQUNELE9BRkQsTUFFTyxJQUFJSCxJQUFJSyxFQUFKLEtBQVdELFNBQWYsRUFBMEI7QUFDL0JOLDBCQUFrQkUsSUFBSUssRUFBdEI7QUFDRDtBQUNGOztBQUVELFFBQUlDLFdBQVcsQ0FBZjtBQUNBLFNBQUssSUFBSUMsR0FBVCxJQUFnQkwsTUFBTU0sTUFBdEIsRUFBOEI7QUFDNUIsVUFBSU4sTUFBTU0sTUFBTixDQUFhQyxjQUFiLENBQTRCRixHQUE1QixDQUFKLEVBQXNDO0FBQ3BDLFlBQU1HLFFBQVFSLE1BQU1NLE1BQU4sQ0FBYUQsR0FBYixDQUFkO0FBQ0FELG1CQUFXSyxLQUFLQyxHQUFMLENBQVNOLFFBQVQsRUFBbUJJLE1BQU1KLFFBQXpCLENBQVg7QUFDRDtBQUNGOztBQUVEYixhQUFTb0IsSUFBVCxDQUFjO0FBQ1pDLFlBQU1oQixlQURNO0FBRVpRLGdCQUFVQSxRQUZFO0FBR1pTLFlBQU0sVUFBQ0MsSUFBRDtBQUFBLGVBQVVkLE1BQU1lLFFBQU4sQ0FBZUQsSUFBZixDQUFWO0FBQUE7QUFITSxLQUFkOztBQU1BbEIsdUJBQW1CUSxRQUFuQjtBQWhDc0I7O0FBS3hCLE9BQUssSUFBSVAsSUFBSSxDQUFiLEVBQWdCQSxJQUFJSCxPQUFwQixFQUE2QkcsR0FBN0IsRUFBa0M7QUFBQSxVQUF6QkEsQ0FBeUI7QUE0QmpDOztBQUVELFNBQU8sRUFBRW1CLFdBQVdwQixlQUFiLEVBQThCTCxrQkFBOUIsRUFBUDtBQUNELENBcENEOztBQXNDQSxJQUFNMEIsWUFBWSxnQkFBb0Q7QUFBQSxNQUFqRDFCLFFBQWlELFFBQWpEQSxRQUFpRDtBQUFBLE1BQXZDMkIsY0FBdUMsUUFBdkNBLGNBQXVDO0FBQUEsTUFBdkJaLE1BQXVCLFFBQXZCQSxNQUF1QjtBQUFBLE1BQWZGLFFBQWUsUUFBZkEsUUFBZTs7QUFDcEUsT0FBSyxJQUFJUCxJQUFJLENBQWIsRUFBZ0JBLElBQUlxQixjQUFwQixFQUFvQ3JCLEdBQXBDLEVBQXlDO0FBQ3ZDLFFBQU1HLFNBQVFULFNBQVNNLENBQVQsQ0FBZDtBQUNBLFFBQU1zQixZQUFhYixPQUFPYyxDQUFQLENBQVNDLE9BQVQsR0FBbUJqQixRQUFwQixHQUFnQ0osT0FBTVksSUFBeEQ7O0FBRUEsUUFBSU8sYUFBYSxDQUFDLEVBQWQsSUFBb0JBLGFBQWFuQixPQUFNSSxRQUFOLEdBQWlCLEVBQXRELEVBQTBEO0FBQ3hESixhQUFNYSxJQUFOLENBQVdNLFNBQVg7QUFDRDtBQUNGO0FBQ0YsQ0FURDs7QUFXZSxTQUFTNUIsUUFBVCxDQUFrQk8sR0FBbEIsRUFBbUM7QUFBQSxNQUFad0IsS0FBWSx1RUFBSixFQUFJOztBQUFBLGlCQUNoQjlCLFFBQVFNLEdBQVIsQ0FEZ0I7QUFBQSxNQUN4Q2tCLFNBRHdDLFlBQ3hDQSxTQUR3QztBQUFBLE1BQzdCekIsUUFENkIsWUFDN0JBLFFBRDZCOztBQUdoRCxTQUFPO0FBQ0xnQyxVQUFNLHVCQUFPQztBQURSLEtBRUZGLEtBRkU7QUFHTGxCLGNBQVVZLFNBSEw7QUFJTFYsWUFBUTtBQUNOYyxTQUFHLEVBQUVSLE1BQU0sQ0FBUixFQUFXYSxJQUFJLENBQWY7QUFERyxLQUpIO0FBT0xsQyxjQUFVQSxRQVBMO0FBUUwyQixvQkFBZ0IzQixTQUFTSSxNQVJwQjtBQVNMK0IsY0FBVVQ7QUFUTCxLQUFQO0FBV0QiLCJmaWxlIjoidGltZWxpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVHdlZW4gZnJvbSAnLi4vYWN0aW9ucy9Ud2Vlbic7XG5pbXBvcnQgZWFzaW5nIGZyb20gJy4uL2FjdGlvbnMvZWFzaW5nL3ByZXNldC1lYXNpbmcnO1xuaW1wb3J0IHsgcmVsYXRpdmVWYWx1ZSB9IGZyb20gJy4vY2FsYyc7XG5cbi8qXG4gIEBwYXJhbSBbYXJyYXldXG4gICAgU2VxdWVudGlhbCBhcnJheSBvZiB0d2VlbnMsIGVhY2ggaXRlbSBjYW4gYmUgYSB0d2VlbiBvciBkZWZpbml0aW9uIG9iajpcblxuICAgIFtcbiAgICAgIG5ldyBUd2VlbigpLFxuICAgICAgc3RhZ2dlcigpLFxuICAgICAgdGltZWxpbmUoKSxcbiAgICAgIHtcbiAgICAgICAgdHdlZW46IG5ldyBUd2VlbigpLFxuICAgICAgICBhdDogMTAwLFxuICAgICAgICBvZmZzZXQ6IFwiKz0xMDBcIlxuICAgICAgfVxuICAgIF1cbiovXG5jb25zdCBhbmFseXplID0gKGRlZnMpID0+IHtcbiAgY29uc3QgdGltZWxpbmUgPSBbXTtcbiAgY29uc3QgbnVtRGVmcyA9IGRlZnMubGVuZ3RoO1xuICBsZXQgY3VycmVudFBsYXloZWFkID0gMDtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG51bURlZnM7IGkrKykge1xuICAgIGNvbnN0IGRlZiA9IGRlZnNbaV07XG4gICAgY29uc3QgZGVmSXNPYmogPSBkZWYudHdlZW4gPyB0cnVlIDogZmFsc2U7XG4gICAgY29uc3QgdHdlZW4gPSAoZGVmSXNPYmopID8gZGVmLnR3ZWVuIDogZGVmO1xuXG4gICAgaWYgKGRlZklzT2JqKSB7XG4gICAgICBpZiAoZGVmLm9mZnNldCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGN1cnJlbnRQbGF5aGVhZCA9IHJlbGF0aXZlVmFsdWUoY3VycmVudFBsYXloZWFkLCBkZWYub2Zmc2V0KTtcbiAgICAgIH0gZWxzZSBpZiAoZGVmLmF0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY3VycmVudFBsYXloZWFkID0gZGVmLmF0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBkdXJhdGlvbiA9IDA7XG4gICAgZm9yIChsZXQga2V5IGluIHR3ZWVuLnZhbHVlcykge1xuICAgICAgaWYgKHR3ZWVuLnZhbHVlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdHdlZW4udmFsdWVzW2tleV07XG4gICAgICAgIGR1cmF0aW9uID0gTWF0aC5tYXgoZHVyYXRpb24sIHZhbHVlLmR1cmF0aW9uKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aW1lbGluZS5wdXNoKHtcbiAgICAgIGZyb206IGN1cnJlbnRQbGF5aGVhZCxcbiAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgIGZpcmU6ICh0aW1lKSA9PiB0d2Vlbi5zZWVrVGltZSh0aW1lKVxuICAgIH0pO1xuXG4gICAgY3VycmVudFBsYXloZWFkICs9IGR1cmF0aW9uO1xuICB9XG5cbiAgcmV0dXJuIHsgdG90YWxUaW1lOiBjdXJyZW50UGxheWhlYWQsIHRpbWVsaW5lIH07XG59O1xuXG5jb25zdCBzZXRUd2VlbnMgPSAoeyB0aW1lbGluZSwgdGltZWxpbmVMZW5ndGgsIHZhbHVlcywgZHVyYXRpb24gfSkgPT4ge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbWVsaW5lTGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCB0d2VlbiA9IHRpbWVsaW5lW2ldO1xuICAgIGNvbnN0IHR3ZWVuVGltZSA9ICh2YWx1ZXMucC5jdXJyZW50ICogZHVyYXRpb24pIC0gdHdlZW4uZnJvbTtcblxuICAgIGlmICh0d2VlblRpbWUgPj0gLTUwICYmIHR3ZWVuVGltZSA8PSB0d2Vlbi5kdXJhdGlvbiArIDUwKSB7XG4gICAgICB0d2Vlbi5maXJlKHR3ZWVuVGltZSk7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0aW1lbGluZShkZWYsIHByb3BzID0ge30pIHtcbiAgY29uc3QgeyB0b3RhbFRpbWUsIHRpbWVsaW5lIH0gPSBhbmFseXplKGRlZik7XG5cbiAgcmV0dXJuIG5ldyBUd2Vlbih7XG4gICAgZWFzZTogZWFzaW5nLmxpbmVhcixcbiAgICAuLi5wcm9wcyxcbiAgICBkdXJhdGlvbjogdG90YWxUaW1lLFxuICAgIHZhbHVlczoge1xuICAgICAgcDogeyBmcm9tOiAwLCB0bzogMSB9XG4gICAgfSxcbiAgICB0aW1lbGluZTogdGltZWxpbmUsXG4gICAgdGltZWxpbmVMZW5ndGg6IHRpbWVsaW5lLmxlbmd0aCxcbiAgICBvblJlbmRlcjogc2V0VHdlZW5zXG4gIH0pO1xufSJdfQ==