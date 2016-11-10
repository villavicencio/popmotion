'use strict';

exports.__esModule = true;

var _Action2 = require('../actions/Action');

var _Action3 = _interopRequireDefault(_Action2);

var _generateBlendCurve = require('./flow/generate-blend-curve');

var _generateBlendCurve2 = _interopRequireDefault(_generateBlendCurve);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
  Methods and properties to add to bound Actions
*/
var boundOnStart = function (action) {
  return action.flow.activateAction(action.id, action);
};
var boundOnStop = function (action) {
  return action.flow.deactivateAction(action.id);
};
var boundProps = function (flow) {
  return {
    flow: flow,
    isPriority: true,
    onActivate: boundOnStart,
    onDeactivate: boundOnStop
  };
};

var Flow = function (_Action) {
  _inherits(Flow, _Action);

  function Flow(props) {
    _classCallCheck(this, Flow);

    var _this = _possibleConstructorReturn(this, _Action.call(this, props));

    _this.activeActions = {};
    _this.numActiveActions = 0;
    return _this;
  }

  Flow.prototype.set = function set(props) {
    _Action.prototype.set.call(this, props);

    this.once();

    return this;
  };

  /*
    Bind Action to Actor
  */


  Flow.prototype.connect = function connect(action) {
    var inheritedAction = action.inherit();
    var newValues = {};
    var hasNewValues = false;

    // Create values on actor that don't exist
    for (var key in inheritedAction.values) {
      if (inheritedAction.values.hasOwnProperty(key) && !this.values.hasOwnProperty(key)) {
        newValues[key] = inheritedAction.values[key];
        hasNewValues = true;
      }
    }

    if (hasNewValues) {
      this.set({ values: newValues });
    }

    inheritedAction.parentId = action.id;

    return inheritedAction.set(boundProps(this, inheritedAction));
  };

  /*
    Start Actor
     If Action is provided, bind it to this Actor and start
     @param (optional) [Action]
  */


  Flow.prototype.start = function start() {
    _Action.prototype.start.call(this);

    for (var key in this.activeActions) {
      if (this.activeActions.hasOwnProperty(key)) {
        var action = this.activeActions[key];
        if (!action.isActive) {
          action.start();
        }
      }
    }

    return this;
  };

  Flow.prototype.stop = function stop() {
    _Action.prototype.stop.call(this);

    for (var key in this.activeActions) {
      if (this.activeActions.hasOwnProperty(key)) {
        this.activeActions[key].stop();
      }
    }

    return this;
  };

  Flow.prototype.willRender = function willRender(actor, frameStamp, elapsed) {
    for (var i = 0; i < this.numValueKeys; i++) {
      var key = this.valueKeys[i];
      var value = this.values[key];
      var driver = value.numDrivers ? this.activeActions[value.drivers[0]] : false;
      var newCurrent = value.numDrivers ? driver.values[key].current : value.current;

      /**
       * TODO: replace with blend tree resolver
       * Additive motion
       * Bezier tween blend
       */
      if (value.blendCurve) {
        newCurrent = value.blendCurve();
      }

      value.current = newCurrent;
    }

    return _Action.prototype.willRender.call(this, actor, frameStamp, elapsed);
  };

  /*
    Add active actions
     @param [number]
    @param [Action]
  */


  Flow.prototype.activateAction = function activateAction(id, action) {
    this.activeActions[id] = action;
    this.numActiveActions++;

    for (var i = 0; i < action.numValueKeys; i++) {
      var key = action.valueKeys[i];
      var actionValue = action.values[key];
      var value = this.values[key];

      // If we're blending this action, and there's on already in progress
      if (action.blend && value.numDrivers && !value.blendCurve && value.drivers[0].prototype === action.prototype) {
        value.blendCurve = (0, _generateBlendCurve2.default)(this.activeActions[value.drivers[0]], action, value, key);
      } else if (!action.isScrubbing) {
        value.blendCurve = undefined;

        // Pass Actor value properties to Action
        if (actionValue.velocity === 0) {
          actionValue.velocity = value.velocity;
        }

        if (actionValue.from === undefined) {
          actionValue.from = actionValue.current = value.current;
        }
      }

      value.drivers = [id];
      value.numDrivers = value.drivers.length;
    }

    if (this.numActiveActions) {
      _Action.prototype.start.call(this);
    }
  };

  /*
    Remove active actions
     @param [number]
  */


  Flow.prototype.deactivateAction = function deactivateAction(id) {
    var action = this.activeActions[id];

    if (action) {
      for (var i = 0; i < action.numValueKeys; i++) {
        var key = action.valueKeys[i];
        var value = this.values[key];
        var driverIndex = value.drivers.indexOf(id);

        if (driverIndex !== -1) {
          value.drivers.splice(driverIndex, 1);
          value.numDrivers--;
        }
      }

      delete this.activeActions[id];
      this.numActiveActions--;
    }

    if (!this.numActiveActions && this.isActive) {
      _Action.prototype.stop.call(this);
    }
  };

  return Flow;
}(_Action3.default);

Flow.prototype.defaultValue = _Action3.default.extendDefaultValue({
  drivers: [],
  numDrivers: 0
});

exports.default = Flow;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL0Zsb3cuanMiXSwibmFtZXMiOlsiYm91bmRPblN0YXJ0IiwiYWN0aW9uIiwiZmxvdyIsImFjdGl2YXRlQWN0aW9uIiwiaWQiLCJib3VuZE9uU3RvcCIsImRlYWN0aXZhdGVBY3Rpb24iLCJib3VuZFByb3BzIiwiaXNQcmlvcml0eSIsIm9uQWN0aXZhdGUiLCJvbkRlYWN0aXZhdGUiLCJGbG93IiwicHJvcHMiLCJhY3RpdmVBY3Rpb25zIiwibnVtQWN0aXZlQWN0aW9ucyIsInNldCIsIm9uY2UiLCJjb25uZWN0IiwiaW5oZXJpdGVkQWN0aW9uIiwiaW5oZXJpdCIsIm5ld1ZhbHVlcyIsImhhc05ld1ZhbHVlcyIsImtleSIsInZhbHVlcyIsImhhc093blByb3BlcnR5IiwicGFyZW50SWQiLCJzdGFydCIsImlzQWN0aXZlIiwic3RvcCIsIndpbGxSZW5kZXIiLCJhY3RvciIsImZyYW1lU3RhbXAiLCJlbGFwc2VkIiwiaSIsIm51bVZhbHVlS2V5cyIsInZhbHVlS2V5cyIsInZhbHVlIiwiZHJpdmVyIiwibnVtRHJpdmVycyIsImRyaXZlcnMiLCJuZXdDdXJyZW50IiwiY3VycmVudCIsImJsZW5kQ3VydmUiLCJhY3Rpb25WYWx1ZSIsImJsZW5kIiwicHJvdG90eXBlIiwiaXNTY3J1YmJpbmciLCJ1bmRlZmluZWQiLCJ2ZWxvY2l0eSIsImZyb20iLCJsZW5ndGgiLCJkcml2ZXJJbmRleCIsImluZGV4T2YiLCJzcGxpY2UiLCJkZWZhdWx0VmFsdWUiLCJleHRlbmREZWZhdWx0VmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7O0FBR0EsSUFBTUEsZUFBZSxVQUFDQyxNQUFEO0FBQUEsU0FBWUEsT0FBT0MsSUFBUCxDQUFZQyxjQUFaLENBQTJCRixPQUFPRyxFQUFsQyxFQUFzQ0gsTUFBdEMsQ0FBWjtBQUFBLENBQXJCO0FBQ0EsSUFBTUksY0FBYyxVQUFDSixNQUFEO0FBQUEsU0FBWUEs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SUFBMEIsS0FBS2EsUUFBbkMsRUFBNkM7QUFDM0Msd0JBQU1DLElBQU47QUFDRDtBQUNGLEc7Ozs7O0FBR0hqQixLQUFLa0MsU0FBTCxDQUFlUyxZQUFmLEdBQThCLGlCQUFPQyxrQkFBUCxDQUEwQjtBQUN0RGhCLFdBQVMsRUFENkM7QUFFdERELGNBQVk7QUFGMEMsQ0FBMUIsQ0FBOUI7O2tCQUtlM0IsSSIsImZpbGUiOiJGbG93LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFjdGlvbiBmcm9tICcuLi9hY3Rpb25zL0FjdGlvbic7XG5pbXBvcnQgZ2VuZXJhdGVCbGVuZEN1cnZlIGZyb20gJy4vZmxvdy9nZW5lcmF0ZS1ibGVuZC1jdXJ2ZSc7XG5cbi8qXG4gIE1ldGhvZHMgYW5kIHByb3BlcnRpZXMgdG8gYWRkIHRvIGJvdW5kIEFjdGlvbnNcbiovXG5jb25zdCBib3VuZE9uU3RhcnQgPSAoYWN0aW9uKSA9PiBhY3Rpb24uZmxvdy5hY3RpdmF0ZUFjdGlvbihhY3Rpb24uaWQsIGFjdGlvbik7XG5jb25zdCBib3VuZE9uU3RvcCA9IChhY3Rpb24pID0+IGFjdGlvbi5mbG93LmRlYWN0aXZhdGVBY3Rpb24oYWN0aW9uLmlkKTtcbmNvbnN0IGJvdW5kUHJvcHMgPSAoZmxvdykgPT4gKHtcbiAgZmxvdyxcbiAgaXNQcmlvcml0eTogdHJ1ZSxcbiAgb25BY3RpdmF0ZTogYm91bmRPblN0YXJ0LFxuICBvbkRlYWN0aXZhdGU6IGJvdW5kT25TdG9wXG59KTtcblxuY2xhc3MgRmxvdyBleHRlbmRzIEFjdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuYWN0aXZlQWN0aW9ucyA9IHt9O1xuICAgIHRoaXMubnVtQWN0aXZlQWN0aW9ucyA9IDA7XG4gIH1cblxuICBzZXQocHJvcHMpIHtcbiAgICBzdXBlci5zZXQocHJvcHMpO1xuXG4gICAgdGhpcy5vbmNlKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qXG4gICAgQmluZCBBY3Rpb24gdG8gQWN0b3JcbiAgKi9cbiAgY29ubmVjdChhY3Rpb24pIHtcbiAgICBjb25zdCBpbmhlcml0ZWRBY3Rpb24gPSBhY3Rpb24uaW5oZXJpdCgpO1xuICAgIGxldCBuZXdWYWx1ZXMgPSB7fTtcbiAgICBsZXQgaGFzTmV3VmFsdWVzID0gZmFsc2U7XG5cbiAgICAvLyBDcmVhdGUgdmFsdWVzIG9uIGFjdG9yIHRoYXQgZG9uJ3QgZXhpc3RcbiAgICBmb3IgKGxldCBrZXkgaW4gaW5oZXJpdGVkQWN0aW9uLnZhbHVlcykge1xuICAgICAgaWYgKGluaGVyaXRlZEFjdGlvbi52YWx1ZXMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAhdGhpcy52YWx1ZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBuZXdWYWx1ZXNba2V5XSA9IGluaGVyaXRlZEFjdGlvbi52YWx1ZXNba2V5XTtcbiAgICAgICAgaGFzTmV3VmFsdWVzID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFzTmV3VmFsdWVzKSB7XG4gICAgICB0aGlzLnNldCh7IHZhbHVlczogbmV3VmFsdWVzIH0pO1xuICAgIH1cblxuICAgIGluaGVyaXRlZEFjdGlvbi5wYXJlbnRJZCA9IGFjdGlvbi5pZDtcblxuICAgIHJldHVybiBpbmhlcml0ZWRBY3Rpb24uc2V0KGJvdW5kUHJvcHModGhpcywgaW5oZXJpdGVkQWN0aW9uKSk7XG4gIH1cblxuICAvKlxuICAgIFN0YXJ0IEFjdG9yXG5cbiAgICBJZiBBY3Rpb24gaXMgcHJvdmlkZWQsIGJpbmQgaXQgdG8gdGhpcyBBY3RvciBhbmQgc3RhcnRcblxuICAgIEBwYXJhbSAob3B0aW9uYWwpIFtBY3Rpb25dXG4gICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5hY3RpdmVBY3Rpb25zKSB7XG4gICAgICBpZiAodGhpcy5hY3RpdmVBY3Rpb25zLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgY29uc3QgYWN0aW9uID0gdGhpcy5hY3RpdmVBY3Rpb25zW2tleV07XG4gICAgICAgIGlmICghYWN0aW9uLmlzQWN0aXZlKSB7XG4gICAgICAgICAgYWN0aW9uLnN0YXJ0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgc3VwZXIuc3RvcCgpO1xuXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuYWN0aXZlQWN0aW9ucykge1xuICAgICAgaWYgKHRoaXMuYWN0aXZlQWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlQWN0aW9uc1trZXldLnN0b3AoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHdpbGxSZW5kZXIoYWN0b3IsIGZyYW1lU3RhbXAsIGVsYXBzZWQpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubnVtVmFsdWVLZXlzOyBpKyspIHtcbiAgICAgIGNvbnN0IGtleSA9IHRoaXMudmFsdWVLZXlzW2ldO1xuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnZhbHVlc1trZXldO1xuICAgICAgY29uc3QgZHJpdmVyID0gdmFsdWUubnVtRHJpdmVycyA/IHRoaXMuYWN0aXZlQWN0aW9uc1t2YWx1ZS5kcml2ZXJzWzBdXSA6IGZhbHNlO1xuICAgICAgbGV0IG5ld0N1cnJlbnQgPSB2YWx1ZS5udW1Ecml2ZXJzID8gZHJpdmVyLnZhbHVlc1trZXldLmN1cnJlbnQgOiB2YWx1ZS5jdXJyZW50O1xuXG4gICAgICAvKipcbiAgICAgICAqIFRPRE86IHJlcGxhY2Ugd2l0aCBibGVuZCB0cmVlIHJlc29sdmVyXG4gICAgICAgKiBBZGRpdGl2ZSBtb3Rpb25cbiAgICAgICAqIEJlemllciB0d2VlbiBibGVuZFxuICAgICAgICovXG4gICAgICBpZiAodmFsdWUuYmxlbmRDdXJ2ZSkge1xuICAgICAgICBuZXdDdXJyZW50ID0gdmFsdWUuYmxlbmRDdXJ2ZSgpO1xuICAgICAgfVxuXG4gICAgICB2YWx1ZS5jdXJyZW50ID0gbmV3Q3VycmVudDtcbiAgICB9XG5cbiAgICByZXR1cm4gc3VwZXIud2lsbFJlbmRlcihhY3RvciwgZnJhbWVTdGFtcCwgZWxhcHNlZCk7XG4gIH1cblxuICAvKlxuICAgIEFkZCBhY3RpdmUgYWN0aW9uc1xuXG4gICAgQHBhcmFtIFtudW1iZXJdXG4gICAgQHBhcmFtIFtBY3Rpb25dXG4gICovXG4gIGFjdGl2YXRlQWN0aW9uKGlkLCBhY3Rpb24pIHtcbiAgICB0aGlzLmFjdGl2ZUFjdGlvbnNbaWRdID0gYWN0aW9uO1xuICAgIHRoaXMubnVtQWN0aXZlQWN0aW9ucysrO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhY3Rpb24ubnVtVmFsdWVLZXlzOyBpKyspIHtcbiAgICAgIGNvbnN0IGtleSA9IGFjdGlvbi52YWx1ZUtleXNbaV07XG4gICAgICBjb25zdCBhY3Rpb25WYWx1ZSA9IGFjdGlvbi52YWx1ZXNba2V5XTtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy52YWx1ZXNba2V5XTtcblxuICAgICAgLy8gSWYgd2UncmUgYmxlbmRpbmcgdGhpcyBhY3Rpb24sIGFuZCB0aGVyZSdzIG9uIGFscmVhZHkgaW4gcHJvZ3Jlc3NcbiAgICAgIGlmIChhY3Rpb24uYmxlbmQgJiYgdmFsdWUubnVtRHJpdmVycyAmJiAhdmFsdWUuYmxlbmRDdXJ2ZSAmJiAodmFsdWUuZHJpdmVyc1swXS5wcm90b3R5cGUgPT09IGFjdGlvbi5wcm90b3R5cGUpKSB7XG4gICAgICAgIHZhbHVlLmJsZW5kQ3VydmUgPSBnZW5lcmF0ZUJsZW5kQ3VydmUodGhpcy5hY3RpdmVBY3Rpb25zW3ZhbHVlLmRyaXZlcnNbMF1dLCBhY3Rpb24sIHZhbHVlLCBrZXkpO1xuICAgICAgfSBlbHNlIGlmICghYWN0aW9uLmlzU2NydWJiaW5nKSB7XG4gICAgICAgIHZhbHVlLmJsZW5kQ3VydmUgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgLy8gUGFzcyBBY3RvciB2YWx1ZSBwcm9wZXJ0aWVzIHRvIEFjdGlvblxuICAgICAgICBpZiAoYWN0aW9uVmFsdWUudmVsb2NpdHkgPT09IDApIHtcbiAgICAgICAgICBhY3Rpb25WYWx1ZS52ZWxvY2l0eSA9IHZhbHVlLnZlbG9jaXR5O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFjdGlvblZhbHVlLmZyb20gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGFjdGlvblZhbHVlLmZyb20gPSBhY3Rpb25WYWx1ZS5jdXJyZW50ID0gdmFsdWUuY3VycmVudDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YWx1ZS5kcml2ZXJzID0gW2lkXTtcbiAgICAgIHZhbHVlLm51bURyaXZlcnMgPSB2YWx1ZS5kcml2ZXJzLmxlbmd0aDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5udW1BY3RpdmVBY3Rpb25zKSB7XG4gICAgICBzdXBlci5zdGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAgUmVtb3ZlIGFjdGl2ZSBhY3Rpb25zXG5cbiAgICBAcGFyYW0gW251bWJlcl1cbiAgKi9cbiAgZGVhY3RpdmF0ZUFjdGlvbihpZCkge1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuYWN0aXZlQWN0aW9uc1tpZF07XG5cbiAgICBpZiAoYWN0aW9uKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFjdGlvbi5udW1WYWx1ZUtleXM7IGkrKykge1xuICAgICAgICBjb25zdCBrZXkgPSBhY3Rpb24udmFsdWVLZXlzW2ldO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMudmFsdWVzW2tleV07XG4gICAgICAgIGNvbnN0IGRyaXZlckluZGV4ID0gdmFsdWUuZHJpdmVycy5pbmRleE9mKGlkKTtcblxuICAgICAgICBpZiAoZHJpdmVySW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgdmFsdWUuZHJpdmVycy5zcGxpY2UoZHJpdmVySW5kZXgsIDEpO1xuICAgICAgICAgIHZhbHVlLm51bURyaXZlcnMtLTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBkZWxldGUgdGhpcy5hY3RpdmVBY3Rpb25zW2lkXTtcbiAgICAgIHRoaXMubnVtQWN0aXZlQWN0aW9ucy0tO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5udW1BY3RpdmVBY3Rpb25zICYmIHRoaXMuaXNBY3RpdmUpIHtcbiAgICAgIHN1cGVyLnN0b3AoKTtcbiAgICB9XG4gIH1cbn1cblxuRmxvdy5wcm90b3R5cGUuZGVmYXVsdFZhbHVlID0gQWN0aW9uLmV4dGVuZERlZmF1bHRWYWx1ZSh7XG4gIGRyaXZlcnM6IFtdLFxuICBudW1Ecml2ZXJzOiAwXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgRmxvdztcbiJdfQ==