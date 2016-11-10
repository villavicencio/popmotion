'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Task2 = require('../task/Task');

var _Task3 = _interopRequireDefault(_Task2);

var _calc = require('../inc/calc');

var _utils = require('../inc/utils');

var _detect = require('../value-types/detect');

var _detect2 = _interopRequireDefault(_detect);

var _numericalValues = require('../inc/numerical-values');

var _numericalValues2 = _interopRequireDefault(_numericalValues);

var _detectAdapter = require('../inc/detect-adapter');

var _detectAdapter2 = _interopRequireDefault(_detectAdapter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NUM_NUMERICAL_VALUES = _numericalValues2.default.length;

var defaultRenderer = function (_ref) {
  var state = _ref.state,
      adapter = _ref.adapter,
      adapterData = _ref.adapterData,
      element = _ref.element;
  return adapter(element, state, adapterData);
};

var convertIfShouldBeNumber = function (value) {
  return !isNaN(value) ? parseFloat(value) : value;
};

var Action = function (_Task) {
  _inherits(Action, _Task);

  function Action() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Action);

    props.state = {};
    props.valueKeys = [];
    props.parentKeys = [];
    return _possibleConstructorReturn(this, _Task.call(this, props));
  }

  /*
    # Set Action properties
    ## Set user-defined Action properties
     @param [object]
    @return [Action]
  */


  Action.prototype.set = function set() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.values = this.values || {};

    var values = props.values,
        propsToSet = _objectWithoutProperties(props, ['values']);

    var inheritable = {};

    // Set non-consumed properties
    _Task.prototype.set.call(this, propsToSet);

    // Detect correct `adapter` if none exists and `element` is being set
    if (this.element) {
      if (!this.adapter) {
        // Ducktypish check for Adapter
        this.adapter = (0, _detectAdapter2.default)(this.element);

        if (this.adapter.getElementData) {
          this.adapterData = this.adapter.getElementData(this.element);
        }
      }

      if (!this.onRender) {
        this.onRender = defaultRenderer;
      }
    }

    // Prime an object to inherit from, with only `value` properties
    for (var key in this.defaultValue) {
      if (this.defaultValue.hasOwnProperty(key)) {
        if (propsToSet.hasOwnProperty(key)) {
          inheritable[key] = propsToSet[key];
        } else if (this[key] !== undefined) {
          inheritable[key] = this[key];
        }
      }
    }

    // Update existing values with inheritable properties
    for (var _key in this.values) {
      if (this.values.hasOwnProperty(_key)) {
        this.values[_key] = _extends({}, this.values[_key], inheritable);
      }
    }

    // Update
    if (values) {
      this.setValues(values, inheritable);

      // Precompute number of value key and parent keys to avoid per-frame measurement
      this.numValueKeys = this.valueKeys.length;
      this.numParentKeys = this.parentKeys.length;
    }

    return this;
  };

  Action.prototype.setValues = function setValues(values, inherit) {
    // Iterate over all incoming values and set
    for (var key in values) {
      if (values.hasOwnProperty(key)) {
        var hasChildren = false;
        var children = {};

        // Merge into existing value or create new
        var valueAlreadyExists = this.values[key] !== undefined;
        var newValue = valueAlreadyExists ? _extends({}, this.values[key]) : _extends({}, inherit);

        // If values is not an object, assign value to default prop
        if (!(0, _utils.isObj)(values[key])) {
          newValue[this.defaultValueProp] = values[key];
        } else {
          newValue = _extends({}, newValue, values[key]);
        }

        // If we've got an adapter, get the current value
        if (newValue.current === undefined) {
          if (this.adapter) {
            newValue.current = convertIfShouldBeNumber(this.adapter.get(this.element, key));
          }
        }

        if (newValue.from === undefined && this.adapter) {
          newValue.from = newValue.current;
        }

        // Apply default value properties
        if (!valueAlreadyExists) {
          newValue = _extends({}, this.defaultValue, newValue);
        }

        // If we don't have a value type and we do have an Adapter, check for type with value key
        if (!newValue.type && this.adapter && this.adapter.checkValueType) {
          newValue.type = this.adapter.checkValueType(key);
        }

        // If we still don't have a value type and this is the first time we've set this value, check numerical values for strings and test
        if (!newValue.type && !this.values[key]) {
          newValue.type = (0, _detect2.default)(newValue);
        }

        // If we have a value type, handle. This is my least favourite part of Popmotion, so... enjoy.
        if (newValue.type) {
          for (var i = 0; i < NUM_NUMERICAL_VALUES; i++) {
            var propName = _numericalValues2.default[i];
            var valueProp = newValue[propName];

            // If this prop is a string and we have a splitter, split
            if (newValue.type.hasOwnProperty('split')) {
              var splitProp = (0, _utils.isString)(valueProp) ? newValue.type.split(valueProp) : {};

              for (var splitKey in splitProp) {
                if (splitProp.hasOwnProperty(splitKey)) {
                  var combinedKey = key + splitKey;

                  // If we don't have a child value for this key, make one
                  if (!children[combinedKey]) {
                    var defaultValue = newValue.type.defaultProps && newValue.type.defaultProps[splitKey] ? newValue.type.defaultProps[splitKey] : newValue.type.defaultProps || {};

                    children[combinedKey] = _extends({}, newValue, defaultValue, {
                      parent: key,
                      childKey: splitKey
                    });

                    delete children[combinedKey].type;
                  }

                  hasChildren = true;
                  children[combinedKey][propName] = parseFloat(splitProp[splitKey]);
                }
              }

              // If we have a template function, generate
              if (!newValue.template && newValue.type.template && (0, _utils.isString)(valueProp)) {
                newValue.template = newValue.type.template(valueProp);
              }
            } else if (newValue.type.defaultProps) {
              newValue = _extends({}, newValue.type.defaultProps, newValue);

              // This is a bit of a hack - this entire function is a hack. Sorry future self. I look forward to scrapping the lot of it.
              if (newValue.type.defaultProps.type) {
                newValue.type = newValue.type.defaultProps.type;
              }
            }

            if (valueProp !== undefined && newValue.type.parse) {
              newValue[propName] = newValue.type.parse(valueProp, newValue);
            }
          }
        } // End value type nonsense

        // Set `prev` to `current` for first frame after set
        newValue.prev = newValue.current;

        // If this value doesn't have children, add to valueKeys
        if (!hasChildren) {
          if (this.valueKeys.indexOf(key) === -1) {
            this.valueKeys.push(key);
          }

          // Or add to parentKeys
        } else {
          newValue.children = newValue.children || {};

          if (this.parentKeys.indexOf(key) === -1) {
            this.parentKeys.push(key);
          }

          this.setValues(children);
        }

        this.values[key] = newValue;
      }
    }
  };

  /*
    Decide whether this Action will render on next frame
     @param [Action]
    @param [number]
    @param [number]
    @return [boolean]: Return true to render
  */


  Action.prototype.willRender = function willRender(action, frameStamp, elapsed) {
    var hasChanged = false;

    // Check if base values have updated 
    for (var i = 0; i < this.numValueKeys; i++) {
      var key = this.valueKeys[i];
      var value = this.values[key];

      // Run transform function (if present)
      if (value.transform) {
        value.current = value.transform(value.current, key, this);
      }

      // Cap minimum
      if ((0, _utils.isNum)(value.min)) {
        value.current = Math.max(value.current, value.min);
      }

      // Cap maximum
      if ((0, _utils.isNum)(value.max)) {
        value.current = Math.min(value.current, value.max);
      }

      // Round number
      if (value.round) {
        value.current = Math.round(value.current);
      }

      value.frameChange = value.current - value.prev;

      // Update velocity
      if (!this.calculatesVelocity) {
        value.velocity = (0, _calc.speedPerSecond)(value.frameChange, elapsed);
      }

      // If this value has changed
      if (value.prev !== value.current) {
        hasChanged = true;
        value.prev = value.current;
      }

      // Append unit
      var valueForState = value.type && value.type.serialize ? value.type.serialize(value.current, value) : value.current;

      // Add to state if this is not a child vaue
      if (!value.parent) {
        this.state[key] = valueForState;
      } else {
        this.values[value.parent].children[value.childKey] = valueForState;
      }
    }

    // Update parent values
    for (var _i = 0; _i < this.numParentKeys; _i++) {
      var _key2 = this.parentKeys[_i];
      var _value = this.values[_key2];

      _value.current = _value.type.combine(_value.children, _value.template);

      this.state[_key2] = _value.current;
    }

    if (this.onFrame) {
      this.onFrame(this.state, this);
    }

    return this.onCleanup ? true : hasChanged;
  };

  Action.prototype.inherit = function inherit() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var values = props.values,
        propsToSet = _objectWithoutProperties(props, ['values']);

    var newAction = _Task.prototype.inherit.call(this, propsToSet);

    if (values) {
      newAction.set({ values: values });
    }

    return newAction;
  };

  Action.prototype.pause = function pause() {
    _Task.prototype.stop.call(this);
    return this;
  };

  Action.prototype.resume = function resume() {
    _Task.prototype.start.call(this);
    return this;
  };

  Action.prototype.toggle = function toggle() {
    return this.isActive ? this.pause() : this.resume();
  };

  Action.prototype.start = function start() {
    var values = this.values;
    _Task.prototype.start.call(this);

    for (var key in values) {
      if (values.hasOwnProperty(key)) {
        values[key].prev = values[key].origin = values[key].current;
      }
    }

    return this;
  };

  Action.extendDefaultValue = function extendDefaultValue(props) {
    return _extends({}, this.prototype.defaultValue, props);
  };

  Action.extendDefaultProps = function extendDefaultProps(props) {
    return _extends({}, this.prototype.defaultProps, props);
  };

  return Action;
}(_Task3.default);

Action.prototype.defaultValueProp = 'current';
Action.prototype.defaultValue = {
  velocity: 0,
  round: false,
  min: undefined,
  max: undefined,
  transform: undefined
};

exports.default = Action;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL0FjdGlvbi5qcyJdLCJuYW1lcyI6WyJOVU1fTlVNRVJJQ0FMX1ZBTFVFUyIsImxlbmd0aCIsImRlZmF1bHRSZW5kZXJlciIsInN0YXRlIiwiYWRhcHRlciIsImFkYXB0ZXJEYXRhIiwiZWxlbWVudCIsImNvbnZlcnRJZlNob3VsZEJlTnVtYmVyIiwidmFsdWUiLCJpc05hTiIsInBhcnNlRmxvYXQiLCJBY3Rpb24iLCJwcm9wcyIsInZhbHVlS2V5cyIsInBhcmVudEtleXMiLCJzZXQiLCJ2YWx1ZXMiLCJwcm9wc1RvU2V0IiwiaW5oZXJpdGFibGUiLCJnZXRFbGVtZW50RGF0YSIsIm9uUmVuZGVyIiwia2V5IiwiZGVmYXVsdFZhbHVlIiwiaGFzT3duUHJvcGVydHkiLCJ1bmRlZmluZWQiLCJzZXRWYWx1ZXMiLCJudW1WYWx1ZUtleXMiLCJudW1QYXJlbnRLZXlzIiwiaW5oZXJpdCIsImhhc0NoaWxkcmVuIiwiY2hpbGRyZW4iLCJ2YWx1ZUFscmVhZHlFeGlzdHMiLCJuZXdWYWx1ZSIsImRlZmF1bHRWYWx1ZVByb3AiLCJjdXJyZW50IiwiZ2V0IiwiZnJvbSIsInR5cGUiLCJjaGVja1ZhbHVlVHlwZSIsImkiLCJwcm9wTmFtZSIsInZhbHVlUHJvcCIsInNwbGl0UHJvcCIsInNwbGl0Iiwic3BsaXRLZXkiLCJjb21iaW5lZEtleSIsImRlZmF1bHRQcm9wcyIsInBhcmVudCIsImNoaWxkS2V5IiwidGVtcGxhdGUiLCJwYXJzZSIsInByZXYiLCJpbmRleE9mIiwicHVzaCIsIndpbGxSZW5kZXIiLCJhY3Rpb24iLCJmcmFtZVN0YW1wIiwiZWxhcHNlZCIsImhhc0NoYW5nZWQiLCJ0cmFuc2Zvcm0iLCJtaW4iLCJNYXRoIiwibWF4Iiwicm91bmQiLCJmcmFtZUNoYW5nZSIsImNhbGN1bGF0ZXNWZWxvY2l0eSIsInZlbG9jaXR5IiwidmFsdWVGb3JTdGF0ZSIsInNlcmlhbGl6ZSIsImNvbWJpbmUiLCJvbkZyYW1lIiwib25DbGVhbnVwIiwibmV3QWN0aW9uIiwicGF1c2UiLCJzdG9wIiwicmVzdW1lIiwic3RhcnQiLCJ0b2dnbGUiLCJpc0FjdGl2ZSIsIm9yaWdpbiIsImV4dGVuZERlZmF1bHRWYWx1ZSIsInByb3RvdHlwZSIsImV4dGVuZERlZmF1bHRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsdUJBQXVCLDBCQUFpQkMsTUFBOUM7O0FBRUEsSUFBTUMsa0JBQWtCO0FBQUEsTUFBR0MsS0FBSCxRQUFHQSxLQUFIO0FBQUEsTUFBVUMsT0FBVixRQUFVQSxPQUFWO0FBQUEsTUFBbUJDLFdBQW5CLFFBQW1CQSxXQUFuQjtBQUFBLE1BQWdDQyxPQUFoQyxRQUFnQ0EsT0FBaEM7QUFBQSxTQUE4Q0YsUUFBUUUsT0FBUixFQUFpQkgsS0FBakIsRUFBd0JFLFdBQXhCLENBQTlDO0FBQUEsQ0FBeEI7O0FBRUEsSUFBTUUsMEJBQTBCLFVBQUNDLEtBQUQ7QUFBQSxTQUFXLENBQUNDLE1BQU1ELEtBQU4sQ0FBRCxHQUFnQkUsV0FBV0YsS0FBWCxDQUFoQixHQUFvQ0EsS0FBL0M7QUFBQSxDQUFoQzs7SUFFTUcsTTs7O0FBQ0osb0JBQXdCO0FBQUEsUUFBWkMsS0FBWSx1RUFBSixFQUFJOztBQUFBOztBQUN0QkEsVUFBTVQsS0FBTixHQUFjLEVBQWQ7QUFDQVMsVUFBTUMsU0FBTixHQUFrQixFQUFsQjtBQUNBRCxVQUFNRSxVQUFOLEdBQW1CLEVBQW5CO0FBSHNCLDRDQUl0QixpQkFBTUYsS0FBTixDQUpzQjtBQUt2Qjs7QUFFRDs7Ozs7Ozs7bUJBT0FHLEcsa0JBQWdCO0FBQUEsUUFBWkgsS0FBWSx1RUFBSixFQUFJOztBQUNkLFNBQUtJLE1BQUwsR0FBYyxLQUFLQSxNQUFMLElBQWUsRUFBN0I7O0FBRGMsUUFHTkEsTUFITSxHQUdvQkosS0FIcEIsQ0FHTkksTUFITTtBQUFBLFFBR0tDLFVBSEwsNEJBR29CTCxLQUhwQjs7QUFJ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Q0EsV0FBTyxJQUFQO0FBQ0QsRzs7bUJBRURDLE0scUJBQVM7QUFDUCxvQkFBTUMsS0FBTjtBQUNBLFdBQU8sSUFBUDtBQUNELEc7O21CQUVEQyxNLHFCQUFTO0FBQ1AsV0FBTyxLQUFLQyxRQUFMLEdBQWdCLEtBQUtMLEtBQUwsRUFBaEIsR0FBK0IsS0FBS0UsTUFBTCxFQUF0QztBQUNELEc7O21CQUVEQyxLLG9CQUFRO0FBQ04sUUFBTTVELFNBQVMsS0FBS0EsTUFBcEI7QUFDQSxvQkFBTTRELEtBQU47O0FBRUEsU0FBSyxJQUFJdkQsR0FBVCxJQUFnQkwsTUFBaEIsRUFBd0I7QUFDdEIsVUFBSUEsT0FBT08sY0FBUCxDQUFzQkYsR0FBdEIsQ0FBSixFQUFnQztBQUM5QkwsZUFBT0ssR0FBUCxFQUFZOEIsSUFBWixHQUFtQm5DLE9BQU9LLEdBQVAsRUFBWTBELE1BQVosR0FBcUIvRCxPQUFPSyxHQUFQLEVBQVlhLE9BQXBEO0FBQ0Q7QUFDRjs7QUFFRCxXQUFPLElBQVA7QUFDRCxHOztTQUVNOEMsa0IsK0JBQW1CcEUsSyxFQUFPO0FBQy9CLHdCQUFZLEtBQUtxRSxTQUFMLENBQWUzRCxZQUEzQixFQUE0Q1YsS0FBNUM7QUFDRCxHOztTQUVNc0Usa0IsK0JBQW1CdEUsSyxFQUFPO0FBQy9CLHdCQUFZLEtBQUtxRSxTQUFMLENBQWVuQyxZQUEzQixFQUE0Q2xDLEtBQTVDO0FBQ0QsRzs7Ozs7QUFHSEQsT0FBT3NFLFNBQVAsQ0FBaUJoRCxnQkFBakIsR0FBb0MsU0FBcEM7QUFDQXRCLE9BQU9zRSxTQUFQLENBQWlCM0QsWUFBakIsR0FBZ0M7QUFDOUI0QyxZQUFVLENBRG9CO0FBRTlCSCxTQUFPLEtBRnVCO0FBRzlCSCxPQUFLcEMsU0FIeUI7QUFJOUJzQyxPQUFLdEMsU0FKeUI7QUFLOUJtQyxhQUFXbkM7QUFMbUIsQ0FBaEM7O2tCQVFlYixNIiwiZmlsZSI6IkFjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUYXNrIGZyb20gJy4uL3Rhc2svVGFzayc7XG5pbXBvcnQgeyBzcGVlZFBlclNlY29uZCB9IGZyb20gJy4uL2luYy9jYWxjJztcbmltcG9ydCB7IGlzTnVtLCBpc09iaiwgaXNTdHJpbmcgfSBmcm9tICcuLi9pbmMvdXRpbHMnO1xuaW1wb3J0IGRldGVjdFZhbHVlVHlwZSBmcm9tICcuLi92YWx1ZS10eXBlcy9kZXRlY3QnO1xuaW1wb3J0IE5VTUVSSUNBTF9WQUxVRVMgZnJvbSAnLi4vaW5jL251bWVyaWNhbC12YWx1ZXMnO1xuaW1wb3J0IGRldGVjdEFkYXB0ZXIgZnJvbSAnLi4vaW5jL2RldGVjdC1hZGFwdGVyJztcblxuY29uc3QgTlVNX05VTUVSSUNBTF9WQUxVRVMgPSBOVU1FUklDQUxfVkFMVUVTLmxlbmd0aDtcblxuY29uc3QgZGVmYXVsdFJlbmRlcmVyID0gKHsgc3RhdGUsIGFkYXB0ZXIsIGFkYXB0ZXJEYXRhLCBlbGVtZW50IH0pID0+IGFkYXB0ZXIoZWxlbWVudCwgc3RhdGUsIGFkYXB0ZXJEYXRhKTtcblxuY29uc3QgY29udmVydElmU2hvdWxkQmVOdW1iZXIgPSAodmFsdWUpID0+ICFpc05hTih2YWx1ZSkgPyBwYXJzZUZsb2F0KHZhbHVlKSA6IHZhbHVlO1xuXG5jbGFzcyBBY3Rpb24gZXh0ZW5kcyBUYXNrIHtcbiAgY29uc3RydWN0b3IocHJvcHMgPSB7fSkge1xuICAgIHByb3BzLnN0YXRlID0ge307XG4gICAgcHJvcHMudmFsdWVLZXlzID0gW107XG4gICAgcHJvcHMucGFyZW50S2V5cyA9IFtdO1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuXG4gIC8qXG4gICAgIyBTZXQgQWN0aW9uIHByb3BlcnRpZXNcbiAgICAjIyBTZXQgdXNlci1kZWZpbmVkIEFjdGlvbiBwcm9wZXJ0aWVzXG5cbiAgICBAcGFyYW0gW29iamVjdF1cbiAgICBAcmV0dXJuIFtBY3Rpb25dXG4gICovXG4gIHNldChwcm9wcyA9IHt9KSB7XG4gICAgdGhpcy52YWx1ZXMgPSB0aGlzLnZhbHVlcyB8fCB7fTtcblxuICAgIGNvbnN0IHsgdmFsdWVzLCAuLi5wcm9wc1RvU2V0IH0gPSBwcm9wcztcbiAgICBjb25zdCBpbmhlcml0YWJsZSA9IHt9O1xuXG4gICAgLy8gU2V0IG5vbi1jb25zdW1lZCBwcm9wZXJ0aWVzXG4gICAgc3VwZXIuc2V0KHByb3BzVG9TZXQpO1xuXG4gICAgLy8gRGV0ZWN0IGNvcnJlY3QgYGFkYXB0ZXJgIGlmIG5vbmUgZXhpc3RzIGFuZCBgZWxlbWVudGAgaXMgYmVpbmcgc2V0XG4gICAgaWYgKHRoaXMuZWxlbWVudCkge1xuICAgICAgaWYgKCF0aGlzLmFkYXB0ZXIpIHtcbiAgICAgICAgLy8gRHVja3R5cGlzaCBjaGVjayBmb3IgQWRhcHRlclxuICAgICAgICB0aGlzLmFkYXB0ZXIgPSBkZXRlY3RBZGFwdGVyKHRoaXMuZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKHRoaXMuYWRhcHRlci5nZXRFbGVtZW50RGF0YSkge1xuICAgICAgICAgIHRoaXMuYWRhcHRlckRhdGEgPSB0aGlzLmFkYXB0ZXIuZ2V0RWxlbWVudERhdGEodGhpcy5lbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMub25SZW5kZXIpIHtcbiAgICAgICAgdGhpcy5vblJlbmRlciA9IGRlZmF1bHRSZW5kZXJlcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBQcmltZSBhbiBvYmplY3QgdG8gaW5oZXJpdCBmcm9tLCB3aXRoIG9ubHkgYHZhbHVlYCBwcm9wZXJ0aWVzXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuZGVmYXVsdFZhbHVlKSB7XG4gICAgICBpZiAodGhpcy5kZWZhdWx0VmFsdWUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBpZiAocHJvcHNUb1NldC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgaW5oZXJpdGFibGVba2V5XSA9IHByb3BzVG9TZXRba2V5XTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzW2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGluaGVyaXRhYmxlW2tleV0gPSB0aGlzW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgZXhpc3RpbmcgdmFsdWVzIHdpdGggaW5oZXJpdGFibGUgcHJvcGVydGllc1xuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLnZhbHVlcykge1xuICAgICAgaWYgKHRoaXMudmFsdWVzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgdGhpcy52YWx1ZXNba2V5XSA9IHsgLi4udGhpcy52YWx1ZXNba2V5XSwgLi4uaW5oZXJpdGFibGUgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBVcGRhdGVcbiAgICBpZiAodmFsdWVzKSB7XG4gICAgICB0aGlzLnNldFZhbHVlcyh2YWx1ZXMsIGluaGVyaXRhYmxlKTtcblxuICAgICAgLy8gUHJlY29tcHV0ZSBudW1iZXIgb2YgdmFsdWUga2V5IGFuZCBwYXJlbnQga2V5cyB0byBhdm9pZCBwZXItZnJhbWUgbWVhc3VyZW1lbnRcbiAgICAgIHRoaXMubnVtVmFsdWVLZXlzID0gdGhpcy52YWx1ZUtleXMubGVuZ3RoO1xuICAgICAgdGhpcy5udW1QYXJlbnRLZXlzID0gdGhpcy5wYXJlbnRLZXlzLmxlbmd0aDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldFZhbHVlcyh2YWx1ZXMsIGluaGVyaXQpIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgYWxsIGluY29taW5nIHZhbHVlcyBhbmQgc2V0XG4gICAgZm9yIChsZXQga2V5IGluIHZhbHVlcykge1xuICAgICAgaWYgKHZhbHVlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGxldCBoYXNDaGlsZHJlbiA9IGZhbHNlO1xuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHt9O1xuXG4gICAgICAgIC8vIE1lcmdlIGludG8gZXhpc3RpbmcgdmFsdWUgb3IgY3JlYXRlIG5ld1xuICAgICAgICBjb25zdCB2YWx1ZUFscmVhZHlFeGlzdHMgPSB0aGlzLnZhbHVlc1trZXldICE9PSB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBuZXdWYWx1ZSA9IHZhbHVlQWxyZWFkeUV4aXN0cyA/IHsgLi4udGhpcy52YWx1ZXNba2V5XSB9IDogeyAuLi5pbmhlcml0IH07XG5cbiAgICAgICAgLy8gSWYgdmFsdWVzIGlzIG5vdCBhbiBvYmplY3QsIGFzc2lnbiB2YWx1ZSB0byBkZWZhdWx0IHByb3BcbiAgICAgICAgaWYgKCFpc09iaih2YWx1ZXNba2V5XSkpIHtcbiAgICAgICAgICBuZXdWYWx1ZVt0aGlzLmRlZmF1bHRWYWx1ZVByb3BdID0gdmFsdWVzW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSB7IC4uLm5ld1ZhbHVlLCAuLi52YWx1ZXNba2V5XSB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgd2UndmUgZ290IGFuIGFkYXB0ZXIsIGdldCB0aGUgY3VycmVudCB2YWx1ZVxuICAgICAgICBpZiAobmV3VmFsdWUuY3VycmVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKHRoaXMuYWRhcHRlcikge1xuICAgICAgICAgICAgbmV3VmFsdWUuY3VycmVudCA9IGNvbnZlcnRJZlNob3VsZEJlTnVtYmVyKHRoaXMuYWRhcHRlci5nZXQodGhpcy5lbGVtZW50LCBrZXkpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV3VmFsdWUuZnJvbSA9PT0gdW5kZWZpbmVkICYmIHRoaXMuYWRhcHRlcikge1xuICAgICAgICAgIG5ld1ZhbHVlLmZyb20gPSBuZXdWYWx1ZS5jdXJyZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXBwbHkgZGVmYXVsdCB2YWx1ZSBwcm9wZXJ0aWVzXG4gICAgICAgIGlmICghdmFsdWVBbHJlYWR5RXhpc3RzKSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSB7IC4uLnRoaXMuZGVmYXVsdFZhbHVlLCAuLi5uZXdWYWx1ZSB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSBhIHZhbHVlIHR5cGUgYW5kIHdlIGRvIGhhdmUgYW4gQWRhcHRlciwgY2hlY2sgZm9yIHR5cGUgd2l0aCB2YWx1ZSBrZXlcbiAgICAgICAgaWYgKCFuZXdWYWx1ZS50eXBlICYmIHRoaXMuYWRhcHRlciAmJiB0aGlzLmFkYXB0ZXIuY2hlY2tWYWx1ZVR5cGUpIHtcbiAgICAgICAgICBuZXdWYWx1ZS50eXBlID0gdGhpcy5hZGFwdGVyLmNoZWNrVmFsdWVUeXBlKGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB3ZSBzdGlsbCBkb24ndCBoYXZlIGEgdmFsdWUgdHlwZSBhbmQgdGhpcyBpcyB0aGUgZmlyc3QgdGltZSB3ZSd2ZSBzZXQgdGhpcyB2YWx1ZSwgY2hlY2sgbnVtZXJpY2FsIHZhbHVlcyBmb3Igc3RyaW5ncyBhbmQgdGVzdFxuICAgICAgICBpZiAoIW5ld1ZhbHVlLnR5cGUgJiYgIXRoaXMudmFsdWVzW2tleV0pIHtcbiAgICAgICAgICBuZXdWYWx1ZS50eXBlID0gZGV0ZWN0VmFsdWVUeXBlKG5ld1ZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHdlIGhhdmUgYSB2YWx1ZSB0eXBlLCBoYW5kbGUuIFRoaXMgaXMgbXkgbGVhc3QgZmF2b3VyaXRlIHBhcnQgb2YgUG9wbW90aW9uLCBzby4uLiBlbmpveS5cbiAgICAgICAgaWYgKG5ld1ZhbHVlLnR5cGUpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE5VTV9OVU1FUklDQUxfVkFMVUVTOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHByb3BOYW1lID0gTlVNRVJJQ0FMX1ZBTFVFU1tpXTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlUHJvcCA9IG5ld1ZhbHVlW3Byb3BOYW1lXTtcblxuICAgICAgICAgICAgLy8gSWYgdGhpcyBwcm9wIGlzIGEgc3RyaW5nIGFuZCB3ZSBoYXZlIGEgc3BsaXR0ZXIsIHNwbGl0XG4gICAgICAgICAgICBpZiAobmV3VmFsdWUudHlwZS5oYXNPd25Qcm9wZXJ0eSgnc3BsaXQnKSkge1xuICAgICAgICAgICAgICBjb25zdCBzcGxpdFByb3AgPSBpc1N0cmluZyh2YWx1ZVByb3ApID8gbmV3VmFsdWUudHlwZS5zcGxpdCh2YWx1ZVByb3ApIDoge307XG5cbiAgICAgICAgICAgICAgZm9yIChsZXQgc3BsaXRLZXkgaW4gc3BsaXRQcm9wKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNwbGl0UHJvcC5oYXNPd25Qcm9wZXJ0eShzcGxpdEtleSkpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbWJpbmVkS2V5ID0ga2V5ICsgc3BsaXRLZXk7XG5cbiAgICAgICAgICAgICAgICAgIC8vIElmIHdlIGRvbid0IGhhdmUgYSBjaGlsZCB2YWx1ZSBmb3IgdGhpcyBrZXksIG1ha2Ugb25lXG4gICAgICAgICAgICAgICAgICBpZiAoIWNoaWxkcmVuW2NvbWJpbmVkS2V5XSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWZhdWx0VmFsdWUgPSAobmV3VmFsdWUudHlwZS5kZWZhdWx0UHJvcHMgJiYgbmV3VmFsdWUudHlwZS5kZWZhdWx0UHJvcHNbc3BsaXRLZXldKSA/IG5ld1ZhbHVlLnR5cGUuZGVmYXVsdFByb3BzW3NwbGl0S2V5XSA6IG5ld1ZhbHVlLnR5cGUuZGVmYXVsdFByb3BzIHx8IHt9O1xuXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuW2NvbWJpbmVkS2V5XSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAuLi5uZXdWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAuLi5kZWZhdWx0VmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgY2hpbGRLZXk6IHNwbGl0S2V5XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNoaWxkcmVuW2NvbWJpbmVkS2V5XS50eXBlO1xuICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICBoYXNDaGlsZHJlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICBjaGlsZHJlbltjb21iaW5lZEtleV1bcHJvcE5hbWVdID0gcGFyc2VGbG9hdChzcGxpdFByb3Bbc3BsaXRLZXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgdGVtcGxhdGUgZnVuY3Rpb24sIGdlbmVyYXRlXG4gICAgICAgICAgICAgIGlmICghbmV3VmFsdWUudGVtcGxhdGUgJiYgbmV3VmFsdWUudHlwZS50ZW1wbGF0ZSAmJiBpc1N0cmluZyh2YWx1ZVByb3ApKSB7XG4gICAgICAgICAgICAgICAgbmV3VmFsdWUudGVtcGxhdGUgPSBuZXdWYWx1ZS50eXBlLnRlbXBsYXRlKHZhbHVlUHJvcCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobmV3VmFsdWUudHlwZS5kZWZhdWx0UHJvcHMpIHtcbiAgICAgICAgICAgICAgbmV3VmFsdWUgPSB7IC4uLm5ld1ZhbHVlLnR5cGUuZGVmYXVsdFByb3BzLCAuLi5uZXdWYWx1ZSB9O1xuXG4gICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBiaXQgb2YgYSBoYWNrIC0gdGhpcyBlbnRpcmUgZnVuY3Rpb24gaXMgYSBoYWNrLiBTb3JyeSBmdXR1cmUgc2VsZi4gSSBsb29rIGZvcndhcmQgdG8gc2NyYXBwaW5nIHRoZSBsb3Qgb2YgaXQuXG4gICAgICAgICAgICAgIGlmIChuZXdWYWx1ZS50eXBlLmRlZmF1bHRQcm9wcy50eXBlKSB7XG4gICAgICAgICAgICAgICAgbmV3VmFsdWUudHlwZSA9IG5ld1ZhbHVlLnR5cGUuZGVmYXVsdFByb3BzLnR5cGU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHZhbHVlUHJvcCAhPT0gdW5kZWZpbmVkICYmIG5ld1ZhbHVlLnR5cGUucGFyc2UpIHtcbiAgICAgICAgICAgICAgbmV3VmFsdWVbcHJvcE5hbWVdID0gbmV3VmFsdWUudHlwZS5wYXJzZSh2YWx1ZVByb3AsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gLy8gRW5kIHZhbHVlIHR5cGUgbm9uc2Vuc2VcblxuICAgICAgICAvLyBTZXQgYHByZXZgIHRvIGBjdXJyZW50YCBmb3IgZmlyc3QgZnJhbWUgYWZ0ZXIgc2V0XG4gICAgICAgIG5ld1ZhbHVlLnByZXYgPSBuZXdWYWx1ZS5jdXJyZW50O1xuICAgICAgICBcbiAgICAgICAgLy8gSWYgdGhpcyB2YWx1ZSBkb2Vzbid0IGhhdmUgY2hpbGRyZW4sIGFkZCB0byB2YWx1ZUtleXNcbiAgICAgICAgaWYgKCFoYXNDaGlsZHJlbikge1xuICAgICAgICAgIGlmICh0aGlzLnZhbHVlS2V5cy5pbmRleE9mKGtleSkgPT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlS2V5cy5wdXNoKGtleSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIC8vIE9yIGFkZCB0byBwYXJlbnRLZXlzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3VmFsdWUuY2hpbGRyZW4gPSBuZXdWYWx1ZS5jaGlsZHJlbiB8fCB7fTtcblxuICAgICAgICAgIGlmICh0aGlzLnBhcmVudEtleXMuaW5kZXhPZihrZXkpID09PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5wYXJlbnRLZXlzLnB1c2goa2V5KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnNldFZhbHVlcyhjaGlsZHJlbik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnZhbHVlc1trZXldID0gbmV3VmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLypcbiAgICBEZWNpZGUgd2hldGhlciB0aGlzIEFjdGlvbiB3aWxsIHJlbmRlciBvbiBuZXh0IGZyYW1lXG5cbiAgICBAcGFyYW0gW0FjdGlvbl1cbiAgICBAcGFyYW0gW251bWJlcl1cbiAgICBAcGFyYW0gW251bWJlcl1cbiAgICBAcmV0dXJuIFtib29sZWFuXTogUmV0dXJuIHRydWUgdG8gcmVuZGVyXG4gICovXG4gIHdpbGxSZW5kZXIoYWN0aW9uLCBmcmFtZVN0YW1wLCBlbGFwc2VkKSB7XG4gICAgbGV0IGhhc0NoYW5nZWQgPSBmYWxzZTtcblxuICAgIC8vIENoZWNrIGlmIGJhc2UgdmFsdWVzIGhhdmUgdXBkYXRlZCBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubnVtVmFsdWVLZXlzOyBpKyspIHtcbiAgICAgIGNvbnN0IGtleSA9IHRoaXMudmFsdWVLZXlzW2ldO1xuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnZhbHVlc1trZXldO1xuXG4gICAgICAvLyBSdW4gdHJhbnNmb3JtIGZ1bmN0aW9uIChpZiBwcmVzZW50KVxuICAgICAgaWYgKHZhbHVlLnRyYW5zZm9ybSkge1xuICAgICAgICB2YWx1ZS5jdXJyZW50ID0gdmFsdWUudHJhbnNmb3JtKHZhbHVlLmN1cnJlbnQsIGtleSwgdGhpcyk7XG4gICAgICB9XG5cbiAgICAgIC8vIENhcCBtaW5pbXVtXG4gICAgICBpZiAoaXNOdW0odmFsdWUubWluKSkge1xuICAgICAgICB2YWx1ZS5jdXJyZW50ID0gTWF0aC5tYXgodmFsdWUuY3VycmVudCwgdmFsdWUubWluKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2FwIG1heGltdW1cbiAgICAgIGlmIChpc051bSh2YWx1ZS5tYXgpKSB7XG4gICAgICAgIHZhbHVlLmN1cnJlbnQgPSBNYXRoLm1pbih2YWx1ZS5jdXJyZW50LCB2YWx1ZS5tYXgpO1xuICAgICAgfVxuXG4gICAgICAvLyBSb3VuZCBudW1iZXJcbiAgICAgIGlmICh2YWx1ZS5yb3VuZCkge1xuICAgICAgICB2YWx1ZS5jdXJyZW50ID0gTWF0aC5yb3VuZCh2YWx1ZS5jdXJyZW50KTtcbiAgICAgIH1cblxuICAgICAgdmFsdWUuZnJhbWVDaGFuZ2UgPSB2YWx1ZS5jdXJyZW50IC0gdmFsdWUucHJldjtcblxuICAgICAgLy8gVXBkYXRlIHZlbG9jaXR5XG4gICAgICBpZiAoIXRoaXMuY2FsY3VsYXRlc1ZlbG9jaXR5KSB7XG4gICAgICAgIHZhbHVlLnZlbG9jaXR5ID0gc3BlZWRQZXJTZWNvbmQodmFsdWUuZnJhbWVDaGFuZ2UsIGVsYXBzZWQpO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGlzIHZhbHVlIGhhcyBjaGFuZ2VkXG4gICAgICBpZiAodmFsdWUucHJldiAhPT0gdmFsdWUuY3VycmVudCkge1xuICAgICAgICBoYXNDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgdmFsdWUucHJldiA9IHZhbHVlLmN1cnJlbnQ7XG4gICAgICB9XG5cbiAgICAgIC8vIEFwcGVuZCB1bml0XG4gICAgICBjb25zdCB2YWx1ZUZvclN0YXRlID0gKHZhbHVlLnR5cGUgJiYgdmFsdWUudHlwZS5zZXJpYWxpemUpID8gdmFsdWUudHlwZS5zZXJpYWxpemUodmFsdWUuY3VycmVudCwgdmFsdWUpIDogdmFsdWUuY3VycmVudDtcblxuICAgICAgLy8gQWRkIHRvIHN0YXRlIGlmIHRoaXMgaXMgbm90IGEgY2hpbGQgdmF1ZVxuICAgICAgaWYgKCF2YWx1ZS5wYXJlbnQpIHtcbiAgICAgICAgdGhpcy5zdGF0ZVtrZXldID0gdmFsdWVGb3JTdGF0ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmFsdWVzW3ZhbHVlLnBhcmVudF0uY2hpbGRyZW5bdmFsdWUuY2hpbGRLZXldID0gdmFsdWVGb3JTdGF0ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgcGFyZW50IHZhbHVlc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1QYXJlbnRLZXlzOyBpKyspIHtcbiAgICAgIGNvbnN0IGtleSA9IHRoaXMucGFyZW50S2V5c1tpXTtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy52YWx1ZXNba2V5XTtcblxuICAgICAgdmFsdWUuY3VycmVudCA9IHZhbHVlLnR5cGUuY29tYmluZSh2YWx1ZS5jaGlsZHJlbiwgdmFsdWUudGVtcGxhdGUpO1xuXG4gICAgICB0aGlzLnN0YXRlW2tleV0gPSB2YWx1ZS5jdXJyZW50O1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9uRnJhbWUpIHtcbiAgICAgIHRoaXMub25GcmFtZSh0aGlzLnN0YXRlLCB0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKHRoaXMub25DbGVhbnVwKSA/IHRydWUgOiBoYXNDaGFuZ2VkO1xuICB9XG5cbiAgaW5oZXJpdChwcm9wcyA9IHt9KSB7XG4gICAgY29uc3QgeyB2YWx1ZXMsIC4uLnByb3BzVG9TZXQgfSA9IHByb3BzO1xuICAgIGNvbnN0IG5ld0FjdGlvbiA9IHN1cGVyLmluaGVyaXQocHJvcHNUb1NldCk7XG5cbiAgICBpZiAodmFsdWVzKSB7XG4gICAgICBuZXdBY3Rpb24uc2V0KHsgdmFsdWVzIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBuZXdBY3Rpb247XG4gIH1cblxuICBwYXVzZSgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZXN1bWUoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHRvZ2dsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5pc0FjdGl2ZSA/IHRoaXMucGF1c2UoKSA6IHRoaXMucmVzdW1lKCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLnZhbHVlcztcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgZm9yIChsZXQga2V5IGluIHZhbHVlcykge1xuICAgICAgaWYgKHZhbHVlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHZhbHVlc1trZXldLnByZXYgPSB2YWx1ZXNba2V5XS5vcmlnaW4gPSB2YWx1ZXNba2V5XS5jdXJyZW50O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3RhdGljIGV4dGVuZERlZmF1bHRWYWx1ZShwcm9wcykge1xuICAgIHJldHVybiB7IC4uLnRoaXMucHJvdG90eXBlLmRlZmF1bHRWYWx1ZSwgLi4ucHJvcHMgfTtcbiAgfVxuXG4gIHN0YXRpYyBleHRlbmREZWZhdWx0UHJvcHMocHJvcHMpIHtcbiAgICByZXR1cm4geyAuLi50aGlzLnByb3RvdHlwZS5kZWZhdWx0UHJvcHMsIC4uLnByb3BzIH07XG4gIH1cbn1cblxuQWN0aW9uLnByb3RvdHlwZS5kZWZhdWx0VmFsdWVQcm9wID0gJ2N1cnJlbnQnO1xuQWN0aW9uLnByb3RvdHlwZS5kZWZhdWx0VmFsdWUgPSB7XG4gIHZlbG9jaXR5OiAwLFxuICByb3VuZDogZmFsc2UsXG4gIG1pbjogdW5kZWZpbmVkLFxuICBtYXg6IHVuZGVmaW5lZCxcbiAgdHJhbnNmb3JtOiB1bmRlZmluZWRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFjdGlvbjtcbiJdfQ==