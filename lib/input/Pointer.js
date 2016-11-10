'use strict';

exports.__esModule = true;

var _Input2 = require('./Input');

var _Input3 = _interopRequireDefault(_Input2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pointer = function (_Input) {
  _inherits(Pointer, _Input);

  function Pointer(initialState, moveEvent, eventToPoint) {
    _classCallCheck(this, Pointer);

    var _this = _possibleConstructorReturn(this, _Input.call(this, initialState));

    _this.eventToPoint = eventToPoint;
    _this.moveEvent = moveEvent;
    _this.boundLatest = _this.latest.bind(_this);
    return _this;
  }

  Pointer.prototype.latest = function latest(e) {
    _Input.prototype.latest.call(this, this.eventToPoint(e));
    e.preventDefault();
  };

  Pointer.prototype.start = function start() {
    _Input.prototype.start.call(this);
    document.documentElement.addEventListener(this.moveEvent, this.boundLatest);
  };

  Pointer.prototype.stop = function stop() {
    _Input.prototype.stop.call(this);
    document.documentElement.removeEventListener(this.moveEvent, this.boundLatest);
  };

  return Pointer;
}(_Input3.default);

exports.default = Pointer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbnB1dC9Qb2ludGVyLmpzIl0sIm5hbWVzIjpbIlBvaW50ZXIiLCJpbml0aWFsU3RhdGUiLCJtb3ZlRXZlbnQiLCJldmVudFRvUG9pbnQiLCJib3VuZExhdGVzdCIsImxhdGVzdCIsImJpbmQiLCJlIiwicHJldmVudERlZmF1bHQiLCJzdGFydCIsImRvY3VtZW50IiwiZG9jdW1lbnRFbGVtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsInN0b3AiLCJyZW1vdmVFdmVudExpc3RlbmVyIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUVxQkEsTzs7O0FBQ25CLG1CQUFZQyxZQUFaLEVBQTBCQyxTQUExQixFQUFxQ0MsWUFBckMsRUFBbUQ7QUFBQTs7QUFBQSxpREFDakQsa0JBQU1GLFlBQU4sQ0FEaUQ7O0FBRWpELFVBQUtFLFlBQUwsR0FBb0JBLFlBQXBCO0FBQ0EsVUFBS0QsU0FBTCxHQUFpQkEsU0FBakI7QUFDQSxVQUFLRSxXQUFMLEdBQW1CLE1BQUtDLE1BQUwsQ0FBWUMsSUFBWixPQUFuQjtBQUppRDtBQUtsRDs7b0JBRURELE0sbUJBQU9FLEMsRUFBRztBQUNSLHFCQUFNRixNQUFOLFlBQWEsS0FBS0YsWUFBTCxDQUFrQkksQ0FBbEIsQ0FBYjtBQUNBQSxNQUFFQyxjQUFGO0FBQ0QsRzs7b0JBRURDLEssb0JBQVE7QUFDTixxQkFBTUEsS0FBTjtBQUNBQyxhQUFTQyxlQUFULENBQXlCQyxnQkFBekIsQ0FBMEMsS0FBS1YsU0FBL0MsRUFBMEQsS0FBS0UsV0FBL0Q7QUFDRCxHOztvQkFFRFMsSSxtQkFBTztBQUNMLHFCQUFNQSxJQUFOO0FBQ0FILGFBQVNDLGVBQVQsQ0FBeUJHLG1CQUF6QixDQUE2QyxLQUFLWixTQUFsRCxFQUE2RCxLQUFLRSxXQUFsRTtBQUNELEc7Ozs7O2tCQXJCa0JKLE8iLCJmaWxlIjoiUG9pbnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJbnB1dCBmcm9tICcuL0lucHV0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9pbnRlciBleHRlbmRzIElucHV0IHtcbiAgY29uc3RydWN0b3IoaW5pdGlhbFN0YXRlLCBtb3ZlRXZlbnQsIGV2ZW50VG9Qb2ludCkge1xuICAgIHN1cGVyKGluaXRpYWxTdGF0ZSk7XG4gICAgdGhpcy5ldmVudFRvUG9pbnQgPSBldmVudFRvUG9pbnQ7XG4gICAgdGhpcy5tb3ZlRXZlbnQgPSBtb3ZlRXZlbnQ7XG4gICAgdGhpcy5ib3VuZExhdGVzdCA9IHRoaXMubGF0ZXN0LmJpbmQodGhpcyk7XG4gIH1cblxuICBsYXRlc3QoZSkge1xuICAgIHN1cGVyLmxhdGVzdCh0aGlzLmV2ZW50VG9Qb2ludChlKSk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLm1vdmVFdmVudCwgdGhpcy5ib3VuZExhdGVzdCk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLm1vdmVFdmVudCwgdGhpcy5ib3VuZExhdGVzdCk7XG4gIH1cbn1cbiJdfQ==