'use strict';

exports.__esModule = true;

var _utils = require('../inc/utils');

var FLOAT_REGEX = /(-)?(\d[\d\.]*)/g;
var generateToken = function (token) {
  return '${' + token + '}';
};

exports.default = {

  test: function (value) {
    var matches = value.match(FLOAT_REGEX);
    return (0, _utils.isArray)(matches) && matches.length > 1;
  },

  template: function (value) {
    var counter = 0;
    return value.replace(FLOAT_REGEX, function () {
      return generateToken(counter++);
    });
  },

  split: function (value) {
    var splitValue = {};

    value.match(FLOAT_REGEX).forEach(function (value, i) {
      return splitValue[i] = value;
    });

    return splitValue;
  },

  combine: function (values, template) {
    for (var key in values) {
      if (values.hasOwnProperty(key)) {
        template = template.replace(generateToken(key), values[key]);
      }
    }

    return template;
  }

};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZS10eXBlcy9jb21wbGV4LmpzIl0sIm5hbWVzIjpbIkZMT0FUX1JFR0VYIiwiZ2VuZXJhdGVUb2tlbiIsInRva2VuIiwidGVzdCIsInZhbHVlIiwibWF0Y2hlcyIsIm1hdGNoIiwibGVuZ3RoIiwidGVtcGxhdGUiLCJjb3VudGVyIiwicmVwbGFjZSIsInNwbGl0Iiwic3BsaXRWYWx1ZSIsImZvckVhY2giLCJpIiwiY29tYmluZSIsInZhbHVlcyIsImtleSIsImhhc093blByb3BlcnR5Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7O0FBRUEsSUFBTUEsY0FBYyxrQkFBcEI7QUFDQSxJQUFNQyxnQkFBZ0IsVUFBQ0MsS0FBRDtBQUFBLFNBQVcsT0FBT0EsS0FBUCxHQUFlLEdBQTFCO0FBQUEsQ0FBdEI7O2tCQUVlOztBQUViQyxRQUFNLFVBQUNDLEtBQUQsRUFBVztBQUNmLFFBQU1DLFVBQVVELE1BQU1FLEtBQU4sQ0FBWU4sV0FBWixDQUFoQjtBQUNBLFdBQVEsb0JBQVFLLE9BQVIsS0FBb0JBLFFBQVFFLE1BQVIsR0FBaUIsQ0FBN0M7QUFDRCxHQUxZOztBQU9iQyxZQUFVLFVBQUNKLEtBQUQsRUFBVztBQUNuQixRQUFJSyxVQUFVLENBQWQ7QUFDQSxXQUFPTCxNQUFNTSxPQUFOLENBQWNWLFdBQWQsRUFBMkI7QUFBQSxhQUFNQyxjQUFjUSxTQUFkLENBQU47QUFBQSxLQUEzQixDQUFQO0FBQ0QsR0FWWTs7QUFZYkUsU0FBTyxVQUFDUCxLQUFELEVBQVc7QUFDaEIsUUFBTVEsYUFBYSxFQUFuQjs7QUFFQVIsVUFBTUUsS0FBTixDQUFZTixXQUFaLEVBQXlCYSxPQUF6QixDQUFpQyxVQUFDVCxLQUFELEVBQVFVLENBQVI7QUFBQSxhQUFjRixXQUFXRSxDQUFYLElBQWdCVixLQUE5QjtBQUFBLEtBQWpDOztBQUVBLFdBQU9RLFVBQVA7QUFDRCxHQWxCWTs7QUFvQmJHLFdBQVMsVUFBQ0MsTUFBRCxFQUFTUixRQUFULEVBQXNCO0FBQzdCLFNBQUssSUFBSVMsR0FBVCxJQUFnQkQsTUFBaEIsRUFBd0I7QUFDdEIsVUFBSUEsT0FBT0UsY0FBUCxDQUFzQkQsR0FBdEIsQ0FBSixFQUFnQztBQUM5QlQsbUJBQVdBLFNBQVNFLE9BQVQsQ0FBaUJULGNBQWNnQixHQUFkLENBQWpCLEVBQXFDRCxPQUFPQyxHQUFQLENBQXJDLENBQVg7QUFDRDtBQUNGOztBQUVELFdBQU9ULFFBQVA7QUFDRDs7QUE1QlksQyIsImZpbGUiOiJjb21wbGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4uL2luYy91dGlscyc7XG5cbmNvbnN0IEZMT0FUX1JFR0VYID0gLygtKT8oXFxkW1xcZFxcLl0qKS9nO1xuY29uc3QgZ2VuZXJhdGVUb2tlbiA9ICh0b2tlbikgPT4gJyR7JyArIHRva2VuICsgJ30nO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgdGVzdDogKHZhbHVlKSA9PiB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IHZhbHVlLm1hdGNoKEZMT0FUX1JFR0VYKTtcbiAgICByZXR1cm4gKGlzQXJyYXkobWF0Y2hlcykgJiYgbWF0Y2hlcy5sZW5ndGggPiAxKTtcbiAgfSxcblxuICB0ZW1wbGF0ZTogKHZhbHVlKSA9PiB7XG4gICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKEZMT0FUX1JFR0VYLCAoKSA9PiBnZW5lcmF0ZVRva2VuKGNvdW50ZXIrKykpO1xuICB9LFxuXG4gIHNwbGl0OiAodmFsdWUpID0+IHtcbiAgICBjb25zdCBzcGxpdFZhbHVlID0ge307XG5cbiAgICB2YWx1ZS5tYXRjaChGTE9BVF9SRUdFWCkuZm9yRWFjaCgodmFsdWUsIGkpID0+IHNwbGl0VmFsdWVbaV0gPSB2YWx1ZSk7XG5cbiAgICByZXR1cm4gc3BsaXRWYWx1ZTtcbiAgfSxcblxuICBjb21iaW5lOiAodmFsdWVzLCB0ZW1wbGF0ZSkgPT4ge1xuICAgIGZvciAobGV0IGtleSBpbiB2YWx1ZXMpIHtcbiAgICAgIGlmICh2YWx1ZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UoZ2VuZXJhdGVUb2tlbihrZXkpLCB2YWx1ZXNba2V5XSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9XG5cbn07Il19