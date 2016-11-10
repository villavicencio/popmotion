'use strict';

exports.__esModule = true;

var _Action2 = require('./Action');

var _Action3 = _interopRequireDefault(_Action2);

var _presetEasing = require('./easing/preset-easing');

var _presetEasing2 = _interopRequireDefault(_presetEasing);

var _utils = require('../inc/utils');

var _calc = require('../inc/calc');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var COUNT = 'Count';
var NEXT_STEPS = {
  loop: 'restart',
  yoyo: 'reverse',
  flip: 'flipValues'
};

var Tween = function (_Action) {
  _inherits(Tween, _Action);

  function Tween() {
    _classCallCheck(this, Tween);

    return _possibleConstructorReturn(this, _Action.apply(this, arguments));
  }

  Tween.prototype.start = function start() {
    this.elapsed = 0;
    this.flipCount = this.yoyoCount = this.loopCount = 0;
    this.isScrubbing = false;

    // Set default `from` if none set
    if (!this.flow) {
      for (var i = 0; i < this.numValueKeys; i++) {
        var key = this.valueKeys[i];
        var value = this.values[key];
        if (value.from === undefined) {
          value.from = 0;
        }
      }
    }

    return _Action.prototype.start.call(this);
  };

  Tween.prototype.onUpdate = function onUpdate(tween, frameStamp, elapsed) {
    var progressTarget = this.playDirection === 1 ? 1 : 0;

    this.ended = true;

    if (!this.isScrubbing) {
      this.elapsed += elapsed * this.dilate * this.playDirection;
    }

    for (var i = 0; i < this.numValueKeys; i++) {
      var key = this.valueKeys[i];
      var value = this.values[key];

      var progress = (0, _calc.restrict)((0, _calc.getProgressFromValue)(this.elapsed - value.delay, 0, value.duration), 0, 1);

      // Mark Tween as NOT ended if still in progress
      if (progress !== progressTarget) {
        this.ended = false;
      }

      // Step progress if we're stepping
      if (value.steps) {
        progress = (0, _calc.stepProgress)(progress, value.steps);
      }

      // Ease progress
      value.current = (0, _calc.ease)(progress, value.from, value.to, value.ease);
    }
  };

  Tween.prototype.onFrameEnd = function onFrameEnd() {
    if (this.ended) {
      var stepTaken = false;

      for (var key in NEXT_STEPS) {
        if (NEXT_STEPS.hasOwnProperty(key)) {
          if ((0, _utils.isNum)(this[key]) && this[key] > this[key + COUNT]) {
            this[key + COUNT]++;
            stepTaken = true;
            this[NEXT_STEPS[key]]();
          }
        }
      }

      if (!stepTaken) {
        this.complete();
      }
    }
  };

  Tween.prototype.flipValues = function flipValues() {
    var values = this.values;

    this.elapsed = this.duration - this.elapsed;

    for (var key in values) {
      if (values.hasOwnProperty(key)) {
        var value = values[key];
        var _ref = [value.from, value.to];
        value.to = _ref[0];
        value.from = _ref[1];
      }
    }

    return this;
  };

  Tween.prototype.reverse = function reverse() {
    this.playDirection *= -1;
    return this;
  };

  Tween.prototype.restart = function restart() {
    this.elapsed = this.playDirection === 1 ? 0 : this.duration;
    this.started = (0, _utils.currentTime)();
    return this;
  };

  Tween.prototype.seek = function seek(progress) {
    this.seekTime(this.duration * progress);
    return this;
  };

  Tween.prototype.seekTime = function seekTime(elapsed) {
    if (!this.isActive || this.isScrubbing) {
      this.once();
      this.isScrubbing = true;
    }

    this.elapsed = elapsed;

    return this;
  };

  return Tween;
}(_Action3.default);

Tween.prototype.defaultValueProp = 'to';
Tween.prototype.defaultValue = _Action3.default.extendDefaultValue({
  delay: 0,
  duration: 300,
  ease: _presetEasing2.default.easeOut,
  elapsed: 0,
  steps: 0,
  to: 0,
  round: false
});
Tween.prototype.defaultProps = _Action3.default.extendDefaultProps({
  blend: false,
  dilate: 1,
  loop: 0,
  yoyo: 0,
  flip: 0,
  loopCount: 0,
  yoyoCount: 0,
  flipCount: 0,
  playDirection: 1,
  isScrubbing: false,
  ended: false,
  elapsed: 0
});

exports.default = Tween;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL1R3ZWVuLmpzIl0sIm5hbWVzIjpbIkNPVU5UIiwiTkVYVF9TVEVQUyIsImxvb3AiLCJ5b3lvIiwiZmxpcCIsIlR3ZWVuIiwic3RhcnQiLCJlbGFwc2VkIiwiZmxpcENvdW50IiwieW95b0NvdW50IiwibG9vcENvdW50IiwiaXNTY3J1YmJpbmciLCJmbG93IiwiaSIsIm51bVZhbHVlS2V5cyIsImtleSIsInZhbHVlS2V5cyIsInZhbHVlIiwidmFsdWVzIiwiZnJvbSIsInVuZGVmaW5lZCIsIm9uVXBkYXRlIiwidHdlZW4iLCJmcmFtZVN0YW1wIiwicHJvZ3Jlc3NUYXJnZXQiLCJwbGF5RGlyZWN0aW9uIiwiZW5kZWQiLCJkaWxhdGUiLCJwcm9ncmVzcyIsImRlbGF5IiwiZHVyYXRpb24iLCJzdGVwcyIsImN1cnJlbnQiLCJ0byIsImVhc2UiLCJvbkZyYW1lRW5kIiwic3RlcFRha2VuIiwiaGFzT3duUHJvcGVydHkiLCJjb21wbGV0ZSIsImZsaXBWYWx1ZXMiLCJyZXZlcnNlIiwicmVzdGFydCIsInN0YXJ0ZWQiLCJzZWVrIiwic2Vla1RpbWUiLCJpc0FjdGl2ZSIsIm9uY2UiLCJwcm90b3R5cGUiLCJkZWZhdWx0VmFsdWVQcm9wIiwiZGVmYXVsdFZhbHVlIiwiZXh0ZW5kRGVmYXVsdFZhbHVlIiwiZWFzZU91dCIsInJvdW5kIiwiZGVmYXVsdFByb3BzIiwiZXh0ZW5kRGVmYXVsdFByb3BzIiwiYmxlbmQiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxRQUFRLE9BQWQ7QUFDQSxJQUFNQyxhQUFhO0FBQ2pCQyxRQUFNLFNBRFc7QUFFakJDLFFBQU0sU0FGVztBQUdqQkMsUUFBTTtBQUhXLENBQW5COztJQU1NQyxLOzs7Ozs7Ozs7a0JBQ0pDLEssb0JBQVE7QUFDTixTQUFLQyxPQUFMLEdBQWUsQ0FBZjtBQUNBLFNBQUtDLFNBQUwsR0FBaUIsS0FBS0MsU0FB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dkRDLFNBQU8sS0FEZ0Q7QUFFdkQ1QixVQUFRLENBRitDO0FBR3ZEekIsUUFBTSxDQUhpRDtBQUl2REMsUUFBTSxDQUppRDtBQUt2REMsUUFBTSxDQUxpRDtBQU12RE0sYUFBVyxDQU40QztBQU92REQsYUFBVyxDQVA0QztBQVF2REQsYUFBVyxDQVI0QztBQVN2RGlCLGlCQUFlLENBVHdDO0FBVXZEZCxlQUFhLEtBVjBDO0FBV3ZEZSxTQUFPLEtBWGdEO0FBWXZEbkIsV0FBUztBQVo4QyxDQUExQixDQUEvQjs7a0JBZWVGLEsiLCJmaWxlIjoiVHdlZW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWN0aW9uIGZyb20gJy4vQWN0aW9uJztcbmltcG9ydCBlYXNpbmcgZnJvbSAnLi9lYXNpbmcvcHJlc2V0LWVhc2luZyc7XG5pbXBvcnQgeyBjdXJyZW50VGltZSwgaXNOdW0gfSBmcm9tICcuLi9pbmMvdXRpbHMnO1xuaW1wb3J0IHsgZWFzZSwgcmVzdHJpY3QsIGdldFByb2dyZXNzRnJvbVZhbHVlLCBzdGVwUHJvZ3Jlc3MgfSBmcm9tICcuLi9pbmMvY2FsYyc7XG5cbmNvbnN0IENPVU5UID0gJ0NvdW50JztcbmNvbnN0IE5FWFRfU1RFUFMgPSB7XG4gIGxvb3A6ICdyZXN0YXJ0JyxcbiAgeW95bzogJ3JldmVyc2UnLFxuICBmbGlwOiAnZmxpcFZhbHVlcydcbn07XG5cbmNsYXNzIFR3ZWVuIGV4dGVuZHMgQWN0aW9uIHtcbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5lbGFwc2VkID0gMDtcbiAgICB0aGlzLmZsaXBDb3VudCA9IHRoaXMueW95b0NvdW50ID0gdGhpcy5sb29wQ291bnQgPSAwO1xuICAgIHRoaXMuaXNTY3J1YmJpbmcgPSBmYWxzZTtcblxuICAgIC8vIFNldCBkZWZhdWx0IGBmcm9tYCBpZiBub25lIHNldFxuICAgIGlmICghdGhpcy5mbG93KSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubnVtVmFsdWVLZXlzOyBpKyspIHtcbiAgICAgICAgY29uc3Qga2V5ID0gdGhpcy52YWx1ZUtleXNbaV07XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy52YWx1ZXNba2V5XTtcbiAgICAgICAgaWYgKHZhbHVlLmZyb20gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhbHVlLmZyb20gPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1cGVyLnN0YXJ0KCk7XG4gIH1cblxuICBvblVwZGF0ZSh0d2VlbiwgZnJhbWVTdGFtcCwgZWxhcHNlZCkge1xuICAgIGNvbnN0IHByb2dyZXNzVGFyZ2V0ID0gKHRoaXMucGxheURpcmVjdGlvbiA9PT0gMSkgPyAxIDogMDtcblxuICAgIHRoaXMuZW5kZWQgPSB0cnVlO1xuXG4gICAgaWYgKCF0aGlzLmlzU2NydWJiaW5nKSB7XG4gICAgICB0aGlzLmVsYXBzZWQgKz0gKGVsYXBzZWQgKiB0aGlzLmRpbGF0ZSkgKiB0aGlzLnBsYXlEaXJlY3Rpb247XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm51bVZhbHVlS2V5czsgaSsrKSB7XG4gICAgICBjb25zdCBrZXkgPSB0aGlzLnZhbHVlS2V5c1tpXTtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy52YWx1ZXNba2V5XTtcblxuICAgICAgbGV0IHByb2dyZXNzID0gcmVzdHJpY3QoZ2V0UHJvZ3Jlc3NGcm9tVmFsdWUodGhpcy5lbGFwc2VkIC0gdmFsdWUuZGVsYXksIDAsIHZhbHVlLmR1cmF0aW9uKSwgMCwgMSk7XG5cbiAgICAgIC8vIE1hcmsgVHdlZW4gYXMgTk9UIGVuZGVkIGlmIHN0aWxsIGluIHByb2dyZXNzXG4gICAgICBpZiAocHJvZ3Jlc3MgIT09IHByb2dyZXNzVGFyZ2V0KSB7XG4gICAgICAgIHRoaXMuZW5kZWQgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gU3RlcCBwcm9ncmVzcyBpZiB3ZSdyZSBzdGVwcGluZ1xuICAgICAgaWYgKHZhbHVlLnN0ZXBzKSB7XG4gICAgICAgIHByb2dyZXNzID0gc3RlcFByb2dyZXNzKHByb2dyZXNzLCB2YWx1ZS5zdGVwcyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEVhc2UgcHJvZ3Jlc3NcbiAgICAgIHZhbHVlLmN1cnJlbnQgPSBlYXNlKHByb2dyZXNzLCB2YWx1ZS5mcm9tLCB2YWx1ZS50bywgdmFsdWUuZWFzZSk7XG4gICAgfVxuICB9XG5cbiAgb25GcmFtZUVuZCgpIHtcbiAgICBpZiAodGhpcy5lbmRlZCkge1xuICAgICAgbGV0IHN0ZXBUYWtlbiA9IGZhbHNlO1xuXG4gICAgICBmb3IgKGxldCBrZXkgaW4gTkVYVF9TVEVQUykge1xuICAgICAgICBpZiAoTkVYVF9TVEVQUy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgaWYgKGlzTnVtKHRoaXNba2V5XSkgJiYgdGhpc1trZXldID4gdGhpc1trZXkgKyBDT1VOVF0pIHtcbiAgICAgICAgICAgIHRoaXNba2V5ICsgQ09VTlRdKys7XG4gICAgICAgICAgICBzdGVwVGFrZW4gPSB0cnVlO1xuICAgICAgICAgICAgdGhpc1tORVhUX1NURVBTW2tleV1dKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghc3RlcFRha2VuKSB7XG4gICAgICAgIHRoaXMuY29tcGxldGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmbGlwVmFsdWVzKCkge1xuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMudmFsdWVzO1xuXG4gICAgdGhpcy5lbGFwc2VkID0gdGhpcy5kdXJhdGlvbiAtIHRoaXMuZWxhcHNlZDtcblxuICAgIGZvciAobGV0IGtleSBpbiB2YWx1ZXMpIHtcbiAgICAgIGlmICh2YWx1ZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHZhbHVlc1trZXldO1xuICAgICAgICBbdmFsdWUudG8sIHZhbHVlLmZyb21dID0gW3ZhbHVlLmZyb20sIHZhbHVlLnRvXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJldmVyc2UoKSB7XG4gICAgdGhpcy5wbGF5RGlyZWN0aW9uICo9IC0xO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmVzdGFydCgpIHtcbiAgICB0aGlzLmVsYXBzZWQgPSAodGhpcy5wbGF5RGlyZWN0aW9uID09PSAxKSA/IDAgOiB0aGlzLmR1cmF0aW9uO1xuICAgIHRoaXMuc3RhcnRlZCA9IGN1cnJlbnRUaW1lKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZWVrKHByb2dyZXNzKSB7XG4gICAgdGhpcy5zZWVrVGltZSh0aGlzLmR1cmF0aW9uICogcHJvZ3Jlc3MpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2Vla1RpbWUoZWxhcHNlZCkge1xuICAgIGlmICghdGhpcy5pc0FjdGl2ZSB8fCB0aGlzLmlzU2NydWJiaW5nKSB7XG4gICAgICB0aGlzLm9uY2UoKTtcbiAgICAgIHRoaXMuaXNTY3J1YmJpbmcgPSB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMuZWxhcHNlZCA9IGVsYXBzZWQ7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG5Ud2Vlbi5wcm90b3R5cGUuZGVmYXVsdFZhbHVlUHJvcCA9ICd0byc7XG5Ud2Vlbi5wcm90b3R5cGUuZGVmYXVsdFZhbHVlID0gQWN0aW9uLmV4dGVuZERlZmF1bHRWYWx1ZSh7XG4gIGRlbGF5OiAwLFxuICBkdXJhdGlvbjogMzAwLFxuICBlYXNlOiBlYXNpbmcuZWFzZU91dCxcbiAgZWxhcHNlZDogMCxcbiAgc3RlcHM6IDAsXG4gIHRvOiAwLFxuICByb3VuZDogZmFsc2Vcbn0pO1xuVHdlZW4ucHJvdG90eXBlLmRlZmF1bHRQcm9wcyA9IEFjdGlvbi5leHRlbmREZWZhdWx0UHJvcHMoe1xuICBibGVuZDogZmFsc2UsXG4gIGRpbGF0ZTogMSxcbiAgbG9vcDogMCxcbiAgeW95bzogMCxcbiAgZmxpcDogMCxcbiAgbG9vcENvdW50OiAwLFxuICB5b3lvQ291bnQ6IDAsXG4gIGZsaXBDb3VudDogMCxcbiAgcGxheURpcmVjdGlvbjogMSxcbiAgaXNTY3J1YmJpbmc6IGZhbHNlLFxuICBlbmRlZDogZmFsc2UsXG4gIGVsYXBzZWQ6IDBcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBUd2VlbjtcbiJdfQ==