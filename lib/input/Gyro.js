'use strict';

exports.__esModule = true;

var _Pointer = require('./Pointer');

var _Pointer2 = _interopRequireDefault(_Pointer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEVICE_MOTION = 'devicemotion';

/*
  Scrape x/y coordinates from provided event

  @param [event]
  @return [object]
*/
var eventToPoint = function (e) {
  return {
    x: e.accelerationIncludingGravity.x,
    y: e.accelerationIncludingGravity.y,
    z: e.accelerationIncludingGravity.z,
    yaw: e.alpha,
    pitch: e.beta,
    roll: event.gamma
  };
};

var Gyro = function (_Input) {
  _inherits(Gyro, _Input);

  function Gyro() {
    _classCallCheck(this, Gyro);

    var _this = _possibleConstructorReturn(this, _Input.call(this));

    _this.bindEvents();
    return _this;
  }

  Gyro.prototype.latest = function latest(e) {
    _Input.prototype.latest.call(this, eventToPoint(e));
    e.preventDefault();
  };

  Gyro.prototype.start = function start() {
    _Input.prototype.start.call(this);
    document.documentElement.addEventListener(DEVICE_MOTION, this.onMove);
  };

  Gyro.prototype.stop = function stop() {
    _Input.prototype.stop.call(this);
    document.documentElement.removeEventListener(DEVICE_MOTION, this.onMove);
  };

  return Gyro;
}(_Pointer2.default);

exports.default = Gyro;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbnB1dC9HeXJvLmpzIl0sIm5hbWVzIjpbIkRFVklDRV9NT1RJT04iLCJldmVudFRvUG9pbnQiLCJlIiwieCIsImFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkiLCJ5IiwieiIsInlhdyIsImFscGhhIiwicGl0Y2giLCJiZXRhIiwicm9sbCIsImV2ZW50IiwiZ2FtbWEiLCJHeXJvIiwiYmluZEV2ZW50cyIsImxhdGVzdCIsInByZXZlbnREZWZhdWx0Iiwic3RhcnQiLCJkb2N1bWVudCIsImRvY3VtZW50RWxlbWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJvbk1vdmUiLCJzdG9wIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxnQkFBZ0IsY0FBdEI7O0FBRUE7Ozs7OztBQU1BLElBQU1DLGVBQWUsVUFBQ0MsQ0FBRDtBQUFBLFNBQVE7QUFDM0JDLE9BQUdELEVBQUVFLDRCQUFGLENBQStCRCxDQURQO0FBRTNCRSxPQUFHSCxFQUFFRSw0QkFBRixDQUErQkMsQ0FGUDtBQUczQkMsT0FBR0osRUFBRUUsNEJBQUYsQ0FBK0JFLENBSFA7QUFJM0JDLFNBQUtMLEVBQUVNLEtBSm9CO0FBSzNCQyxXQUFPUCxFQUFFUSxJQUxrQjtBQU0zQkMsVUFBTUMsTUFBTUM7QUFOZSxHQUFSO0FBQUEsQ0FBckI7O0lBU3FCQyxJOzs7QUFDbkIsa0JBQWM7QUFBQTs7QUFBQSxpREFDWixpQkFEWTs7QUFFWixVQUFLQyxVQUFMO0FBRlk7QUFHYjs7aUJBRURDLE0sbUJBQU9kLEMsRUFBRztBQUNSLHFCQUFNYyxNQUFOLFlBQWFmLGFBQWFDLENBQWIsQ0FBYjtBQUNBQSxNQUFFZSxjQUFGO0FBQ0QsRzs7aUJBRURDLEssb0JBQVE7QUFDTixxQkFBTUEsS0FBTjtBQUNBQyxhQUFTQyxlQUFULENBQXlCQyxnQkFBekIsQ0FBMENyQixhQUExQyxFQUF5RCxLQUFLc0IsTUFBOUQ7QUFDRCxHOztpQkFFREMsSSxtQkFBTztBQUNMLHFCQUFNQSxJQUFOO0FBQ0FKLGFBQVNDLGVBQVQsQ0FBeUJJLG1CQUF6QixDQUE2Q3hCLGFBQTdDLEVBQTRELEtBQUtzQixNQUFqRTtBQUNELEc7Ozs7O2tCQW5Ca0JSLEkiLCJmaWxlIjoiR3lyby5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJbnB1dCBmcm9tICcuL1BvaW50ZXInO1xuXG5jb25zdCBERVZJQ0VfTU9USU9OID0gJ2RldmljZW1vdGlvbic7XG5cbi8qXG4gIFNjcmFwZSB4L3kgY29vcmRpbmF0ZXMgZnJvbSBwcm92aWRlZCBldmVudFxuXG4gIEBwYXJhbSBbZXZlbnRdXG4gIEByZXR1cm4gW29iamVjdF1cbiovXG5jb25zdCBldmVudFRvUG9pbnQgPSAoZSkgPT4gKHtcbiAgeDogZS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LngsXG4gIHk6IGUuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55LFxuICB6OiBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueixcbiAgeWF3OiBlLmFscGhhLFxuICBwaXRjaDogZS5iZXRhLFxuICByb2xsOiBldmVudC5nYW1tYVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEd5cm8gZXh0ZW5kcyBJbnB1dCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gIH1cblxuICBsYXRlc3QoZSkge1xuICAgIHN1cGVyLmxhdGVzdChldmVudFRvUG9pbnQoZSkpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoREVWSUNFX01PVElPTiwgdGhpcy5vbk1vdmUpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoREVWSUNFX01PVElPTiwgdGhpcy5vbk1vdmUpO1xuICB9XG59Il19