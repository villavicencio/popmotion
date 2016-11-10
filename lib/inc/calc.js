'use strict';

exports.__esModule = true;
exports.stepProgress = exports.speedPerSecond = exports.speedPerFrame = exports.smooth = exports.restrict = exports.relativeValue = exports.random = exports.radiansToDegrees = exports.pointFromAngleAndDistance = exports.offset = exports.getProgressFromValue = exports.getValueFromProgress = exports.hypotenuse = exports.ease = exports.distance = exports.dilate = exports.degreesToRadians = exports.angle = undefined;

var _utils = require('./utils');

var ZERO_POINT = {
  x: 0,
  y: 0,
  z: 0
};

var distance1D = function (a, b) {
  return Math.abs(a - b);
};

/*
  Angle between points
  
  Translates the hypothetical line so that the 'from' coordinates
  are at 0,0
  
  @param [object]: X and Y coordinates of from point
  @param [object]: X and Y cordinates of to point
  @return [radian]: Angle between the two points in radians
*/
var angle = exports.angle = function (a) {
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ZERO_POINT;
  return radiansToDegrees(Math.atan2(a.x - b.x, a.y - b.y));
};

/*
  Convert degrees to radians
  
  @param [number]: Value in degrees
  @return [number]: Value in radians
*/
var degreesToRadians = exports.degreesToRadians = function (degrees) {
  return degrees * Math.PI / 180;
};

/*
  Dilate
  
  Change the progression between a and b according to dilation.
  
  So dilation = 0.5 would change
  
  a --------- b
  
  to
  
  a ---- b
  
  @param [number]: Previous value
  @param [number]: Current value
  @param [number]: Dilate progress by x
  @return [number]: Previous value plus the dilated difference
*/
var dilate = exports.dilate = function (a, b, dilation) {
  return a + (b - a) * dilation;
};

/*
  Distance
  
  Returns the distance between two n dimensional points.
  
  @param [object/number]: x and y or just x of point A
  @param [object/number]: (optional): x and y or just x of point B
  @return [number]: The distance between the two points
*/
var distance = exports.distance = function (a) {
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ZERO_POINT;

  // 1D dimensions
  if ((0, _utils.isNum)(a)) {
    return distance1D(a, b);

    // Multi-dimensional
  } else {
    var xDelta = distance1D(a.x, b.x);
    var yDelta = distance1D(a.y, b.y);
    var zDelta = (0, _utils.isNum)(a.z) ? distance1D(a.z, b.z) : 0;

    return Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2) + Math.pow(zDelta, 2));
  }
};

/*
  Ease value within ranged parameters
  
  @param [number]: Progress between 0 and 1
  @param [number]: Value of 0 progress
  @param [number]: Value of 1 progress
  @param [string || function]: Name of preset easing
    to use or generated easing function
  @return [number]: Value of eased progress in range
*/
var ease = exports.ease = function (progress, from, to, ease) {
  var progressLimited = restrict(progress, 0, 1);
  var easedProgress = ease(progressLimited);

  return getValueFromProgress(easedProgress, from, to);
};

/*
  Hypotenuse
  
  Returns the hypotenuse, side C, given the lengths of sides A and B.
  
  @param [number]: Length of A
  @param [number]: Length of B
  @return [number]: Length of C
*/
var hypotenuse = exports.hypotenuse = function (a, b) {
  return Math.sqrt(a * a + b * b);
};

/*
  Value in range from progress
  
  Given a lower limit and an upper limit, we return the value within
  that range as expressed by progress (a number from 0-1)
  
  @param [number]: The progress between lower and upper limits expressed 0-1
  @param [number]: Lower limit of range
  @param [number]: Upper limit of range
  @return [number]: Value as calculated from progress within range (not limited within range)
*/
var getValueFromProgress = exports.getValueFromProgress = function (progress, from, to) {
  return -progress * from + progress * to + from;
};

/*
  Progress within given range
  
  Given a lower limit and an upper limit, we return the progress
  (expressed as a number 0-1) represented by the given value, and
  limit that progress to within 0-1.
  
  @param [number]: Value to find progress within given range
  @param [number]: Lower limit 
  @param [number]: Upper limit
  @return [number]: Progress of value within range as expressed 0-1
*/
var getProgressFromValue = exports.getProgressFromValue = function (value, from, to) {
  return (value - from) / (to - from);
};

/*
  Offset between two objects of numbers

  If property is found in b not present in a, it will return `0` for that prop.
  
  @param [Point]: First object
  @param [Point]: Second object
  @return [Offset]: Distance metrics between two points
*/
var offset = exports.offset = function (a, b) {
  var offset = {};

  for (var key in b) {
    if (b.hasOwnProperty(key)) {
      offset[key] = (0, _utils.hasProperty)(a, key) ? b[key] - a[key] : 0;
    }
  }

  return offset;
};

/*
  Point from angle and distance
  
  @param [object]: 2D point of origin
  @param [number]: Angle from origin
  @param [number]: Distance from origin
  @return [object]: Calculated 2D point
*/
var pointFromAngleAndDistance = exports.pointFromAngleAndDistance = function (origin, angle, distance) {
  angle = degreesToRadians(angle);

  return {
    x: distance * Math.cos(angle) + origin.x,
    y: distance * Math.sin(angle) + origin.y
  };
};

/*
  Convert radians to degrees
  
  @param [number]: Value in radians
  @return [number]: Value in degrees
*/
var radiansToDegrees = exports.radiansToDegrees = function (radians) {
  return radians * 180 / Math.PI;
};

/*
  Return random number between range
  
  @param [number] (optional): Output minimum
  @param [number] (optional): Output maximum
  @return [number]: Random number within range, or 0 and 1 if none provided
*/
var random = exports.random = function () {
  var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return Math.random() * (max - min) + min;
};

/*
  Calculate relative value
  
  Takes the operator and value from a string, ie "+=5", and applies
  to the current value to resolve a new target.
  
  @param [number]: Current value
  @param [string]: Relative value
  @return [number]: New value
*/
var relativeValue = exports.relativeValue = function (current, relative) {
  var newValue = current;
  var equation = relative.split('=');
  var operator = equation[0];

  var _findValueAndUnit = (0, _utils.findValueAndUnit)(equation[1]),
      unit = _findValueAndUnit.unit,
      value = _findValueAndUnit.value;

  value = parseFloat(value);

  switch (operator) {
    case '+':
      newValue += value;
      break;
    case '-':
      newValue -= value;
      break;
    case '*':
      newValue *= value;
      break;
    case '/':
      newValue /= value;
      break;
  }

  if (unit) {
    newValue += unit;
  }

  return newValue;
};

/*
  Restrict value to range
  
  Return value within the range of lowerLimit and upperLimit
  
  @param [number]: Value to keep within range
  @param [number]: Lower limit of range
  @param [number]: Upper limit of range
  @return [number]: Value as limited within given range
*/
var restrict = exports.restrict = function (value, min, max) {
  return Math.max(Math.min(value, max), min);
};

/*
  Framerate-independent smoothing

  @param [number]: New value
  @param [number]: Old value
  @param [number]: Frame duration
  @param [number] (optional): Smoothing (0 is none)
*/
var smooth = exports.smooth = function (newValue, oldValue, duration) {
  var smoothing = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  return (0, _utils.toDecimal)(oldValue + duration * (newValue - oldValue) / Math.max(smoothing, duration));
};

/*
  Convert x per second to per frame velocity based on fps
  
  @param [number]: Unit per second
  @param [number]: Frame duration in ms
*/
var speedPerFrame = exports.speedPerFrame = function (xps, frameDuration) {
  return (0, _utils.isNum)(xps) ? xps / (1000 / frameDuration) : 0;
};

/*
  Convert velocity into velicity per second
  
  @param [number]: Unit per frame
  @param [number]: Frame duration in ms
*/
var speedPerSecond = exports.speedPerSecond = function (velocity, frameDuration) {
  return velocity * (1000 / frameDuration);
};

/*
  Create stepped version of 0-1 progress
  
  @param [number]: Current value
  @param [int]: Number of steps
  @return [number]: Stepped value
*/
var stepProgress = exports.stepProgress = function (progress, steps) {
  var segment = 1 / (steps - 1);
  var target = 1 - 1 / steps;
  var progressOfTarget = Math.min(progress / target, 1);

  return Math.floor(progressOfTarget / segment) * segment;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmMvY2FsYy5qcyJdLCJuYW1lcyI6WyJaRVJPX1BPSU5UIiwieCIsInkiLCJ6IiwiZGlzdGFuY2UxRCIsImEiLCJiIiwiTWF0aCIsImFicyIsImFuZ2xlIiwicmFkaWFuc1RvRGVncmVlcyIsImF0YW4yIiwiZGVncmVlc1RvUmFkaWFucyIsImRlZ3JlZXMiLCJQSSIsImRpbGF0ZSIsImRpbGF0aW9uIiwiZGlzdGFuY2UiLCJ4RGVsdGEiLCJ5RGVsdGEiLCJ6RGVsdGEiLCJzcXJ0IiwiZWFzZSIsInByb2dyZXNzIiwiZnJvbSIsInRvIiwicHJvZ3Jlc3NMaW1pdGVkIiwicmVzdHJpY3QiLCJlYXNlZFByb2dyZXNzIiwiZ2V0VmFsdWVGcm9tUHJvZ3Jlc3MiLCJoeXBvdGVudXNlIiwiZ2V0UHJvZ3Jlc3NGcm9tVmFsdWUiLCJ2YWx1ZSIsIm9mZnNldCIsImtleSIsImhhc093blByb3BlcnR5IiwicG9pbnRGcm9tQW5nbGVBbmREaXN0YW5jZSIsIm9yaWdpbiIsImNvcyIsInNpbiIsInJhZGlhbnMiLCJyYW5kb20iLCJtaW4iLCJtYXgiLCJyZWxhdGl2ZVZhbHVlIiwiY3VycmVudCIsInJlbGF0aXZlIiwibmV3VmFsdWUiLCJlcXVhdGlvbiIsInNwbGl0Iiwib3BlcmF0b3IiLCJ1bml0IiwicGFyc2VGbG9hdCIsInNtb290aCIsIm9sZFZhbHVlIiwiZHVyYXRpb24iLCJzbW9vdGhpbmciLCJzcGVlZFBlckZyYW1lIiwieHBzIiwiZnJhbWVEdXJhdGlvbiIsInNwZWVkUGVyU2Vjb25kIiwidmVsb2NpdHkiLCJzdGVwUHJvZ3Jlc3MiLCJzdGVwcyIsInNlZ21lbnQiLCJ0YXJnZXQiLCJwcm9ncmVzc09mVGFyZ2V0IiwiZmxvb3IiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7O0FBT0EsSUFBTUEsYUFBYTtBQUNqQkMsS0FBRyxDQURjO0FBRWpCQyxLQUFHLENBRmM7QUFHakJDLEtBQUc7QUFIYyxDQUFuQjs7QUFNQSxJQUFNQyxhQUFhLFVBQUND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QTZCRSxZQUFZLE9BQU9GLGFBQW5CLENBQTdCO0FBQUEsQ0FBdkI7O0FBRVA7Ozs7Ozs7QUFPTyxJQUFNRyxzQ0FBZSxVQUFDdkMsUUFBRCxFQUFXd0MsS0FBWCxFQUFxQjtBQUMvQyxNQUFNQyxVQUFVLEtBQUtELFFBQVEsQ0FBYixDQUFoQjtBQUNBLE1BQU1FLFNBQVMsSUFBSyxJQUFJRixLQUF4QjtBQUNBLE1BQU1HLG1CQUFtQjNELEtBQUttQyxHQUFMLENBQVNuQixXQUFXMEMsTUFBcEIsRUFBNEIsQ0FBNUIsQ0FBekI7O0FBRUEsU0FBTzFELEtBQUs0RCxLQUFMLENBQVdELG1CQUFtQkYsT0FBOUIsSUFBeUNBLE9BQWhEO0FBQ0QsQ0FOTSIsImZpbGUiOiJjYWxjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgaGFzUHJvcGVydHksXG4gIGlzTnVtLFxuICBmaW5kVmFsdWVBbmRVbml0LFxuICB0b0RlY2ltYWxcbn0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IFpFUk9fUE9JTlQgPSB7XG4gIHg6IDAsXG4gIHk6IDAsXG4gIHo6IDBcbn07XG5cbmNvbnN0IGRpc3RhbmNlMUQgPSAoYSwgYikgPT4gTWF0aC5hYnMoYSAtIGIpO1xuXG4vKlxuICBBbmdsZSBiZXR3ZWVuIHBvaW50c1xuICBcbiAgVHJhbnNsYXRlcyB0aGUgaHlwb3RoZXRpY2FsIGxpbmUgc28gdGhhdCB0aGUgJ2Zyb20nIGNvb3JkaW5hdGVzXG4gIGFyZSBhdCAwLDBcbiAgXG4gIEBwYXJhbSBbb2JqZWN0XTogWCBhbmQgWSBjb29yZGluYXRlcyBvZiBmcm9tIHBvaW50XG4gIEBwYXJhbSBbb2JqZWN0XTogWCBhbmQgWSBjb3JkaW5hdGVzIG9mIHRvIHBvaW50XG4gIEByZXR1cm4gW3JhZGlhbl06IEFuZ2xlIGJldHdlZW4gdGhlIHR3byBwb2ludHMgaW4gcmFkaWFuc1xuKi9cbmV4cG9ydCBjb25zdCBhbmdsZSA9IChhLCBiID0gWkVST19QT0lOVCkgPT4gcmFkaWFuc1RvRGVncmVlcyhNYXRoLmF0YW4yKGEueCAtIGIueCwgYS55IC0gYi55KSk7XG5cbi8qXG4gIENvbnZlcnQgZGVncmVlcyB0byByYWRpYW5zXG4gIFxuICBAcGFyYW0gW251bWJlcl06IFZhbHVlIGluIGRlZ3JlZXNcbiAgQHJldHVybiBbbnVtYmVyXTogVmFsdWUgaW4gcmFkaWFuc1xuKi9cbmV4cG9ydCBjb25zdCBkZWdyZWVzVG9SYWRpYW5zID0gKGRlZ3JlZXMpID0+IGRlZ3JlZXMgKiBNYXRoLlBJIC8gMTgwO1xuXG4vKlxuICBEaWxhdGVcbiAgXG4gIENoYW5nZSB0aGUgcHJvZ3Jlc3Npb24gYmV0d2VlbiBhIGFuZCBiIGFjY29yZGluZyB0byBkaWxhdGlvbi5cbiAgXG4gIFNvIGRpbGF0aW9uID0gMC41IHdvdWxkIGNoYW5nZVxuICBcbiAgYSAtLS0tLS0tLS0gYlxuICBcbiAgdG9cbiAgXG4gIGEgLS0tLSBiXG4gIFxuICBAcGFyYW0gW251bWJlcl06IFByZXZpb3VzIHZhbHVlXG4gIEBwYXJhbSBbbnVtYmVyXTogQ3VycmVudCB2YWx1ZVxuICBAcGFyYW0gW251bWJlcl06IERpbGF0ZSBwcm9ncmVzcyBieSB4XG4gIEByZXR1cm4gW251bWJlcl06IFByZXZpb3VzIHZhbHVlIHBsdXMgdGhlIGRpbGF0ZWQgZGlmZmVyZW5jZVxuKi9cbmV4cG9ydCBjb25zdCBkaWxhdGUgPSAoYSwgYiwgZGlsYXRpb24pID0+IGEgKyAoKGIgLSBhKSAqIGRpbGF0aW9uKTtcblxuLypcbiAgRGlzdGFuY2VcbiAgXG4gIFJldHVybnMgdGhlIGRpc3RhbmNlIGJldHdlZW4gdHdvIG4gZGltZW5zaW9uYWwgcG9pbnRzLlxuICBcbiAgQHBhcmFtIFtvYmplY3QvbnVtYmVyXTogeCBhbmQgeSBvciBqdXN0IHggb2YgcG9pbnQgQVxuICBAcGFyYW0gW29iamVjdC9udW1iZXJdOiAob3B0aW9uYWwpOiB4IGFuZCB5IG9yIGp1c3QgeCBvZiBwb2ludCBCXG4gIEByZXR1cm4gW251bWJlcl06IFRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSB0d28gcG9pbnRzXG4qL1xuZXhwb3J0IGNvbnN0IGRpc3RhbmNlID0gKGEsIGIgPSBaRVJPX1BPSU5UKSA9PiB7XG4gIC8vIDFEIGRpbWVuc2lvbnNcbiAgaWYgKGlzTnVtKGEpKSB7XG4gICAgcmV0dXJuIGRpc3RhbmNlMUQoYSwgYik7XG5cbiAgLy8gTXVsdGktZGltZW5zaW9uYWxcbiAgfSBlbHNlIHtcbiAgICBjb25zdCB4RGVsdGEgPSBkaXN0YW5jZTFEKGEueCwgYi54KTtcbiAgICBjb25zdCB5RGVsdGEgPSBkaXN0YW5jZTFEKGEueSwgYi55KTtcbiAgICBjb25zdCB6RGVsdGEgPSAoaXNOdW0oYS56KSkgPyBkaXN0YW5jZTFEKGEueiwgYi56KSA6IDA7XG5cbiAgICByZXR1cm4gTWF0aC5zcXJ0KCh4RGVsdGEgKiogMikgKyAoeURlbHRhICoqIDIpICsgKHpEZWx0YSAqKiAyKSk7XG4gIH1cbn07XG5cbi8qXG4gIEVhc2UgdmFsdWUgd2l0aGluIHJhbmdlZCBwYXJhbWV0ZXJzXG4gIFxuICBAcGFyYW0gW251bWJlcl06IFByb2dyZXNzIGJldHdlZW4gMCBhbmQgMVxuICBAcGFyYW0gW251bWJlcl06IFZhbHVlIG9mIDAgcHJvZ3Jlc3NcbiAgQHBhcmFtIFtudW1iZXJdOiBWYWx1ZSBvZiAxIHByb2dyZXNzXG4gIEBwYXJhbSBbc3RyaW5nIHx8IGZ1bmN0aW9uXTogTmFtZSBvZiBwcmVzZXQgZWFzaW5nXG4gICAgdG8gdXNlIG9yIGdlbmVyYXRlZCBlYXNpbmcgZnVuY3Rpb25cbiAgQHJldHVybiBbbnVtYmVyXTogVmFsdWUgb2YgZWFzZWQgcHJvZ3Jlc3MgaW4gcmFuZ2VcbiovIFxuZXhwb3J0IGNvbnN0IGVhc2UgPSAocHJvZ3Jlc3MsIGZyb20sIHRvLCBlYXNlKSA9PiB7XG4gIGNvbnN0IHByb2dyZXNzTGltaXRlZCA9IHJlc3RyaWN0KHByb2dyZXNzLCAwLCAxKTtcbiAgY29uc3QgZWFzZWRQcm9ncmVzcyA9IGVhc2UocHJvZ3Jlc3NMaW1pdGVkKTtcblxuICByZXR1cm4gZ2V0VmFsdWVGcm9tUHJvZ3Jlc3MoZWFzZWRQcm9ncmVzcywgZnJvbSwgdG8pO1xufTtcbiBcbi8qXG4gIEh5cG90ZW51c2VcbiAgXG4gIFJldHVybnMgdGhlIGh5cG90ZW51c2UsIHNpZGUgQywgZ2l2ZW4gdGhlIGxlbmd0aHMgb2Ygc2lkZXMgQSBhbmQgQi5cbiAgXG4gIEBwYXJhbSBbbnVtYmVyXTogTGVuZ3RoIG9mIEFcbiAgQHBhcmFtIFtudW1iZXJdOiBMZW5ndGggb2YgQlxuICBAcmV0dXJuIFtudW1iZXJdOiBMZW5ndGggb2YgQ1xuKi9cbmV4cG9ydCBjb25zdCBoeXBvdGVudXNlID0gKGEsIGIpID0+IE1hdGguc3FydCgoYSAqIGEpICsgKGIgKiBiKSk7XG5cbi8qXG4gIFZhbHVlIGluIHJhbmdlIGZyb20gcHJvZ3Jlc3NcbiAgXG4gIEdpdmVuIGEgbG93ZXIgbGltaXQgYW5kIGFuIHVwcGVyIGxpbWl0LCB3ZSByZXR1cm4gdGhlIHZhbHVlIHdpdGhpblxuICB0aGF0IHJhbmdlIGFzIGV4cHJlc3NlZCBieSBwcm9ncmVzcyAoYSBudW1iZXIgZnJvbSAwLTEpXG4gIFxuICBAcGFyYW0gW251bWJlcl06IFRoZSBwcm9ncmVzcyBiZXR3ZWVuIGxvd2VyIGFuZCB1cHBlciBsaW1pdHMgZXhwcmVzc2VkIDAtMVxuICBAcGFyYW0gW251bWJlcl06IExvd2VyIGxpbWl0IG9mIHJhbmdlXG4gIEBwYXJhbSBbbnVtYmVyXTogVXBwZXIgbGltaXQgb2YgcmFuZ2VcbiAgQHJldHVybiBbbnVtYmVyXTogVmFsdWUgYXMgY2FsY3VsYXRlZCBmcm9tIHByb2dyZXNzIHdpdGhpbiByYW5nZSAobm90IGxpbWl0ZWQgd2l0aGluIHJhbmdlKVxuKi9cbmV4cG9ydCBjb25zdCBnZXRWYWx1ZUZyb21Qcm9ncmVzcyA9IChwcm9ncmVzcywgZnJvbSwgdG8pID0+ICgtIHByb2dyZXNzICogZnJvbSkgKyAocHJvZ3Jlc3MgKiB0bykgKyBmcm9tO1xuXG4vKlxuICBQcm9ncmVzcyB3aXRoaW4gZ2l2ZW4gcmFuZ2VcbiAgXG4gIEdpdmVuIGEgbG93ZXIgbGltaXQgYW5kIGFuIHVwcGVyIGxpbWl0LCB3ZSByZXR1cm4gdGhlIHByb2dyZXNzXG4gIChleHByZXNzZWQgYXMgYSBudW1iZXIgMC0xKSByZXByZXNlbnRlZCBieSB0aGUgZ2l2ZW4gdmFsdWUsIGFuZFxuICBsaW1pdCB0aGF0IHByb2dyZXNzIHRvIHdpdGhpbiAwLTEuXG4gIFxuICBAcGFyYW0gW251bWJlcl06IFZhbHVlIHRvIGZpbmQgcHJvZ3Jlc3Mgd2l0aGluIGdpdmVuIHJhbmdlXG4gIEBwYXJhbSBbbnVtYmVyXTogTG93ZXIgbGltaXQgXG4gIEBwYXJhbSBbbnVtYmVyXTogVXBwZXIgbGltaXRcbiAgQHJldHVybiBbbnVtYmVyXTogUHJvZ3Jlc3Mgb2YgdmFsdWUgd2l0aGluIHJhbmdlIGFzIGV4cHJlc3NlZCAwLTFcbiovXG5leHBvcnQgY29uc3QgZ2V0UHJvZ3Jlc3NGcm9tVmFsdWUgPSAodmFsdWUsIGZyb20sIHRvKSA9PiAodmFsdWUgLSBmcm9tKSAvICh0byAtIGZyb20pO1xuXG4vKlxuICBPZmZzZXQgYmV0d2VlbiB0d28gb2JqZWN0cyBvZiBudW1iZXJzXG5cbiAgSWYgcHJvcGVydHkgaXMgZm91bmQgaW4gYiBub3QgcHJlc2VudCBpbiBhLCBpdCB3aWxsIHJldHVybiBgMGAgZm9yIHRoYXQgcHJvcC5cbiAgXG4gIEBwYXJhbSBbUG9pbnRdOiBGaXJzdCBvYmplY3RcbiAgQHBhcmFtIFtQb2ludF06IFNlY29uZCBvYmplY3RcbiAgQHJldHVybiBbT2Zmc2V0XTogRGlzdGFuY2UgbWV0cmljcyBiZXR3ZWVuIHR3byBwb2ludHNcbiovXG5leHBvcnQgY29uc3Qgb2Zmc2V0ID0gKGEsIGIpID0+IHtcbiAgY29uc3Qgb2Zmc2V0ID0ge307XG5cbiAgZm9yIChsZXQga2V5IGluIGIpIHtcbiAgICBpZiAoYi5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBvZmZzZXRba2V5XSA9IGhhc1Byb3BlcnR5KGEsIGtleSkgPyBiW2tleV0gLSBhW2tleV0gOiAwO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvZmZzZXQ7XG59O1xuXG4vKlxuICBQb2ludCBmcm9tIGFuZ2xlIGFuZCBkaXN0YW5jZVxuICBcbiAgQHBhcmFtIFtvYmplY3RdOiAyRCBwb2ludCBvZiBvcmlnaW5cbiAgQHBhcmFtIFtudW1iZXJdOiBBbmdsZSBmcm9tIG9yaWdpblxuICBAcGFyYW0gW251bWJlcl06IERpc3RhbmNlIGZyb20gb3JpZ2luXG4gIEByZXR1cm4gW29iamVjdF06IENhbGN1bGF0ZWQgMkQgcG9pbnRcbiovXG5leHBvcnQgY29uc3QgcG9pbnRGcm9tQW5nbGVBbmREaXN0YW5jZSA9IChvcmlnaW4sIGFuZ2xlLCBkaXN0YW5jZSkgPT4ge1xuICBhbmdsZSA9IGRlZ3JlZXNUb1JhZGlhbnMoYW5nbGUpO1xuXG4gIHJldHVybiB7XG4gICAgeDogZGlzdGFuY2UgKiBNYXRoLmNvcyhhbmdsZSkgKyBvcmlnaW4ueCxcbiAgICB5OiBkaXN0YW5jZSAqIE1hdGguc2luKGFuZ2xlKSArIG9yaWdpbi55XG4gIH07XG59O1xuXG4vKlxuICBDb252ZXJ0IHJhZGlhbnMgdG8gZGVncmVlc1xuICBcbiAgQHBhcmFtIFtudW1iZXJdOiBWYWx1ZSBpbiByYWRpYW5zXG4gIEByZXR1cm4gW251bWJlcl06IFZhbHVlIGluIGRlZ3JlZXNcbiovXG5leHBvcnQgY29uc3QgcmFkaWFuc1RvRGVncmVlcyA9IChyYWRpYW5zKSA9PiByYWRpYW5zICogMTgwIC8gTWF0aC5QSTtcblxuLypcbiAgUmV0dXJuIHJhbmRvbSBudW1iZXIgYmV0d2VlbiByYW5nZVxuICBcbiAgQHBhcmFtIFtudW1iZXJdIChvcHRpb25hbCk6IE91dHB1dCBtaW5pbXVtXG4gIEBwYXJhbSBbbnVtYmVyXSAob3B0aW9uYWwpOiBPdXRwdXQgbWF4aW11bVxuICBAcmV0dXJuIFtudW1iZXJdOiBSYW5kb20gbnVtYmVyIHdpdGhpbiByYW5nZSwgb3IgMCBhbmQgMSBpZiBub25lIHByb3ZpZGVkXG4qL1xuZXhwb3J0IGNvbnN0IHJhbmRvbSA9IChtaW4gPSAwLCBtYXggPSAxKSA9PiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XG5cbi8qXG4gIENhbGN1bGF0ZSByZWxhdGl2ZSB2YWx1ZVxuICBcbiAgVGFrZXMgdGhlIG9wZXJhdG9yIGFuZCB2YWx1ZSBmcm9tIGEgc3RyaW5nLCBpZSBcIis9NVwiLCBhbmQgYXBwbGllc1xuICB0byB0aGUgY3VycmVudCB2YWx1ZSB0byByZXNvbHZlIGEgbmV3IHRhcmdldC5cbiAgXG4gIEBwYXJhbSBbbnVtYmVyXTogQ3VycmVudCB2YWx1ZVxuICBAcGFyYW0gW3N0cmluZ106IFJlbGF0aXZlIHZhbHVlXG4gIEByZXR1cm4gW251bWJlcl06IE5ldyB2YWx1ZVxuKi9cbmV4cG9ydCBjb25zdCByZWxhdGl2ZVZhbHVlID0gKGN1cnJlbnQsIHJlbGF0aXZlKSA9PiB7XG4gIGxldCBuZXdWYWx1ZSA9IGN1cnJlbnQ7XG4gIGNvbnN0IGVxdWF0aW9uID0gcmVsYXRpdmUuc3BsaXQoJz0nKTtcbiAgY29uc3Qgb3BlcmF0b3IgPSBlcXVhdGlvblswXTtcbiAgbGV0IHsgdW5pdCwgdmFsdWUgfSA9IGZpbmRWYWx1ZUFuZFVuaXQoZXF1YXRpb25bMV0pO1xuXG4gIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZSk7XG5cbiAgc3dpdGNoIChvcGVyYXRvcikge1xuICBjYXNlICcrJzpcbiAgICBuZXdWYWx1ZSArPSB2YWx1ZTtcbiAgICBicmVhaztcbiAgY2FzZSAnLSc6XG4gICAgbmV3VmFsdWUgLT0gdmFsdWU7XG4gICAgYnJlYWs7XG4gIGNhc2UgJyonOlxuICAgIG5ld1ZhbHVlICo9IHZhbHVlO1xuICAgIGJyZWFrO1xuICBjYXNlICcvJzpcbiAgICBuZXdWYWx1ZSAvPSB2YWx1ZTtcbiAgICBicmVhaztcbiAgfVxuICBcbiAgaWYgKHVuaXQpIHtcbiAgICBuZXdWYWx1ZSArPSB1bml0O1xuICB9XG5cbiAgcmV0dXJuIG5ld1ZhbHVlO1xufTtcblxuLypcbiAgUmVzdHJpY3QgdmFsdWUgdG8gcmFuZ2VcbiAgXG4gIFJldHVybiB2YWx1ZSB3aXRoaW4gdGhlIHJhbmdlIG9mIGxvd2VyTGltaXQgYW5kIHVwcGVyTGltaXRcbiAgXG4gIEBwYXJhbSBbbnVtYmVyXTogVmFsdWUgdG8ga2VlcCB3aXRoaW4gcmFuZ2VcbiAgQHBhcmFtIFtudW1iZXJdOiBMb3dlciBsaW1pdCBvZiByYW5nZVxuICBAcGFyYW0gW251bWJlcl06IFVwcGVyIGxpbWl0IG9mIHJhbmdlXG4gIEByZXR1cm4gW251bWJlcl06IFZhbHVlIGFzIGxpbWl0ZWQgd2l0aGluIGdpdmVuIHJhbmdlXG4qL1xuZXhwb3J0IGNvbnN0IHJlc3RyaWN0ID0gKHZhbHVlLCBtaW4sIG1heCkgPT4gTWF0aC5tYXgoTWF0aC5taW4odmFsdWUsIG1heCksIG1pbik7XG5cbi8qXG4gIEZyYW1lcmF0ZS1pbmRlcGVuZGVudCBzbW9vdGhpbmdcblxuICBAcGFyYW0gW251bWJlcl06IE5ldyB2YWx1ZVxuICBAcGFyYW0gW251bWJlcl06IE9sZCB2YWx1ZVxuICBAcGFyYW0gW251bWJlcl06IEZyYW1lIGR1cmF0aW9uXG4gIEBwYXJhbSBbbnVtYmVyXSAob3B0aW9uYWwpOiBTbW9vdGhpbmcgKDAgaXMgbm9uZSlcbiovXG5leHBvcnQgY29uc3Qgc21vb3RoID0gKG5ld1ZhbHVlLCBvbGRWYWx1ZSwgZHVyYXRpb24sIHNtb290aGluZyA9IDApID0+IHRvRGVjaW1hbChvbGRWYWx1ZSArIChkdXJhdGlvbiAqIChuZXdWYWx1ZSAtIG9sZFZhbHVlKSAvIE1hdGgubWF4KHNtb290aGluZywgZHVyYXRpb24pKSk7XG5cbi8qXG4gIENvbnZlcnQgeCBwZXIgc2Vjb25kIHRvIHBlciBmcmFtZSB2ZWxvY2l0eSBiYXNlZCBvbiBmcHNcbiAgXG4gIEBwYXJhbSBbbnVtYmVyXTogVW5pdCBwZXIgc2Vjb25kXG4gIEBwYXJhbSBbbnVtYmVyXTogRnJhbWUgZHVyYXRpb24gaW4gbXNcbiovXG5leHBvcnQgY29uc3Qgc3BlZWRQZXJGcmFtZSA9ICh4cHMsIGZyYW1lRHVyYXRpb24pID0+IChpc051bSh4cHMpKSA/IHhwcyAvICgxMDAwIC8gZnJhbWVEdXJhdGlvbikgOiAwO1xuXG4vKlxuICBDb252ZXJ0IHZlbG9jaXR5IGludG8gdmVsaWNpdHkgcGVyIHNlY29uZFxuICBcbiAgQHBhcmFtIFtudW1iZXJdOiBVbml0IHBlciBmcmFtZVxuICBAcGFyYW0gW251bWJlcl06IEZyYW1lIGR1cmF0aW9uIGluIG1zXG4qL1xuZXhwb3J0IGNvbnN0IHNwZWVkUGVyU2Vjb25kID0gKHZlbG9jaXR5LCBmcmFtZUR1cmF0aW9uKSA9PiB2ZWxvY2l0eSAqICgxMDAwIC8gZnJhbWVEdXJhdGlvbik7XG5cbi8qXG4gIENyZWF0ZSBzdGVwcGVkIHZlcnNpb24gb2YgMC0xIHByb2dyZXNzXG4gIFxuICBAcGFyYW0gW251bWJlcl06IEN1cnJlbnQgdmFsdWVcbiAgQHBhcmFtIFtpbnRdOiBOdW1iZXIgb2Ygc3RlcHNcbiAgQHJldHVybiBbbnVtYmVyXTogU3RlcHBlZCB2YWx1ZVxuKi9cbmV4cG9ydCBjb25zdCBzdGVwUHJvZ3Jlc3MgPSAocHJvZ3Jlc3MsIHN0ZXBzKSA9PiB7XG4gIGNvbnN0IHNlZ21lbnQgPSAxIC8gKHN0ZXBzIC0gMSk7XG4gIGNvbnN0IHRhcmdldCA9IDEgLSAoMSAvIHN0ZXBzKTtcbiAgY29uc3QgcHJvZ3Jlc3NPZlRhcmdldCA9IE1hdGgubWluKHByb2dyZXNzIC8gdGFyZ2V0LCAxKTtcblxuICByZXR1cm4gTWF0aC5mbG9vcihwcm9ncmVzc09mVGFyZ2V0IC8gc2VnbWVudCkgKiBzZWdtZW50O1xufTsiXX0=