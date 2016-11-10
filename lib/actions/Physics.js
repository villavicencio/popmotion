'use strict';

exports.__esModule = true;

var _Action2 = require('./Action');

var _Action3 = _interopRequireDefault(_Action2);

var _calc = require('../inc/calc');

var _utils = require('../inc/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Physics = function (_Action) {
  _inherits(Physics, _Action);

  function Physics() {
    _classCallCheck(this, Physics);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, _Action.call.apply(_Action, [this].concat(args)));

    _this.inactiveFrames = 0;
    _this.calculatesVelocity = true;
    return _this;
  }

  Physics.prototype.onUpdate = function onUpdate(physics, frameStamp, elapsed) {
    this.hasChanged = false;

    for (var i = 0; i < this.numValueKeys; i++) {
      var key = this.valueKeys[i];
      var value = this.values[key];

      // Apply acceleration
      value.velocity += (0, _calc.speedPerFrame)(value.acceleration, elapsed);

      // Apply friction
      value.velocity *= Math.pow(1 - value.friction, elapsed / 100);

      // Apply spring
      if (value.spring && (0, _utils.isNum)(value.to)) {
        var distanceToTarget = value.to - value.current;
        value.velocity += distanceToTarget * (0, _calc.speedPerFrame)(value.spring, elapsed);
      }

      // Apply latest velocity
      value.current += (0, _calc.speedPerFrame)(value.velocity, elapsed);

      // Detect bounce
      if (value.min !== undefined && value.current < value.min || value.max !== undefined && value.current > value.max) {
        value.velocity *= -value.bounce;
      }

      // Check if value has changed
      if (Math.abs(value.velocity) >= value.stopSpeed) {
        this.hasChanged = true;
      }

      if (value.spring && !this.hasChanged) {
        value.current = value.to;
      }
    }
  };

  Physics.prototype.onFrameEnd = function onFrameEnd() {
    if (this.maxInactiveFrames !== Infinity) {
      this.inactiveFrames = this.hasChanged ? 1 : this.inactiveFrames + 1;

      if (this.inactiveFrames >= this.maxInactiveFrames) {
        this.complete();
      }
    }
  };

  return Physics;
}(_Action3.default);

Physics.prototype.defaultValueProp = 'velocity';
Physics.prototype.defaultValue = _Action3.default.extendDefaultValue({
  acceleration: 0, // [number]: Acceleration to apply to value, in units per second
  bounce: 0, // [number]: Factor to multiply velocity by on bounce
  spring: 0, // [number]: Spring strength during 'string'
  stopSpeed: 0.001, // [number]: Stop simulation under this speed
  friction: 0 // [number]: Friction to apply per frame, 0-1
});
Physics.prototype.defaultProps = _Action3.default.extendDefaultProps({
  maxInactiveFrames: 3
});

exports.default = Physics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL1BoeXNpY3MuanMiXSwibmFtZXMiOlsiUGh5c2ljcyIsImFyZ3MiLCJpbmFjdGl2ZUZyYW1lcyIsImNhbGN1bGF0ZXNWZWxvY2l0eSIsIm9uVXBkYXRlIiwicGh5c2ljcyIsImZyYW1lU3RhbXAiLCJlbGFwc2VkIiwiaGFzQ2hhbmdlZCIsImkiLCJudW1WYWx1ZUtleXMiLCJrZXkiLCJ2YWx1ZUtleXMiLCJ2YWx1ZSIsInZhbHVlcyIsInZlbG9jaXR5IiwiYWNjZWxlcmF0aW9uIiwiZnJpY3Rpb24iLCJzcHJpbmciLCJ0byIsImRpc3RhbmNlVG9UYXJnZXQiLCJjdXJyZW50IiwibWluIiwidW5kZWZpbmVkIiwibWF4IiwiYm91bmNlIiwiTWF0aCIsImFicyIsInN0b3BTcGVlZCIsIm9uRnJhbWVFbmQiLCJtYXhJbmFjdGl2ZUZyYW1lcyIsIkluZmluaXR5IiwiY29tcGxldGUiLCJwcm90b3R5cGUiLCJkZWZhdWx0VmFsdWVQcm9wIiwiZGVmYXVsdFZhbHVlIiwiZXh0ZW5kRGVmYXVsdFZhbHVlIiwiZGVmYXVsdFByb3BzIiwiZXh0ZW5kRGVmYXVsdFByb3BzIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztJQUVNQSxPOzs7QUFDSixxQkFBcUI7QUFBQTs7QUFBQSxzQ0FBTkMsSUFBTTtBQUFOQSxVQUFNO0FBQUE7O0FBQUEsaURBQ25CLDBDQUFTQSxJQUFULEVBRG1COztBQUVuQixVQUFLQyxjQUFMLEdBQXNCLENBQXRCO0FBQ0EsVUFBS0Msa0JBQUwsR0FBMEIsSUFBMUI7QUFIbUI7QUFJcEI7O29CQUVEQyxRLHFCQUFTQyxPLEVBQVNDLFUsRUFBWUMsTyxFQUFTO0FBQ3JDLFNBQUtDLFVBQUwsR0FBa0IsS0FBbEI7O0FBRUEsU0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUksS0FBS0MsWUFBekIsRUFBdUNELEdBQXZDLEVBQTRDO0FBQzFDLFVBQU1FLE1BQU0sS0FBS0MsU0FBTCxDQUFlSCxDQUFmLENBQVo7QUFDQSxVQUFNSSxRQUFRLEtBQUtDLE1BQUwsQ0FBWUgsR0FBWixDQUFkOztBQUVBO0FBQ0FFLFlBQU1FLFFBQU4sSUFBa0IseUJBQWNGLE1BQU1HLFlBQXBCLEVBQWtDVCxPQUFsQyxDQUFsQjs7QUFFQTtBQUNBTSxZQUFNRSxRQUFOLGFBQW1CLElBQUlGLE1BQU1JLFFBQTdCLEVBQTJDVixVQUFVLEdBQXJEOztBQUVBO0FBQ0EsVUFBSU0sTUFBTUssTUFBTixJQUFnQixrQkFBTUwsTUFBTU0sRUFBWixDQUFwQixFQUFxQztBQUNuQyxZQUFNQyxtQkFBbUJQLE1BQU1NLEVBQU4sR0FBV04sTUFBTVEsT0FBMUM7QUFDQVIsY0FBTUUsUUFBTixJQUFrQkssbUJBQW1CLHlCQUFjUCxNQUFNSyxNQUFwQixFQUE0QlgsT0FBNUIsQ0FBckM7QUFDRDs7QUFFRDtBQUNBTSxZQUFNUSxPQUFOLElBQWlCLHlCQUFjUixNQUFNRSxRQUFwQixFQUE4QlIsT0FBOUIsQ0FBakI7O0FBRUE7QUFDQSxVQUFLTSxNQUFNUyxHQUFOLEtBQWNDLFNBQWQsSUFBMkJWLE1BQU1RLE9BQU4sR0FBZ0JSLE1BQU1TLEdBQWxELElBQTJEVCxNQUFNVyxHQUFOLEtBQWNELFNBQWQsSUFBMkJWLE1BQU1RLE9BQU4sR0FBZ0JSLE1BQU1XLEdBQWhILEVBQXNIO0FBQ3BIWCxjQUFNRSxRQUFOLElBQWtCLENBQUVGLE1BQU1ZLE1BQTFCO0FBQ0Q7O0FBRUQ7QUFDQSxVQUFJQyxLQUFLQyxHQUFMLENBQVNkLE1BQU1FLFFBQWYsS0FBNEJGLE1BQU1lLFNBQXRDLEVBQWlEO0FBQy9DLGFBQUtwQixVQUFMLEdBQWtCLElBQWxCO0FBQ0Q7O0FBRUQsVUFBSUssTUFBTUssTUFBTixJQUFnQixDQUFDLEtBQUtWLFVBQTFCLEVBQXNDO0FBQ3BDSyxjQUFNUSxPQUFOLEdBQWdCUixNQUFNTSxFQUF0QjtBQUNEO0FBQ0Y7QUFDRixHOztvQkFFRFUsVSx5QkFBYTtBQUNYLFFBQUksS0FBS0MsaUJBQUwsS0FBMkJDLFFBQS9CLEVBQXlDO0FBQ3ZDLFdBQUs3QixjQUFMLEdBQXNCLEtBQUtNLFVBQUwsR0FBa0IsQ0FBbEIsR0FBc0IsS0FBS04sY0FBTCxHQUFzQixDQUFsRTs7QUFFQSxVQUFJLEtBQUtBLGNBQUwsSUFBdUIsS0FBSzRCLGlCQUFoQyxFQUFtRDtBQUNqRCxhQUFLRSxRQUFMO0FBQ0Q7QUFDRjtBQUNGLEc7Ozs7O0FBR0hoQyxRQUFRaUMsU0FBUixDQUFrQkMsZ0JBQWxCLEdBQXFDLFVBQXJDO0FBQ0FsQyxRQUFRaUMsU0FBUixDQUFrQkUsWUFBbEIsR0FBaUMsaUJBQU9DLGtCQUFQLENBQTBCO0FBQ3pEcEIsZ0JBQWMsQ0FEMkMsRUFDeEM7QUFDakJTLFVBQVEsQ0FGaUQsRUFFOUM7QUFDWFAsVUFBUSxDQUhpRCxFQUc5QztBQUNYVSxhQUFXLEtBSjhDLEVBSXZDO0FBQ2xCWCxZQUFVLENBTCtDLENBSzdDO0FBTDZDLENBQTFCLENBQWpDO0FBT0FqQixRQUFRaUMsU0FBUixDQUFrQkksWUFBbEIsR0FBaUMsaUJBQU9DLGtCQUFQLENBQTBCO0FBQ3pEUixxQkFBbUI7QUFEc0MsQ0FBMUIsQ0FBakM7O2tCQUllOUIsTyIsImZpbGUiOiJQaHlzaWNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFjdGlvbiBmcm9tICcuL0FjdGlvbic7XG5pbXBvcnQgeyBzcGVlZFBlckZyYW1lIH0gZnJvbSAnLi4vaW5jL2NhbGMnO1xuaW1wb3J0IHsgaXNOdW0gfSBmcm9tICcuLi9pbmMvdXRpbHMnO1xuXG5jbGFzcyBQaHlzaWNzIGV4dGVuZHMgQWN0aW9uIHtcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgIHRoaXMuaW5hY3RpdmVGcmFtZXMgPSAwO1xuICAgIHRoaXMuY2FsY3VsYXRlc1ZlbG9jaXR5ID0gdHJ1ZTtcbiAgfVxuXG4gIG9uVXBkYXRlKHBoeXNpY3MsIGZyYW1lU3RhbXAsIGVsYXBzZWQpIHtcbiAgICB0aGlzLmhhc0NoYW5nZWQgPSBmYWxzZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1WYWx1ZUtleXM7IGkrKykge1xuICAgICAgY29uc3Qga2V5ID0gdGhpcy52YWx1ZUtleXNbaV07XG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMudmFsdWVzW2tleV07XG5cbiAgICAgIC8vIEFwcGx5IGFjY2VsZXJhdGlvblxuICAgICAgdmFsdWUudmVsb2NpdHkgKz0gc3BlZWRQZXJGcmFtZSh2YWx1ZS5hY2NlbGVyYXRpb24sIGVsYXBzZWQpO1xuXG4gICAgICAvLyBBcHBseSBmcmljdGlvblxuICAgICAgdmFsdWUudmVsb2NpdHkgKj0gKDEgLSB2YWx1ZS5mcmljdGlvbikgKiogKGVsYXBzZWQgLyAxMDApO1xuXG4gICAgICAvLyBBcHBseSBzcHJpbmdcbiAgICAgIGlmICh2YWx1ZS5zcHJpbmcgJiYgaXNOdW0odmFsdWUudG8pKSB7XG4gICAgICAgIGNvbnN0IGRpc3RhbmNlVG9UYXJnZXQgPSB2YWx1ZS50byAtIHZhbHVlLmN1cnJlbnQ7XG4gICAgICAgIHZhbHVlLnZlbG9jaXR5ICs9IGRpc3RhbmNlVG9UYXJnZXQgKiBzcGVlZFBlckZyYW1lKHZhbHVlLnNwcmluZywgZWxhcHNlZCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFwcGx5IGxhdGVzdCB2ZWxvY2l0eVxuICAgICAgdmFsdWUuY3VycmVudCArPSBzcGVlZFBlckZyYW1lKHZhbHVlLnZlbG9jaXR5LCBlbGFwc2VkKTtcblxuICAgICAgLy8gRGV0ZWN0IGJvdW5jZVxuICAgICAgaWYgKCh2YWx1ZS5taW4gIT09IHVuZGVmaW5lZCAmJiB2YWx1ZS5jdXJyZW50IDwgdmFsdWUubWluKSB8fCAodmFsdWUubWF4ICE9PSB1bmRlZmluZWQgJiYgdmFsdWUuY3VycmVudCA+IHZhbHVlLm1heCkpIHtcbiAgICAgICAgdmFsdWUudmVsb2NpdHkgKj0gLSB2YWx1ZS5ib3VuY2U7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIENoZWNrIGlmIHZhbHVlIGhhcyBjaGFuZ2VkXG4gICAgICBpZiAoTWF0aC5hYnModmFsdWUudmVsb2NpdHkpID49IHZhbHVlLnN0b3BTcGVlZCkge1xuICAgICAgICB0aGlzLmhhc0NoYW5nZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsdWUuc3ByaW5nICYmICF0aGlzLmhhc0NoYW5nZWQpIHtcbiAgICAgICAgdmFsdWUuY3VycmVudCA9IHZhbHVlLnRvO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uRnJhbWVFbmQoKSB7XG4gICAgaWYgKHRoaXMubWF4SW5hY3RpdmVGcmFtZXMgIT09IEluZmluaXR5KSB7XG4gICAgICB0aGlzLmluYWN0aXZlRnJhbWVzID0gdGhpcy5oYXNDaGFuZ2VkID8gMSA6IHRoaXMuaW5hY3RpdmVGcmFtZXMgKyAxO1xuXG4gICAgICBpZiAodGhpcy5pbmFjdGl2ZUZyYW1lcyA+PSB0aGlzLm1heEluYWN0aXZlRnJhbWVzKSB7XG4gICAgICAgIHRoaXMuY29tcGxldGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuUGh5c2ljcy5wcm90b3R5cGUuZGVmYXVsdFZhbHVlUHJvcCA9ICd2ZWxvY2l0eSc7XG5QaHlzaWNzLnByb3RvdHlwZS5kZWZhdWx0VmFsdWUgPSBBY3Rpb24uZXh0ZW5kRGVmYXVsdFZhbHVlKHtcbiAgYWNjZWxlcmF0aW9uOiAwLCAvLyBbbnVtYmVyXTogQWNjZWxlcmF0aW9uIHRvIGFwcGx5IHRvIHZhbHVlLCBpbiB1bml0cyBwZXIgc2Vjb25kXG4gIGJvdW5jZTogMCwgLy8gW251bWJlcl06IEZhY3RvciB0byBtdWx0aXBseSB2ZWxvY2l0eSBieSBvbiBib3VuY2VcbiAgc3ByaW5nOiAwLCAvLyBbbnVtYmVyXTogU3ByaW5nIHN0cmVuZ3RoIGR1cmluZyAnc3RyaW5nJ1xuICBzdG9wU3BlZWQ6IDAuMDAxLCAvLyBbbnVtYmVyXTogU3RvcCBzaW11bGF0aW9uIHVuZGVyIHRoaXMgc3BlZWRcbiAgZnJpY3Rpb246IDAgLy8gW251bWJlcl06IEZyaWN0aW9uIHRvIGFwcGx5IHBlciBmcmFtZSwgMC0xXG59KTtcblBoeXNpY3MucHJvdG90eXBlLmRlZmF1bHRQcm9wcyA9IEFjdGlvbi5leHRlbmREZWZhdWx0UHJvcHMoe1xuICBtYXhJbmFjdGl2ZUZyYW1lczogM1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFBoeXNpY3M7XG4iXX0=