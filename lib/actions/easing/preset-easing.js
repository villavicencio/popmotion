'use strict';

exports.__esModule = true;

var _createEasing = require('./create-easing');

var _createEasing2 = _interopRequireDefault(_createEasing);

var _createBezier = require('./create-bezier');

var _createBezier2 = _interopRequireDefault(_createBezier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Values
/*
  Easing functions
  ----------------------------------------
  
  Generates and provides easing functions based on baseFunction definitions
  
  A call to easingFunction.get('functionName') returns a function that can be passed:
    @param [number]: Progress 0-1
    @param [number] (optional): Amp modifier, only accepted in some easing functions
                  and is used to adjust overall strength
    @return [number]: Eased progress
    
  We can generate new functions by sending an easing function through easingFunction.extend(name, method).
  Which will make nameIn, nameOut and nameInOut functions available to use.
    
  Easing functions from Robert Penner
  http://www.robertpenner.com/easing/
    
  Bezier curve interpretor created from Gaëtan Renaudeau's original BezierEasing  
  https://github.com/gre/bezier-easing/blob/master/index.js  
  https://github.com/gre/bezier-easing/blob/master/LICENSE

  Anticipate easing created by Elliot Gino
  https://twitter.com/ElliotGeno
*/
// Imports
var DEFAULT_BACK_STRENGTH = 1.525;
var DEFAULT_POW_STRENGTH = 2;

/*
  Each of these base functions is an easeIn
  
  On init, we use .mirror and .reverse to generate easeInOut and
  easeOut functions respectively.
*/
var baseEasing = {
  ease: function (progress) {
    var strength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_POW_STRENGTH;
    return Math.pow(progress, strength);
  },
  circ: function (progress) {
    return 1 - Math.sin(Math.acos(progress));
  },
  back: function (progress) {
    var strength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_BACK_STRENGTH;
    return progress * progress * ((strength + 1) * progress - strength);
  }
};

// Utility functions
var generatePowerEasing = function (strength) {
  return function (progress) {
    return baseEasing.ease(progress, strength);
  };
};

['cubic', 'quart', 'quint'].forEach(function (easingName, i) {
  return baseEasing[easingName] = generatePowerEasing(i + 3);
});

// Generate in/out/inOut variations
for (var key in baseEasing) {
  if (baseEasing.hasOwnProperty(key)) {
    var easingFunction = (0, _createEasing2.default)(baseEasing[key]);
    baseEasing[key + 'In'] = easingFunction.in;
    baseEasing[key + 'Out'] = easingFunction.out;
    baseEasing[key + 'InOut'] = easingFunction.inOut;
  }
}

baseEasing.linear = function (progress) {
  return progress;
};
baseEasing.anticipate = function (progress) {
  var strength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_BACK_STRENGTH;
  return (progress *= 2) < 1 ? 0.5 * baseEasing.backIn(progress, strength) : 0.5 * (2 - Math.pow(2, -10 * (progress - 1)));
};

baseEasing.createVariations = _createEasing2.default;
baseEasing.cubicBezier = _createBezier2.default;
baseEasing.modify = function (easing) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return function (progress) {
    return easing.apply(undefined, [progress].concat(args));
  };
};

exports.default = baseEasing;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb25zL2Vhc2luZy9wcmVzZXQtZWFzaW5nLmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRfQkFDS19TVFJFTkdUSCIsIkRFRkFVTFRfUE9XX1NUUkVOR1RIIiwiYmFzZUVhc2luZyIsImVhc2UiLCJwcm9ncmVzcyIsInN0cmVuZ3RoIiwiY2lyYyIsIk1hdGgiLCJzaW4iLCJhY29zIiwiYmFjayIsImdlbmVyYXRlUG93ZXJFYXNpbmciLCJmb3JFYWNoIiwiZWFzaW5nTmFtZSIsImkiLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSIsImVhc2luZ0Z1bmN0aW9uIiwiaW4iLCJvdXQiLCJpbk91dCIsImxpbmVhciIsImFudGljaXBhdGUiLCJiYWNrSW4iLCJwb3ciLCJjcmVhdGVWYXJpYXRpb25zIiwiY3ViaWNCZXppZXIiLCJtb2RpZnkiLCJlYXNpbmciLCJhcmdzIl0sIm1hcHBpbmdzIjoiOzs7O0FBMEJBOzs7O0FBQ0E7Ozs7OztBQUVBO0FBN0JBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBO0FBS0EsSUFBTUEsd0JBQXdCLEtBQTlCO0FBQ0EsSUFBTUMsdUJBQXVCLENBQTdCOztBQUVBOzs7Ozs7QUFNQSxJQUFNQyxhQUFhO0FBQ2pCQyxRQUFNLFVBQUNDLFFBQUQ7QUFBQSxRQUFXQyxRQUFYLHVFQUFzQkosb0JBQXRCO0FBQUEsb0JBQStDRyxRQUEvQyxFQUEyREMsUUFBM0Q7QUFBQSxHQURXO0FBRWpCQyxRQUFNO0FBQUEsV0FBWSxJQUFJQyxLQUFLQyxHQUFMLENBQVNELEtBQUtFLElBQUwsQ0FBVUwsUUFBVixDQUFULENBQWhCO0FBQUEsR0FGVztBQUdqQk0sUUFBTSxVQUFDTixRQUFEO0FBQUEsUUFBV0MsUUFBWCx1RUFBc0JMLHFCQUF0QjtBQUFBLFdBQWlESSxXQUFXQSxRQUFaLElBQXlCLENBQUNDLFdBQVcsQ0FBWixJQUFpQkQsUUFBakIsR0FBNEJDLFFBQXJELENBQWhEO0FBQUE7QUFIVyxDQUFuQjs7QUFNQTtBQUNBLElBQU1NLHNCQUFzQixVQUFDTixRQUFEO0FBQUEsU0FBYyxVQUFDRCxRQUFEO0FBQUEsV0FBY0YsV0FBV0MsSUFBWCxDQUFnQkMsUUFBaEIsRUFBMEJDLFFBQTFCLENBQWQ7QUFBQSxHQUFkO0FBQUEsQ0FBNUI7O0FBRUEsQ0FBQyxPQUFELEVBQVUsT0FBVixFQUFtQixPQUFuQixFQUE0Qk8sT0FBNUIsQ0FBb0MsVUFBQ0MsVUFBRCxFQUFhQyxDQUFiO0FBQUEsU0FBbUJaLFdBQVdXLFVBQVgsSUFBeUJGLG9CQUFvQkcsSUFBSSxDQUF4QixDQUE1QztBQUFBLENBQXBDOztBQUVBO0FBQ0EsS0FBSyxJQUFJQyxHQUFULElBQWdCYixVQUFoQixFQUE0QjtBQUMxQixNQUFJQSxXQUFXYyxjQUFYLENBQTBCRCxHQUExQixDQUFKLEVBQW9DO0FBQ2xDLFFBQU1FLGlCQUFpQiw0QkFBcUJmLFdBQVdhLEdBQVgsQ0FBckIsQ0FBdkI7QUFDQWIsZUFBY2EsR0FBZCxXQUF5QkUsZUFBZUMsRUFBeEM7QUFDQWhCLGVBQWNhLEdBQWQsWUFBMEJFLGVBQWVFLEdBQXpDO0FBQ0FqQixlQUFjYSxHQUFkLGNBQTRCRSxlQUFlRyxLQUEzQztBQUNEO0FBQ0Y7O0FBRURsQixXQUFXbUIsTUFBWCxHQUFvQjtBQUFBLFNBQVlqQixRQUFaO0FBQUEsQ0FBcEI7QUFDQUYsV0FBV29CLFVBQVgsR0FBd0IsVUFBQ2xCLFFBQUQ7QUFBQSxNQUFXQyxRQUFYLHVFQUFzQkwscUJBQXRCO0FBQUEsU0FDckIsQ0FBQ0ksWUFBVSxDQUFYLElBQWdCLENBQWpCLEdBQXNCLE1BQU1GLFdBQVdxQixNQUFYLENBQWtCbkIsUUFBbEIsRUFBNEJDLFFBQTVCLENBQTVCLEdBQXFFLE9BQU8sSUFBSUUsS0FBS2lCLEdBQUwsQ0FBUyxDQUFULEVBQVksQ0FBQyxFQUFELElBQU9wQixXQUFXLENBQWxCLENBQVosQ0FBWCxDQUQvQztBQUFBLENBQXhCOztBQUdBRixXQUFXdUIsZ0JBQVg7QUFDQXZCLFdBQVd3QixXQUFYO0FBQ0F4QixXQUFXeUIsTUFBWCxHQUFvQixVQUFDQyxNQUFEO0FBQUEsb0NBQVlDLElBQVo7QUFBWUEsUUFBWjtBQUFBOztBQUFBLFNBQXFCLFVBQUN6QixRQUFEO0FBQUEsV0FBY3dCLHlCQUFPeEIsUUFBUCxTQUFvQnlCLElBQXBCLEVBQWQ7QUFBQSxHQUFyQjtBQUFBLENBQXBCOztrQkFFZTNCLFUiLCJmaWxlIjoicHJlc2V0LWVhc2luZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gIEVhc2luZyBmdW5jdGlvbnNcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBcbiAgR2VuZXJhdGVzIGFuZCBwcm92aWRlcyBlYXNpbmcgZnVuY3Rpb25zIGJhc2VkIG9uIGJhc2VGdW5jdGlvbiBkZWZpbml0aW9uc1xuICBcbiAgQSBjYWxsIHRvIGVhc2luZ0Z1bmN0aW9uLmdldCgnZnVuY3Rpb25OYW1lJykgcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHBhc3NlZDpcbiAgICBAcGFyYW0gW251bWJlcl06IFByb2dyZXNzIDAtMVxuICAgIEBwYXJhbSBbbnVtYmVyXSAob3B0aW9uYWwpOiBBbXAgbW9kaWZpZXIsIG9ubHkgYWNjZXB0ZWQgaW4gc29tZSBlYXNpbmcgZnVuY3Rpb25zXG4gICAgICAgICAgICAgICAgICBhbmQgaXMgdXNlZCB0byBhZGp1c3Qgb3ZlcmFsbCBzdHJlbmd0aFxuICAgIEByZXR1cm4gW251bWJlcl06IEVhc2VkIHByb2dyZXNzXG4gICAgXG4gIFdlIGNhbiBnZW5lcmF0ZSBuZXcgZnVuY3Rpb25zIGJ5IHNlbmRpbmcgYW4gZWFzaW5nIGZ1bmN0aW9uIHRocm91Z2ggZWFzaW5nRnVuY3Rpb24uZXh0ZW5kKG5hbWUsIG1ldGhvZCkuXG4gIFdoaWNoIHdpbGwgbWFrZSBuYW1lSW4sIG5hbWVPdXQgYW5kIG5hbWVJbk91dCBmdW5jdGlvbnMgYXZhaWxhYmxlIHRvIHVzZS5cbiAgICBcbiAgRWFzaW5nIGZ1bmN0aW9ucyBmcm9tIFJvYmVydCBQZW5uZXJcbiAgaHR0cDovL3d3dy5yb2JlcnRwZW5uZXIuY29tL2Vhc2luZy9cbiAgICBcbiAgQmV6aWVyIGN1cnZlIGludGVycHJldG9yIGNyZWF0ZWQgZnJvbSBHYcOrdGFuIFJlbmF1ZGVhdSdzIG9yaWdpbmFsIEJlemllckVhc2luZyAgXG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9ncmUvYmV6aWVyLWVhc2luZy9ibG9iL21hc3Rlci9pbmRleC5qcyAgXG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9ncmUvYmV6aWVyLWVhc2luZy9ibG9iL21hc3Rlci9MSUNFTlNFXG5cbiAgQW50aWNpcGF0ZSBlYXNpbmcgY3JlYXRlZCBieSBFbGxpb3QgR2lub1xuICBodHRwczovL3R3aXR0ZXIuY29tL0VsbGlvdEdlbm9cbiovXG4vLyBJbXBvcnRzXG5pbXBvcnQgY3JlYXRlRWFzaW5nRnVuY3Rpb24gZnJvbSAnLi9jcmVhdGUtZWFzaW5nJztcbmltcG9ydCBjdWJpY0JlemllciBmcm9tICcuL2NyZWF0ZS1iZXppZXInO1xuXG4vLyBWYWx1ZXNcbmNvbnN0IERFRkFVTFRfQkFDS19TVFJFTkdUSCA9IDEuNTI1O1xuY29uc3QgREVGQVVMVF9QT1dfU1RSRU5HVEggPSAyO1xuXG4vKlxuICBFYWNoIG9mIHRoZXNlIGJhc2UgZnVuY3Rpb25zIGlzIGFuIGVhc2VJblxuICBcbiAgT24gaW5pdCwgd2UgdXNlIC5taXJyb3IgYW5kIC5yZXZlcnNlIHRvIGdlbmVyYXRlIGVhc2VJbk91dCBhbmRcbiAgZWFzZU91dCBmdW5jdGlvbnMgcmVzcGVjdGl2ZWx5LlxuKi9cbmNvbnN0IGJhc2VFYXNpbmcgPSB7XG4gIGVhc2U6IChwcm9ncmVzcywgc3RyZW5ndGggPSBERUZBVUxUX1BPV19TVFJFTkdUSCkgPT4gcHJvZ3Jlc3MgKiogc3RyZW5ndGgsXG4gIGNpcmM6IHByb2dyZXNzID0+IDEgLSBNYXRoLnNpbihNYXRoLmFjb3MocHJvZ3Jlc3MpKSxcbiAgYmFjazogKHByb2dyZXNzLCBzdHJlbmd0aCA9IERFRkFVTFRfQkFDS19TVFJFTkdUSCkgPT4gKHByb2dyZXNzICogcHJvZ3Jlc3MpICogKChzdHJlbmd0aCArIDEpICogcHJvZ3Jlc3MgLSBzdHJlbmd0aClcbn07XG5cbi8vIFV0aWxpdHkgZnVuY3Rpb25zXG5jb25zdCBnZW5lcmF0ZVBvd2VyRWFzaW5nID0gKHN0cmVuZ3RoKSA9PiAocHJvZ3Jlc3MpID0+IGJhc2VFYXNpbmcuZWFzZShwcm9ncmVzcywgc3RyZW5ndGgpO1xuXG5bJ2N1YmljJywgJ3F1YXJ0JywgJ3F1aW50J10uZm9yRWFjaCgoZWFzaW5nTmFtZSwgaSkgPT4gYmFzZUVhc2luZ1tlYXNpbmdOYW1lXSA9IGdlbmVyYXRlUG93ZXJFYXNpbmcoaSArIDMpKTtcblxuLy8gR2VuZXJhdGUgaW4vb3V0L2luT3V0IHZhcmlhdGlvbnNcbmZvciAobGV0IGtleSBpbiBiYXNlRWFzaW5nKSB7XG4gIGlmIChiYXNlRWFzaW5nLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICBjb25zdCBlYXNpbmdGdW5jdGlvbiA9IGNyZWF0ZUVhc2luZ0Z1bmN0aW9uKGJhc2VFYXNpbmdba2V5XSk7XG4gICAgYmFzZUVhc2luZ1tgJHtrZXl9SW5gXSA9IGVhc2luZ0Z1bmN0aW9uLmluO1xuICAgIGJhc2VFYXNpbmdbYCR7a2V5fU91dGBdID0gZWFzaW5nRnVuY3Rpb24ub3V0O1xuICAgIGJhc2VFYXNpbmdbYCR7a2V5fUluT3V0YF0gPSBlYXNpbmdGdW5jdGlvbi5pbk91dDtcbiAgfVxufVxuXG5iYXNlRWFzaW5nLmxpbmVhciA9IHByb2dyZXNzID0+IHByb2dyZXNzO1xuYmFzZUVhc2luZy5hbnRpY2lwYXRlID0gKHByb2dyZXNzLCBzdHJlbmd0aCA9IERFRkFVTFRfQkFDS19TVFJFTkdUSCkgPT5cbiAgKChwcm9ncmVzcyo9MikgPCAxKSA/IDAuNSAqIGJhc2VFYXNpbmcuYmFja0luKHByb2dyZXNzLCBzdHJlbmd0aCkgOiAgMC41ICogKDIgLSBNYXRoLnBvdygyLCAtMTAgKiAocHJvZ3Jlc3MgLSAxKSkpO1xuXG5iYXNlRWFzaW5nLmNyZWF0ZVZhcmlhdGlvbnMgPSBjcmVhdGVFYXNpbmdGdW5jdGlvbjtcbmJhc2VFYXNpbmcuY3ViaWNCZXppZXIgPSBjdWJpY0JlemllcjtcbmJhc2VFYXNpbmcubW9kaWZ5ID0gKGVhc2luZywgLi4uYXJncykgPT4gKHByb2dyZXNzKSA9PiBlYXNpbmcocHJvZ3Jlc3MsIC4uLmFyZ3MpO1xuXG5leHBvcnQgZGVmYXVsdCBiYXNlRWFzaW5nOyJdfQ==