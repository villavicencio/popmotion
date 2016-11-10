'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _loop = require('./loop');

var loop = _interopRequireWildcard(_loop);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /*
                                                                                                                                                            Base Task class for creating a task on the main render loop.
                                                                                                                                                          */


function cleanup() {
  this.onCleanup = undefined;
  loop.deactivate(this.id);
}

function activate() {
  this.onCleanup = cleanup;
}

var Task = function () {
  function Task(props) {
    _classCallCheck(this, Task);

    this.id = loop.getTaskId();
    this.isActive = false;

    if (this.defaultProps) {
      for (var key in this.defaultProps) {
        if (this.defaultProps.hasOwnProperty(key)) {
          this[key] = this.defaultProps[key];
        }
      }
    }

    this.set(props);
  }

  Task.prototype.set = function set(props) {
    for (var key in props) {
      if (props.hasOwnProperty(key)) {
        this[key] = props[key];
      }
    }

    return this;
  };

  Task.prototype.start = function start() {
    loop.activate(this.id, this);

    this.onActivateLoop = this.onCleanup = undefined;
    this.isComplete = false;

    if (this.onStart) {
      this.onStart(this);
    }

    return this;
  };

  Task.prototype.stop = function stop() {
    loop.deactivate(this.id);

    if (this.onStop) {
      this.onStop(this);
    }

    return this;
  };

  Task.prototype.once = function once() {
    loop.activate(this.id, this);
    this.onCleanup = undefined;
    this.onActivateLoop = activate;

    return this;
  };

  Task.prototype.complete = function complete() {
    this.stop();

    if (this.onComplete) {
      this.onComplete(this);
    }
  };

  /*
    # Extend this Process with new properties
    ## Returns new instance of this Process's `prototype` with existing and new properties
     @param [object] (optional)
    @return [Process]
  */


  Task.prototype.inherit = function inherit(props) {
    var id = this.id,
        inheritedProps = _objectWithoutProperties(this, ['id']);

    return new this.constructor(_extends({}, inheritedProps, props));
  };

  return Task;
}();

exports.default = Task;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90YXNrL1Rhc2suanMiXSwibmFtZXMiOlsibG9vcCIsImNsZWFudXAiLCJvbkNsZWFudXAiLCJ1bmRlZmluZWQiLCJkZWFjdGl2YXRlIiwiaWQiLCJhY3RpdmF0ZSIsIlRhc2siLCJwcm9wcyIsImdldFRhc2tJZCIsImlzQWN0aXZlIiwiZGVmYXVsdFByb3BzIiwia2V5IiwiaGFzT3duUHJvcGVydHkiLCJzZXQiLCJzdGFydCIsIm9uQWN0aXZhdGVMb29wIiwiaXNDb21wbGV0ZSIsIm9uU3RhcnQiLCJzdG9wIiwib25TdG9wIiwib25jZSIsImNvbXBsZXRlIiwib25Db21wbGV0ZSIsImluaGVyaXQiLCJpbmhlcml0ZWRQcm9wcyIsImNvbnN0cnVjdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFHQTs7SUFBWUEsSTs7Ozs7OzBKQUhaOzs7OztBQUtBLFNBQVNDLE9BQVQsR0FBbUI7QUFDakIsT0FBS0MsU0FBTCxHQUFpQkMsU0FBakI7QUFDQUgsT0FBS0ksVUFBTCxDQUFnQixLQUFLQyxFQUFyQjtBQUNEOztBQUVELFNBQVNDLFFBQVQsR0FBb0I7QUFDbEIsT0FBS0osU0FBTCxHQUFpQkQsT0FBakI7QUFDRDs7SUFFb0JNLEk7QUFDbkIsZ0JBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFDakIsU0FBS0gsRUFBTCxHQUFVTCxLQUFLUyxTQUFMLEVBQVY7QUFDQSxTQUFLQyxRQUFMLEdBQWdCLEtBQWhCOztBQUVBLFFBQUksS0FBS0MsWUFBVCxFQUF1QjtBQUNyQixXQUFLLElBQUlDLEdBQVQsSUFBZ0IsS0FBS0QsWUFBckIsRUFBbUM7QUFDakMsWUFBSSxLQUFLQSxZQUFMLENBQWtCRSxjQUFsQixDQUFpQ0QsR0FBakMsQ0FBSixFQUEyQztBQUN6QyxlQUFLQSxHQUFMLElBQVksS0FBS0QsWUFBTCxDQUFrQkMsR0FBbEIsQ0FBWjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxTQUFLRSxHQUFMLENBQVNOLEtBQVQ7QUFDRDs7aUJBRURNLEcsZ0JBQUlOLEssRUFBTztBQUNULFNBQUssSUFBSUksR0FBVCxJQUFnQkosS0FBaEIsRUFBdUI7QUFDckIsVUFBSUEsTUFBTUssY0FBTixDQUFxQkQsR0FBckIsQ0FBSixFQUErQjtBQUM3QixhQUFLQSxHQUFMLElBQVlKLE1BQU1JLEdBQU4sQ0FBWjtBQUNEO0FBQ0Y7O0FBRUQsV0FBTyxJQUFQO0FBQ0QsRzs7aUJBRURHLEssb0JBQVE7QUFDTmYsU0FBS00sUUFBTCxDQUFjLEtBQUtELEVBQW5CLEVBQXVCLElBQXZCOztBQUVBLFNBQUtXLGNBQUwsR0FBc0IsS0FBS2QsU0FBTCxHQUFpQkMsU0FBdkM7QUFDQSxTQUFLYyxVQUFMLEdBQWtCLEtBQWxCOztBQUVBLFFBQUksS0FBS0MsT0FBVCxFQUFrQjtBQUNoQixXQUFLQSxPQUFMLENBQWEsSUFBYjtBQUNEOztBQUVELFdBQU8sSUFBUDtBQUNELEc7O2lCQUVEQyxJLG1CQUFPO0FBQ0xuQixTQUFLSSxVQUFMLENBQWdCLEtBQUtDLEVBQXJCOztBQUVBLFFBQUksS0FBS2UsTUFBVCxFQUFpQjtBQUNmLFdBQUtBLE1BQUwsQ0FBWSxJQUFaO0FBQ0Q7O0FBRUQsV0FBTyxJQUFQO0FBQ0QsRzs7aUJBRURDLEksbUJBQU87QUFDTHJCLFNBQUtNLFFBQUwsQ0FBYyxLQUFLRCxFQUFuQixFQUF1QixJQUF2QjtBQUNBLFNBQUtILFNBQUwsR0FBaUJDLFNBQWpCO0FBQ0EsU0FBS2EsY0FBTCxHQUFzQlYsUUFBdEI7O0FBRUEsV0FBTyxJQUFQO0FBQ0QsRzs7aUJBRURnQixRLHVCQUFXO0FBQ1QsU0FBS0gsSUFBTDs7QUFFQSxRQUFJLEtBQUtJLFVBQVQsRUFBcUI7QUFDbkIsV0FBS0EsVUFBTCxDQUFnQixJQUFoQjtBQUNEO0FBQ0YsRzs7QUFFRDs7Ozs7Ozs7aUJBT0FDLE8sb0JBQVFoQixLLEVBQU87QUFBQSxRQUNMSCxFQURLLEdBQ3FCLElBRHJCLENBQ0xBLEVBREs7QUFBQSxRQUNFb0IsY0FERiw0QkFDcUIsSUFEckI7O0FBRWIsV0FBTyxJQUFJLEtBQUtDLFdBQVQsY0FBMEJELGNBQTFCLEVBQTZDakIsS0FBN0MsRUFBUDtBQUNELEc7Ozs7O2tCQTNFa0JELEkiLCJmaWxlIjoiVGFzay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gIEJhc2UgVGFzayBjbGFzcyBmb3IgY3JlYXRpbmcgYSB0YXNrIG9uIHRoZSBtYWluIHJlbmRlciBsb29wLlxuKi9cbmltcG9ydCAqIGFzIGxvb3AgZnJvbSAnLi9sb29wJztcblxuZnVuY3Rpb24gY2xlYW51cCgpIHtcbiAgdGhpcy5vbkNsZWFudXAgPSB1bmRlZmluZWQ7XG4gIGxvb3AuZGVhY3RpdmF0ZSh0aGlzLmlkKTtcbn1cblxuZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gIHRoaXMub25DbGVhbnVwID0gY2xlYW51cDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGFzayB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgdGhpcy5pZCA9IGxvb3AuZ2V0VGFza0lkKCk7XG4gICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuZGVmYXVsdFByb3BzKSB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5kZWZhdWx0UHJvcHMpIHtcbiAgICAgICAgaWYgKHRoaXMuZGVmYXVsdFByb3BzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICB0aGlzW2tleV0gPSB0aGlzLmRlZmF1bHRQcm9wc1trZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZXQocHJvcHMpO1xuICB9XG5cbiAgc2V0KHByb3BzKSB7XG4gICAgZm9yIChsZXQga2V5IGluIHByb3BzKSB7XG4gICAgICBpZiAocHJvcHMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICB0aGlzW2tleV0gPSBwcm9wc1trZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgbG9vcC5hY3RpdmF0ZSh0aGlzLmlkLCB0aGlzKTtcblxuICAgIHRoaXMub25BY3RpdmF0ZUxvb3AgPSB0aGlzLm9uQ2xlYW51cCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmlzQ29tcGxldGUgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLm9uU3RhcnQpIHtcbiAgICAgIHRoaXMub25TdGFydCh0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgbG9vcC5kZWFjdGl2YXRlKHRoaXMuaWQpO1xuICAgIFxuICAgIGlmICh0aGlzLm9uU3RvcCkge1xuICAgICAgdGhpcy5vblN0b3AodGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBvbmNlKCkge1xuICAgIGxvb3AuYWN0aXZhdGUodGhpcy5pZCwgdGhpcyk7XG4gICAgdGhpcy5vbkNsZWFudXAgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5vbkFjdGl2YXRlTG9vcCA9IGFjdGl2YXRlO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjb21wbGV0ZSgpIHtcbiAgICB0aGlzLnN0b3AoKTtcblxuICAgIGlmICh0aGlzLm9uQ29tcGxldGUpIHtcbiAgICAgIHRoaXMub25Db21wbGV0ZSh0aGlzKTtcbiAgICB9XG4gIH1cblxuICAvKlxuICAgICMgRXh0ZW5kIHRoaXMgUHJvY2VzcyB3aXRoIG5ldyBwcm9wZXJ0aWVzXG4gICAgIyMgUmV0dXJucyBuZXcgaW5zdGFuY2Ugb2YgdGhpcyBQcm9jZXNzJ3MgYHByb3RvdHlwZWAgd2l0aCBleGlzdGluZyBhbmQgbmV3IHByb3BlcnRpZXNcblxuICAgIEBwYXJhbSBbb2JqZWN0XSAob3B0aW9uYWwpXG4gICAgQHJldHVybiBbUHJvY2Vzc11cbiAgKi9cbiAgaW5oZXJpdChwcm9wcykge1xuICAgIGNvbnN0IHsgaWQsIC4uLmluaGVyaXRlZFByb3BzIH0gPSB0aGlzO1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih7IC4uLmluaGVyaXRlZFByb3BzLCAuLi5wcm9wcyB9KTtcbiAgfVxufSJdfQ==