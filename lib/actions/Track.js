'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Action2 = require('./Action');

var _Action3 = _interopRequireDefault(_Action2);

var _Pointer = require('../input/Pointer');

var _Pointer2 = _interopRequireDefault(_Pointer);

var _calc = require('../inc/calc');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
  Scrape x/y coordinates from provided event

  @param [event]
  @return [object]
*/
var mouseEventToPoint = function (e) {
  return {
    x: e.pageX,
    y: e.pageY
  };
};

var touchEventToPoint = function (_ref) {
  var changedTouches = _ref.changedTouches;
  return {
    x: changedTouches[0].clientX,
    y: changedTouches[0].clientY
  };
};

var createPointer = function (e) {
  return e.touches ? new _Pointer2.default(touchEventToPoint(e), 'touchmove', touchEventToPoint) : new _Pointer2.default(mouseEventToPoint(e), 'mousemove', mouseEventToPoint);
};

var getActualEvent = function (e) {
  return e.originalEvent || e;
};

var Track = function (_Action) {
  _inherits(Track, _Action);

  function Track() {
    _classCallCheck(this, Track);

    return _possibleConstructorReturn(this, _Action.apply(this, arguments));
  }

  Track.prototype.start = function start(input) {
    _Action.prototype.start.call(this);

    if (input) {
      this.input = input.state ? input : createPointer(getActualEvent(input));
    }

    this.inputOffset = {};
    this.inputOrigin = _extends({}, this.input.state);
    this.input.start();

    return this;
  };

  Track.prototype.stop = function stop() {
    _Action.prototype.stop.call(this);
    this.input.stop();

    return this;
  };

  Track.prototype.onUpdate = function onUpdate(track, frameStamp, elapsed) {
    this.inputOffset = (0, _calc.offset)(this.inputOrigin, this.input.state);

    for (var i = 0; i < this.numValueKeys; i++) {
      var key = this.valueKeys[i];

      if (this.inputOffset.hasOwnProperty(key)) {
        var value = this.values[key];
        var inputProp = value.hasOwnProperty('watch') ? value.watch : key;

        if (value.direct) {
          value.current = this.input.state[inputProp];
        } else {
          value.current = value.from + this.inputOffset[inputProp];
        }

        // Smooth value if we have smoothing
        if (value.smooth) {
          value.current = (0, _calc.smooth)(value.current, value.prev, elapsed, value.smooth);
        }
      }
    }
  };

  return Track;
}(_Action3.default);

Track.prototype.defaultValueProp = 'watch';
Track.prototype.defaultValue = _Action3.default.extendDefaultValue({
  direct: false,
  from: 0
});

exports.default = Track;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL1RyYWNrLmpzIl0sIm5hbWVzIjpbIm1vdXNlRXZlbnRUb1BvaW50IiwiZSIsIngiLCJwYWdlWCIsInkiLCJwYWdlWSIsInRvdWNoRXZlbnRUb1BvaW50IiwiY2hhbmdlZFRvdWNoZXMiLCJjbGllbnRYIiwiY2xpZW50WSIsImNyZWF0ZVBvaW50ZXIiLCJ0b3VjaGVzIiwiZ2V0QWN0dWFsRXZlbnQiLCJvcmlnaW5hbEV2ZW50IiwiVHJhY2siLCJzdGFydCIsImlucHV0Iiwic3RhdGUiLCJpbnB1dE9mZnNldCIsImlucHV0T3JpZ2luIiwic3RvcCIsIm9uVXBkYXRlIiwidHJhY2siLCJmcmFtZVN0YW1wIiwiZWxhcHNlZCIsImkiLCJudW1WYWx1ZUtleXMiLCJrZXkiLCJ2YWx1ZUtleXMiLCJoYXNPd25Qcm9wZXJ0eSIsInZhbHVlIiwidmFsdWVzIiwiaW5wdXRQcm9wIiwid2F0Y2giLCJkaXJlY3QiLCJjdXJyZW50IiwiZnJvbSIsInNtb290aCIsInByZXYiLCJwcm90b3R5cGUiLCJkZWZhdWx0VmFsdWVQcm9wIiwiZGVmYXVsdFZhbHVlIiwiZXh0ZW5kRGVmYXVsdFZhbHVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQTs7Ozs7O0FBTUEsSUFBTUEsb0JBQW9CLFVBQUNDLENBQUQ7QUFBQSxTQUFRO0FBQ2hDQyxPQUFHRCxFQUFFRSxLQUQyQjtBQUVoQ0MsT0FBR0gsRUFBRUk7QUFGMkIsR0FBUjtBQUFBLENBQTFCOztBQUtBLElBQU1DLG9CQUFvQjtBQUFBLE1BQUdDLGNBQUgsUUFBR0EsY0FBSDtBQUFBLFNBQXlCO0FBQ2pETCxPQUFHSyxlQUFlLENBQWYsRUFBa0JDLE9BRDRCO0FBRWpESixPQUFHRyxlQUFlLENBQWYsRUFBa0JFO0FBRjRCLEdBQXpCO0FBQUEsQ0FBMUI7O0FBS0EsSUFBTUMsZ0JBQWdCLFVBQUNULENBQUQ7QUFBQSxTQUFPQSxFQUFFVSxPQUFGLEdBQzNCLHNCQUFZTCxrQkFBa0JMLENBQWxCLENBQVosRUFBa0MsV0FBbEMsRUFBK0NLLGlCQUEvQyxDQUQyQixHQUUzQixzQkFBWU4sa0JBQWtCQyxDQUFsQixDQUFaLEVBQWtDLFdBQWxDLEVBQStDRCxpQkFBL0MsQ0FGb0I7QUFBQSxDQUF0Qjs7QUFJQSxJQUFNWSxpQkFBaUIsVUFBQ1gsQ0FBRDtBQUFBLFNBQU9BLEVBQUVZLGFBQUYsSUFBbUJaLENBQTFCO0FBQUEsQ0FBdkI7O0lBRU1hLEs7Ozs7Ozs7OztrQkFDSkMsSyxrQkFBTUMsSyxFQUFPO0FBQ1gsc0JBQU1ELEtBQU47O0FBRUEsUUFBSUMsS0FBSixFQUFXO0FBQ1QsV0FBS0EsS0FBTCxHQUFhQSxNQUFNQyxLQUFOLEdBQWNELEtBQWQsR0FBc0JOLGNBQWNFLGVBQWVJLEtBQWYsQ0FBZCxDQUFuQztBQUNEOztBQUVELFNBQUtFLFdBQUwsR0FBbUIsRUFBbkI7QUFDQSxTQUFLQyxXQUFMLGdCQUF3QixLQUFLSCxLQUFMLENBQVdDLEtBQW5DO0FBQ0EsU0FBS0QsS0FBTCxDQUFXRCxLQUFYOztBQUVBLFdBQU8sSUFBUDtBQUNELEc7O2tCQUVESyxJLG1CQUFPO0FBQ0wsc0JBQU1BLElBQU47QUFDQSxTQUFLSixLQUFMLENBQVdJLElBQVg7O0FBRUEsV0FBTyxJQUFQO0FBQ0QsRzs7a0JBRURDLFEscUJBQVNDLEssRUFBT0MsVSxFQUFZQyxPLEVBQVM7QUFDbkMsU0FBS04sV0FBTCxHQUFtQixrQkFBTyxLQUFLQyxXQUFaLEVBQXlCLEtBQUtILEtBQUwsQ0FBV0MsS0FBcEMsQ0FBbkI7O0FBRUEsU0FBSyxJQUFJUSxJQUFJLENBQWIsRUFBZ0JBLElBQUksS0FBS0MsWUFBekIsRUFBdUNELEdBQXZDLEVBQTRDO0FBQzFDLFVBQU1FLE1BQU0sS0FBS0MsU0FBTCxDQUFlSCxDQUFmLENBQVo7O0FBRUEsVUFBSSxLQUFLUCxXQUFMLENBQWlCVyxjQUFqQixDQUFnQ0YsR0FBaEMsQ0FBSixFQUEwQztBQUN4QyxZQUFNRyxRQUFRLEtBQUtDLE1BQUwsQ0FBWUosR0FBWixDQUFkO0FBQ0EsWUFBTUssWUFBWUYsTUFBTUQsY0FBTixDQUFxQixPQUFyQixJQUFnQ0MsTUFBTUcsS0FBdEMsR0FBOENOLEdBQWhFOztBQUVBLFlBQUlHLE1BQU1JLE1BQVYsRUFBa0I7QUFDaEJKLGdCQUFNSyxPQUFOLEdBQWdCLEtBQUtuQixLQUFMLENBQVdDLEtBQVgsQ0FBaUJlLFNBQWpCLENBQWhCO0FBQ0QsU0FGRCxNQUVPO0FBQ0xGLGdCQUFNSyxPQUFOLEdBQWdCTCxNQUFNTSxJQUFOLEdBQWEsS0FBS2xCLFdBQUwsQ0FBaUJjLFNBQWpCLENBQTdCO0FBQ0Q7O0FBRUQ7QUFDQSxZQUFJRixNQUFNTyxNQUFWLEVBQWtCO0FBQ2hCUCxnQkFBTUssT0FBTixHQUFnQixrQkFBT0wsTUFBTUssT0FBYixFQUFzQkwsTUFBTVEsSUFBNUIsRUFBa0NkLE9BQWxDLEVBQTJDTSxNQUFNTyxNQUFqRCxDQUFoQjtBQUNEO0FBQ0Y7QUFDRjtBQUNGLEc7Ozs7O0FBR0h2QixNQUFNeUIsU0FBTixDQUFnQkMsZ0JBQWhCLEdBQW1DLE9BQW5DO0FBQ0ExQixNQUFNeUIsU0FBTixDQUFnQkUsWUFBaEIsR0FBK0IsaUJBQU9DLGtCQUFQLENBQTBCO0FBQ3ZEUixVQUFRLEtBRCtDO0FBRXZERSxRQUFNO0FBRmlELENBQTFCLENBQS9COztrQkFLZXRCLEsiLCJmaWxlIjoiVHJhY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWN0aW9uIGZyb20gJy4vQWN0aW9uJztcbmltcG9ydCBQb2ludGVyIGZyb20gJy4uL2lucHV0L1BvaW50ZXInO1xuaW1wb3J0IHsgc21vb3RoLCBvZmZzZXQgfSBmcm9tICcuLi9pbmMvY2FsYyc7XG5cbi8qXG4gIFNjcmFwZSB4L3kgY29vcmRpbmF0ZXMgZnJvbSBwcm92aWRlZCBldmVudFxuXG4gIEBwYXJhbSBbZXZlbnRdXG4gIEByZXR1cm4gW29iamVjdF1cbiovXG5jb25zdCBtb3VzZUV2ZW50VG9Qb2ludCA9IChlKSA9PiAoe1xuICB4OiBlLnBhZ2VYLFxuICB5OiBlLnBhZ2VZXG59KTtcblxuY29uc3QgdG91Y2hFdmVudFRvUG9pbnQgPSAoeyBjaGFuZ2VkVG91Y2hlcyB9KSA9PiAoe1xuICB4OiBjaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYLFxuICB5OiBjaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZXG59KTtcblxuY29uc3QgY3JlYXRlUG9pbnRlciA9IChlKSA9PiBlLnRvdWNoZXMgP1xuICBuZXcgUG9pbnRlcih0b3VjaEV2ZW50VG9Qb2ludChlKSwgJ3RvdWNobW92ZScsIHRvdWNoRXZlbnRUb1BvaW50KSA6IFxuICBuZXcgUG9pbnRlcihtb3VzZUV2ZW50VG9Qb2ludChlKSwgJ21vdXNlbW92ZScsIG1vdXNlRXZlbnRUb1BvaW50KTtcblxuY29uc3QgZ2V0QWN0dWFsRXZlbnQgPSAoZSkgPT4gZS5vcmlnaW5hbEV2ZW50IHx8IGU7XG5cbmNsYXNzIFRyYWNrIGV4dGVuZHMgQWN0aW9uIHtcbiAgc3RhcnQoaW5wdXQpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKGlucHV0KSB7XG4gICAgICB0aGlzLmlucHV0ID0gaW5wdXQuc3RhdGUgPyBpbnB1dCA6IGNyZWF0ZVBvaW50ZXIoZ2V0QWN0dWFsRXZlbnQoaW5wdXQpKTtcbiAgICB9XG5cbiAgICB0aGlzLmlucHV0T2Zmc2V0ID0ge307XG4gICAgdGhpcy5pbnB1dE9yaWdpbiA9IHsgLi4udGhpcy5pbnB1dC5zdGF0ZSB9O1xuICAgIHRoaXMuaW5wdXQuc3RhcnQoKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gICAgdGhpcy5pbnB1dC5zdG9wKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG9uVXBkYXRlKHRyYWNrLCBmcmFtZVN0YW1wLCBlbGFwc2VkKSB7XG4gICAgdGhpcy5pbnB1dE9mZnNldCA9IG9mZnNldCh0aGlzLmlucHV0T3JpZ2luLCB0aGlzLmlucHV0LnN0YXRlKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1WYWx1ZUtleXM7IGkrKykge1xuICAgICAgY29uc3Qga2V5ID0gdGhpcy52YWx1ZUtleXNbaV07XG5cbiAgICAgIGlmICh0aGlzLmlucHV0T2Zmc2V0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnZhbHVlc1trZXldO1xuICAgICAgICBjb25zdCBpbnB1dFByb3AgPSB2YWx1ZS5oYXNPd25Qcm9wZXJ0eSgnd2F0Y2gnKSA/IHZhbHVlLndhdGNoIDoga2V5O1xuXG4gICAgICAgIGlmICh2YWx1ZS5kaXJlY3QpIHtcbiAgICAgICAgICB2YWx1ZS5jdXJyZW50ID0gdGhpcy5pbnB1dC5zdGF0ZVtpbnB1dFByb3BdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlLmN1cnJlbnQgPSB2YWx1ZS5mcm9tICsgdGhpcy5pbnB1dE9mZnNldFtpbnB1dFByb3BdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU21vb3RoIHZhbHVlIGlmIHdlIGhhdmUgc21vb3RoaW5nXG4gICAgICAgIGlmICh2YWx1ZS5zbW9vdGgpIHtcbiAgICAgICAgICB2YWx1ZS5jdXJyZW50ID0gc21vb3RoKHZhbHVlLmN1cnJlbnQsIHZhbHVlLnByZXYsIGVsYXBzZWQsIHZhbHVlLnNtb290aCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuVHJhY2sucHJvdG90eXBlLmRlZmF1bHRWYWx1ZVByb3AgPSAnd2F0Y2gnO1xuVHJhY2sucHJvdG90eXBlLmRlZmF1bHRWYWx1ZSA9IEFjdGlvbi5leHRlbmREZWZhdWx0VmFsdWUoe1xuICBkaXJlY3Q6IGZhbHNlLFxuICBmcm9tOiAwXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgVHJhY2s7XG4iXX0=