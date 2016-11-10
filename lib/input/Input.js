'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Task2 = require('../task/Task');

var _Task3 = _interopRequireDefault(_Task2);

var _utils = require('../inc/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Input = function (_Task) {
  _inherits(Input, _Task);

  function Input(initialValues, poll) {
    _classCallCheck(this, Input);

    var _this = _possibleConstructorReturn(this, _Task.call(this));

    _this.state = initialValues;

    if ((0, _utils.isFunc)(poll)) {
      _this.onFrameStart = function () {
        return _this.latest(_this.poll());
      };
    }
    return _this;
  }

  /*
    Manually add latest values
     @param [object]
  */


  Input.prototype.latest = function latest(props) {
    this.state = _extends({}, this.state, props);
  };

  return Input;
}(_Task3.default);

exports.default = Input;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbnB1dC9JbnB1dC5qcyJdLCJuYW1lcyI6WyJJbnB1dCIsImluaXRpYWxWYWx1ZXMiLCJwb2xsIiwic3RhdGUiLCJvbkZyYW1lU3RhcnQiLCJsYXRlc3QiLCJwcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7OztJQUVxQkEsSzs7O0FBQ25CLGlCQUFZQyxhQUFaLEVBQTJCQyxJQUEzQixFQUFpQztBQUFBOztBQUFBLGlEQUMvQixnQkFEK0I7O0FBRS9CLFVBQUtDLEtBQUwsR0FBYUYsYUFBYjs7QUFFQSxRQUFJLG1CQUFPQyxJQUFQLENBQUosRUFBa0I7QUFDaEIsWUFBS0UsWUFBTCxHQUFvQjtBQUFBLGVBQU0sTUFBS0MsTUFBTCxDQUFZLE1BQUtILElBQUwsRUFBWixDQUFOO0FBQUEsT0FBcEI7QUFDRDtBQU44QjtBQU9oQzs7QUFFRDs7Ozs7O2tCQUtBRyxNLG1CQUFPQyxLLEVBQU87QUFDWixTQUFLSCxLQUFMLGdCQUFrQixLQUFLQSxLQUF2QixFQUFpQ0csS0FBakM7QUFDRCxHOzs7OztrQkFqQmtCTixLIiwiZmlsZSI6IklucHV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRhc2sgZnJvbSAnLi4vdGFzay9UYXNrJztcbmltcG9ydCB7IGlzRnVuYyB9IGZyb20gJy4uL2luYy91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElucHV0IGV4dGVuZHMgVGFzayB7XG4gIGNvbnN0cnVjdG9yKGluaXRpYWxWYWx1ZXMsIHBvbGwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc3RhdGUgPSBpbml0aWFsVmFsdWVzO1xuXG4gICAgaWYgKGlzRnVuYyhwb2xsKSkge1xuICAgICAgdGhpcy5vbkZyYW1lU3RhcnQgPSAoKSA9PiB0aGlzLmxhdGVzdCh0aGlzLnBvbGwoKSk7XG4gICAgfVxuICB9XG5cbiAgLypcbiAgICBNYW51YWxseSBhZGQgbGF0ZXN0IHZhbHVlc1xuXG4gICAgQHBhcmFtIFtvYmplY3RdXG4gICovXG4gIGxhdGVzdChwcm9wcykge1xuICAgIHRoaXMuc3RhdGUgPSB7IC4uLnRoaXMuc3RhdGUsIC4uLnByb3BzIH07XG4gIH1cbn1cbiJdfQ==