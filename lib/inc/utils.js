'use strict';

exports.__esModule = true;
var CAMEL_CASE_PATTERN = /([a-z])([A-Z])/g;
var REPLACE_TEMPLATE = '$1-$2';
var HAS_PERFORMANCE_NOW = typeof performance !== 'undefined' && performance.now;

/*
  Get var type as string
  
  @param: Variable to test
  @return [string]: Returns, for instance 'Object' if [object Object]
*/
var varType = function (variable) {
  return Object.prototype.toString.call(variable).slice(8, -1);
};

/*
  Convert camelCase to dash-case

  @param [string]
  @return [string]
*/
var camelToDash = exports.camelToDash = function (string) {
  return string.replace(CAMEL_CASE_PATTERN, REPLACE_TEMPLATE).toLowerCase();
};

var createDelimited = exports.createDelimited = function (values, terms, delimiter, chop) {
  var numTerms = terms.length;
  var combined = '';

  for (var i = 0; i < numTerms; i++) {
    var term = terms[i];
    if (values.hasOwnProperty(term)) {
      combined += values[term] + delimiter;
    }
  }

  if (chop) {
    combined = combined.slice(0, -chop);
  }

  return combined;
};

/*
  Create a function string

  '20px', 'translate' -> 'translate(20px)'

  @param [string]
  @param [string]
  @return [string]
*/
var createFunctionString = exports.createFunctionString = function (value, prefix) {
  return prefix + '(' + value + ')';
};

/*
  Generate current timestamp
  
  @return [timestamp]: Current UNIX timestamp
*/
var currentTime = exports.currentTime = HAS_PERFORMANCE_NOW ? function () {
  return performance.now();
} : function () {
  return new Date().getTime();
};

/*
  Split a value into a value/unit object
  
    "200px" -> { value: 200, unit: "px" }
    
  @param [string]: Value to split
  @return [object]: Object with value and unit props
*/
var findValueAndUnit = exports.findValueAndUnit = function (value) {
  if (value.match) {
    var splitValue = value.match(/(-?\d*\.?\d*)(.*)/);

    return {
      value: parseFloat(splitValue[1]),
      unit: splitValue[2]
    };
  } else {
    return { value: value };
  }
};

/*
  Split color string into map of color properties

  "rgba(255, 255, 255, 0)", ["Red", 'Green", "Blue", "Alpha"]

  { Red: 255... }
*/
var getColorValues = exports.getColorValues = function (value, colorTerms) {
  var numColorTerms = colorTerms.length;
  var colorValues = {};
  var colors = splitCommaDelimited(getValueFromFunctionString(value));

  for (var i = 0; i < numColorTerms; i++) {
    colorValues[colorTerms[i]] = colors[i] !== undefined ? colors[i] : 1;
  }

  return colorValues;
};

/*
  Get value from function string

  "translateX(20px)" -> "20px"
*/
var getValueFromFunctionString = exports.getValueFromFunctionString = function (value) {
  return value.substring(value.indexOf('(') + 1, value.lastIndexOf(')'));
};

/*
  Check if two objects have changed from each other
  
  @param [object]: Input A
  @param [object]: Input B
  @return [boolean]: True if different
*/
var hasChanged = exports.hasChanged = function (a, b) {
  var changed = false;

  for (var key in a) {
    if (a.hasOwnProperty(key)) {
      if (hasProperty(b, key)) {
        if (a[key] !== b[key]) {
          changed = true;
        }
      } else {
        changed = true;
      }
    }
  }

  return changed;
};

/*
  Check if object has property and it isn't undefined

  @param [object]
  @param [string]
  @return [boolean]
*/
var hasProperty = exports.hasProperty = function (object, propertyName) {
  return object.hasOwnProperty(propertyName) && object[propertyName] !== undefined;
};

/*
  Is utils var an array ? 
  
  @param: Variable to test
  @return [boolean]: Returns true if utils.varType === 'Array'
*/
var isArray = exports.isArray = function (arr) {
  return varType(arr) === 'Array';
};

/*
  Is utils var a function ? 
  
  @param: Variable to test
  @return [boolean]: Returns true if utils.varType === 'Function'
*/
var isFunc = exports.isFunc = function (obj) {
  return varType(obj) === 'Function';
};

/*
  Is utils var a number?
  
  @param: Variable to test
  @return [boolean]: Returns true if typeof === 'number'
*/
var isNum = exports.isNum = function (num) {
  return typeof num === 'number';
};

/*
  Is utils var an object?
  
  @param: Variable to test
  @return [boolean]: Returns true if typeof === 'object'
*/
var isObj = exports.isObj = function (obj) {
  return typeof obj === 'object';
};

/*
  Is utils a relative value assignment?
  
  @param [string]: Variable to test
  @return [boolean]: If utils looks like a relative value assignment
*/
var isRelativeValue = exports.isRelativeValue = function (value) {
  return value && value.indexOf && value.indexOf('=') > 0 ? true : false;
};

/*
  Is utils var a string ? 
  
  @param: Variable to test
  @return [boolean]: Returns true if typeof str === 'string'
*/
var isString = exports.isString = function (str) {
  return typeof str === 'string';
};

/*
  @param [string || NodeList]:
    If string, treated as selector.
    If not, treated as preexisting NodeList

  @return [Array]
*/
var selectDom = exports.selectDom = function (selector) {
  var nodes = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;
  return nodes.length ? [].slice.call(nodes) : [].push(nodes);
};

/*
  Split comma-delimited string

  "foo,bar" -> ["foo", "bar"]

  @param [string]
  @return [array]
*/
var splitCommaDelimited = exports.splitCommaDelimited = function (value) {
  return isString(value) ? value.split(/,\s*/) : [value];
};

/*
  Split space-delimited string

  "foo bar" -> ["foo", "bar"]

  @param [string]
  @return [array]
*/
var splitSpaceDelimited = exports.splitSpaceDelimited = function (value) {
  return isString(value) ? value.split(' ') : [value];
};

/*
  Convert number to x decimal places

  @param [number]
  @param [number]
  @return [number]
*/
var toDecimal = exports.toDecimal = function (num) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

  precision = Math.pow(10, precision);
  return Math.round(num * precision) / precision;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmMvdXRpbHMuanMiXSwibmFtZXMiOlsiQ0FNRUxfQ0FTRV9QQVRURVJOIiwiUkVQTEFDRV9URU1QTEFURSIsIkhBU19QRVJGT1JNQU5DRV9OT1ciLCJwZXJmb3JtYW5jZSIsIm5vdyIsInZhclR5cGUiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJ2YXJpYWJsZSIsInNsaWNlIiwiY2FtZWxUb0Rhc2giLCJzdHJpbmciLCJyZXBsYWNlIiwidG9Mb3dlckNhc2UiLCJjcmVhdGVEZWxpbWl0ZWQiLCJ2YWx1ZXMiLCJ0ZXJtcyIsImRlbGltaXRlciIsImNob3AiLCJudW1UZXJtcyIsImxlbmd0aCIsImNvbWJpbmVkIiwiaSIsInRlcm0iLCJoYXNPd25Qcm9wZXJ0eSIsImNyZWF0ZUZ1bmN0aW9uU3RyaW5nIiwidmFsdWUiLCJwcmVmaXgiLCJjdXJyZW50VGltZSIsIkRhdGUiLCJnZXRUaW1lIiwiZmluZFZhbHVlQW5kVW5pdCIsIm1hdGNoIiwic3BsaXRWYWx1ZSIsInBhcnNlRmxvYXQiLCJ1bml0IiwiZ2V0Q29sb3JWYWx1ZXMiLCJjb2xvclRlcm1zIiwibnVtQ29sb3JUZXJtcyIsImNvbG9yVmFsdWVzIiwiY29sb3JzIiwic3BsaXRDb21tYURlbGltaXRlZCIsImdldFZhbHVlRnJvbUZ1bmN0aW9uU3RyaW5nIiwidW5kZWZpbmVkIiwic3Vic3RyaW5nIiwiaW5kZXhPZiIsImxhc3RJbmRleE9mIiwiaGFzQ2hhbmdlZCIsImEiLCJiIiwiY2hhbmdlZCIsImtleSIsImhhc1Byb3BlcnR5Iiwib2JqZWN0IiwicHJvcGVydHlOYW1lIiwiaXNBcnJheSIsImFyciIsImlzRnVuYyIsIm9iaiIsImlzTnVtIiwibnVtIiwiaXNPYmoiLCJpc1JlbGF0aXZlVmFsdWUiLCJpc1N0cmluZyIsInN0ciIsInNlbGVjdERvbSIsInNlbGVjdG9yIiwibm9kZXMiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJwdXNoIiwic3BsaXQiLCJzcGxpdFNwYWNlRGVsaW1pdGVkIiwidG9EZWNpbWFsIiwicHJlY2lzaW9uIiwiTWF0aCIsInJvdW5kIl0sIm1hcHBpbmdzIjoiOzs7QUFBQSxJQUFNQSxxQkFBcUIsaUJBQTNCO0FBQ0EsSUFBTUMsbUJBQW1CLE9BQXpCO0FBQ0EsSUFBTUMsc0JBQXVCLE9BQU9DLFdBQVAsS0FBdUIsV0FBdkIsSUFBc0NBLFlBQVlDLEdBQS9FOztBQUVBOzs7Ozs7QUFNQSxJQUFNQyxVQUFVO0FBQUEsU0FBWUMsT0FBT0MsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEJDLElBQTFCLENBQStCQyxRQUEvQixFQUF5Q0MsS0FBekMsQ0FBK0MsQ0FBL0MsRUFBa0QsQ0FBQyxDQUFuRCxDQUFaO0FBQUEsQ0FBaEI7O0FBRUE7Ozs7OztBQU1PLElBQU1DLG9DQUFjLFVBQUNDLE1BQUQ7QUFBQSxTQUFZQSxPQUFPQyxPQUFQLENBQWVkLGtCQUFmLEVBQW1DQyxnQkFBbkMsRUFBcURjLFdBQXJELEVBQVo7QUFBQSxDQUFwQjs7QUFFQSxJQUFNQyw0Q0FBa0IsVUFBQ0MsTUFBRCxFQUFTQyxLQUFULEVBQWdCQyxTQUFoQixFQUEyQkMsSUFBM0IsRUFBb0M7QUFDakUsTUFBTUMsV0FBV0gsTUFBTUksTUFBdkI7QUFDQSxNQUFJQyxXQUFXLEVBQWY7O0FBRUEsT0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlILFFBQXBCLEVBQThCRyxHQUE5QixFQUFtQztBQUNqQyxRQUFNQyxPQUFPUCxNQUFNTSxDQUFOLENBQWI7QUFDQSxRQUFJUCxPQUFPUyxjQUFQLENBQXNCRCxJQUF0QixDQUFKLEVBQWlDO0FBQy9CRixrQkFBWU4sT0FBT1EsSUFBUCxJQUFlTixTQUEzQjtBQUNEO0FBQ0Y7O0FBRUQsTUFBSUMsSUFBSixFQUFVO0FBQ1JHLGVBQVdBLFNBQVNaLEtBQVQsQ0FBZSxDQUFmLEVBQWtCLENBQUNTLElBQW5CLENBQVg7QUFDRDs7QUFFRCxTQUFPRyxRQUFQO0FBQ0QsQ0FoQk07O0FBa0JQOzs7Ozs7Ozs7QUFT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LENBQVdoQixNQUFNYyxTQUFqQixJQUE4QkEsU0FBckM7QUFDRCxDQUhNIiwiZmlsZSI6InV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQ0FNRUxfQ0FTRV9QQVRURVJOID0gLyhbYS16XSkoW0EtWl0pL2c7XG5jb25zdCBSRVBMQUNFX1RFTVBMQVRFID0gJyQxLSQyJztcbmNvbnN0IEhBU19QRVJGT1JNQU5DRV9OT1cgPSAodHlwZW9mIHBlcmZvcm1hbmNlICE9PSAndW5kZWZpbmVkJyAmJiBwZXJmb3JtYW5jZS5ub3cpO1xuXG4vKlxuICBHZXQgdmFyIHR5cGUgYXMgc3RyaW5nXG4gIFxuICBAcGFyYW06IFZhcmlhYmxlIHRvIHRlc3RcbiAgQHJldHVybiBbc3RyaW5nXTogUmV0dXJucywgZm9yIGluc3RhbmNlICdPYmplY3QnIGlmIFtvYmplY3QgT2JqZWN0XVxuKi9cbmNvbnN0IHZhclR5cGUgPSB2YXJpYWJsZSA9PiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFyaWFibGUpLnNsaWNlKDgsIC0xKTtcblxuLypcbiAgQ29udmVydCBjYW1lbENhc2UgdG8gZGFzaC1jYXNlXG5cbiAgQHBhcmFtIFtzdHJpbmddXG4gIEByZXR1cm4gW3N0cmluZ11cbiovXG5leHBvcnQgY29uc3QgY2FtZWxUb0Rhc2ggPSAoc3RyaW5nKSA9PiBzdHJpbmcucmVwbGFjZShDQU1FTF9DQVNFX1BBVFRFUk4sIFJFUExBQ0VfVEVNUExBVEUpLnRvTG93ZXJDYXNlKCk7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVEZWxpbWl0ZWQgPSAodmFsdWVzLCB0ZXJtcywgZGVsaW1pdGVyLCBjaG9wKSA9PiB7XG4gIGNvbnN0IG51bVRlcm1zID0gdGVybXMubGVuZ3RoO1xuICBsZXQgY29tYmluZWQgPSAnJztcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVRlcm1zOyBpKyspIHtcbiAgICBjb25zdCB0ZXJtID0gdGVybXNbaV07XG4gICAgaWYgKHZhbHVlcy5oYXNPd25Qcm9wZXJ0eSh0ZXJtKSkge1xuICAgICAgY29tYmluZWQgKz0gdmFsdWVzW3Rlcm1dICsgZGVsaW1pdGVyO1xuICAgIH1cbiAgfVxuXG4gIGlmIChjaG9wKSB7XG4gICAgY29tYmluZWQgPSBjb21iaW5lZC5zbGljZSgwLCAtY2hvcCk7XG4gIH1cblxuICByZXR1cm4gY29tYmluZWQ7XG59O1xuXG4vKlxuICBDcmVhdGUgYSBmdW5jdGlvbiBzdHJpbmdcblxuICAnMjBweCcsICd0cmFuc2xhdGUnIC0+ICd0cmFuc2xhdGUoMjBweCknXG5cbiAgQHBhcmFtIFtzdHJpbmddXG4gIEBwYXJhbSBbc3RyaW5nXVxuICBAcmV0dXJuIFtzdHJpbmddXG4qL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUZ1bmN0aW9uU3RyaW5nID0gKHZhbHVlLCBwcmVmaXgpID0+IGAke3ByZWZpeH0oJHt2YWx1ZX0pYDtcblxuLypcbiAgR2VuZXJhdGUgY3VycmVudCB0aW1lc3RhbXBcbiAgXG4gIEByZXR1cm4gW3RpbWVzdGFtcF06IEN1cnJlbnQgVU5JWCB0aW1lc3RhbXBcbiovXG5leHBvcnQgY29uc3QgY3VycmVudFRpbWUgPSBIQVNfUEVSRk9STUFOQ0VfTk9XID8gKCkgPT4gcGVyZm9ybWFuY2Uubm93KCkgOiAoKSA9PiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuLypcbiAgU3BsaXQgYSB2YWx1ZSBpbnRvIGEgdmFsdWUvdW5pdCBvYmplY3RcbiAgXG4gICAgXCIyMDBweFwiIC0+IHsgdmFsdWU6IDIwMCwgdW5pdDogXCJweFwiIH1cbiAgICBcbiAgQHBhcmFtIFtzdHJpbmddOiBWYWx1ZSB0byBzcGxpdFxuICBAcmV0dXJuIFtvYmplY3RdOiBPYmplY3Qgd2l0aCB2YWx1ZSBhbmQgdW5pdCBwcm9wc1xuKi9cbmV4cG9ydCBjb25zdCBmaW5kVmFsdWVBbmRVbml0ID0gKHZhbHVlKSA9PiB7XG4gIGlmICh2YWx1ZS5tYXRjaCkge1xuICAgIGNvbnN0IHNwbGl0VmFsdWUgPSB2YWx1ZS5tYXRjaCgvKC0/XFxkKlxcLj9cXGQqKSguKikvKTtcblxuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogcGFyc2VGbG9hdChzcGxpdFZhbHVlWzFdKSxcbiAgICAgIHVuaXQ6ICBzcGxpdFZhbHVlWzJdXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4geyB2YWx1ZSB9O1xuICB9XG59O1xuXG4vKlxuICBTcGxpdCBjb2xvciBzdHJpbmcgaW50byBtYXAgb2YgY29sb3IgcHJvcGVydGllc1xuXG4gIFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwKVwiLCBbXCJSZWRcIiwgJ0dyZWVuXCIsIFwiQmx1ZVwiLCBcIkFscGhhXCJdXG5cbiAgeyBSZWQ6IDI1NS4uLiB9XG4qL1xuZXhwb3J0IGNvbnN0IGdldENvbG9yVmFsdWVzID0gKHZhbHVlLCBjb2xvclRlcm1zKSA9PiB7XG4gIGNvbnN0IG51bUNvbG9yVGVybXMgPSBjb2xvclRlcm1zLmxlbmd0aDtcbiAgY29uc3QgY29sb3JWYWx1ZXMgPSB7fTtcbiAgY29uc3QgY29sb3JzID0gc3BsaXRDb21tYURlbGltaXRlZChnZXRWYWx1ZUZyb21GdW5jdGlvblN0cmluZyh2YWx1ZSkpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtQ29sb3JUZXJtczsgaSsrKSB7XG4gICAgY29sb3JWYWx1ZXNbY29sb3JUZXJtc1tpXV0gPSAoY29sb3JzW2ldICE9PSB1bmRlZmluZWQpID8gY29sb3JzW2ldIDogMTtcbiAgfVxuXG4gIHJldHVybiBjb2xvclZhbHVlcztcbn07XG5cbi8qXG4gIEdldCB2YWx1ZSBmcm9tIGZ1bmN0aW9uIHN0cmluZ1xuXG4gIFwidHJhbnNsYXRlWCgyMHB4KVwiIC0+IFwiMjBweFwiXG4qL1xuZXhwb3J0IGNvbnN0IGdldFZhbHVlRnJvbUZ1bmN0aW9uU3RyaW5nID0gKHZhbHVlKSA9PiB2YWx1ZS5zdWJzdHJpbmcodmFsdWUuaW5kZXhPZignKCcpICsgMSwgdmFsdWUubGFzdEluZGV4T2YoJyknKSk7XG5cbi8qXG4gIENoZWNrIGlmIHR3byBvYmplY3RzIGhhdmUgY2hhbmdlZCBmcm9tIGVhY2ggb3RoZXJcbiAgXG4gIEBwYXJhbSBbb2JqZWN0XTogSW5wdXQgQVxuICBAcGFyYW0gW29iamVjdF06IElucHV0IEJcbiAgQHJldHVybiBbYm9vbGVhbl06IFRydWUgaWYgZGlmZmVyZW50XG4qL1xuZXhwb3J0IGNvbnN0IGhhc0NoYW5nZWQgPSAoYSwgYikgPT4ge1xuICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xuXG4gIGZvciAobGV0IGtleSBpbiBhKSB7XG4gICAgaWYgKGEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgaWYgKGhhc1Byb3BlcnR5KGIsIGtleSkpIHtcbiAgICAgICAgaWYgKGFba2V5XSAhPT0gYltrZXldKSB7XG4gICAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjaGFuZ2VkO1xufTtcblxuLypcbiAgQ2hlY2sgaWYgb2JqZWN0IGhhcyBwcm9wZXJ0eSBhbmQgaXQgaXNuJ3QgdW5kZWZpbmVkXG5cbiAgQHBhcmFtIFtvYmplY3RdXG4gIEBwYXJhbSBbc3RyaW5nXVxuICBAcmV0dXJuIFtib29sZWFuXVxuKi9cbmV4cG9ydCBjb25zdCBoYXNQcm9wZXJ0eSA9IChvYmplY3QsIHByb3BlcnR5TmFtZSkgPT4gb2JqZWN0Lmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkgJiYgb2JqZWN0W3Byb3BlcnR5TmFtZV0gIT09IHVuZGVmaW5lZDtcblxuLypcbiAgSXMgdXRpbHMgdmFyIGFuIGFycmF5ID8gXG4gIFxuICBAcGFyYW06IFZhcmlhYmxlIHRvIHRlc3RcbiAgQHJldHVybiBbYm9vbGVhbl06IFJldHVybnMgdHJ1ZSBpZiB1dGlscy52YXJUeXBlID09PSAnQXJyYXknXG4qL1xuZXhwb3J0IGNvbnN0IGlzQXJyYXkgPSAoYXJyKSA9PiB2YXJUeXBlKGFycikgPT09ICdBcnJheSc7XG5cbi8qXG4gIElzIHV0aWxzIHZhciBhIGZ1bmN0aW9uID8gXG4gIFxuICBAcGFyYW06IFZhcmlhYmxlIHRvIHRlc3RcbiAgQHJldHVybiBbYm9vbGVhbl06IFJldHVybnMgdHJ1ZSBpZiB1dGlscy52YXJUeXBlID09PSAnRnVuY3Rpb24nXG4qL1xuZXhwb3J0IGNvbnN0IGlzRnVuYyA9IChvYmopID0+IHZhclR5cGUob2JqKSA9PT0gJ0Z1bmN0aW9uJztcblxuLypcbiAgSXMgdXRpbHMgdmFyIGEgbnVtYmVyP1xuICBcbiAgQHBhcmFtOiBWYXJpYWJsZSB0byB0ZXN0XG4gIEByZXR1cm4gW2Jvb2xlYW5dOiBSZXR1cm5zIHRydWUgaWYgdHlwZW9mID09PSAnbnVtYmVyJ1xuKi9cbmV4cG9ydCBjb25zdCBpc051bSA9IChudW0pID0+IHR5cGVvZiBudW0gPT09ICdudW1iZXInO1xuXG4vKlxuICBJcyB1dGlscyB2YXIgYW4gb2JqZWN0P1xuICBcbiAgQHBhcmFtOiBWYXJpYWJsZSB0byB0ZXN0XG4gIEByZXR1cm4gW2Jvb2xlYW5dOiBSZXR1cm5zIHRydWUgaWYgdHlwZW9mID09PSAnb2JqZWN0J1xuKi9cbmV4cG9ydCBjb25zdCBpc09iaiA9IChvYmopID0+IHR5cGVvZiBvYmogPT09ICdvYmplY3QnO1xuXG4vKlxuICBJcyB1dGlscyBhIHJlbGF0aXZlIHZhbHVlIGFzc2lnbm1lbnQ/XG4gIFxuICBAcGFyYW0gW3N0cmluZ106IFZhcmlhYmxlIHRvIHRlc3RcbiAgQHJldHVybiBbYm9vbGVhbl06IElmIHV0aWxzIGxvb2tzIGxpa2UgYSByZWxhdGl2ZSB2YWx1ZSBhc3NpZ25tZW50XG4qL1xuZXhwb3J0IGNvbnN0IGlzUmVsYXRpdmVWYWx1ZSA9ICh2YWx1ZSkgPT4gKHZhbHVlICYmIHZhbHVlLmluZGV4T2YgJiYgdmFsdWUuaW5kZXhPZignPScpID4gMCkgPyB0cnVlIDogZmFsc2U7XG5cbi8qXG4gIElzIHV0aWxzIHZhciBhIHN0cmluZyA/IFxuICBcbiAgQHBhcmFtOiBWYXJpYWJsZSB0byB0ZXN0XG4gIEByZXR1cm4gW2Jvb2xlYW5dOiBSZXR1cm5zIHRydWUgaWYgdHlwZW9mIHN0ciA9PT0gJ3N0cmluZydcbiovXG5leHBvcnQgY29uc3QgaXNTdHJpbmcgPSAoc3RyKSA9PiB0eXBlb2Ygc3RyID09PSAnc3RyaW5nJztcblxuLypcbiAgQHBhcmFtIFtzdHJpbmcgfHwgTm9kZUxpc3RdOlxuICAgIElmIHN0cmluZywgdHJlYXRlZCBhcyBzZWxlY3Rvci5cbiAgICBJZiBub3QsIHRyZWF0ZWQgYXMgcHJlZXhpc3RpbmcgTm9kZUxpc3RcblxuICBAcmV0dXJuIFtBcnJheV1cbiovXG5leHBvcnQgY29uc3Qgc2VsZWN0RG9tID0gKHNlbGVjdG9yKSA9PiB7XG4gIGNvbnN0IG5vZGVzID0gKHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycpID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikgOiBzZWxlY3RvcjtcbiAgcmV0dXJuIChub2Rlcy5sZW5ndGgpID8gW10uc2xpY2UuY2FsbChub2RlcykgOiBbXS5wdXNoKG5vZGVzKTtcbn07XG5cbi8qXG4gIFNwbGl0IGNvbW1hLWRlbGltaXRlZCBzdHJpbmdcblxuICBcImZvbyxiYXJcIiAtPiBbXCJmb29cIiwgXCJiYXJcIl1cblxuICBAcGFyYW0gW3N0cmluZ11cbiAgQHJldHVybiBbYXJyYXldXG4qL1xuZXhwb3J0IGNvbnN0IHNwbGl0Q29tbWFEZWxpbWl0ZWQgPSAodmFsdWUpID0+IGlzU3RyaW5nKHZhbHVlKSA/IHZhbHVlLnNwbGl0KC8sXFxzKi8pIDogW3ZhbHVlXTtcblxuLypcbiAgU3BsaXQgc3BhY2UtZGVsaW1pdGVkIHN0cmluZ1xuXG4gIFwiZm9vIGJhclwiIC0+IFtcImZvb1wiLCBcImJhclwiXVxuXG4gIEBwYXJhbSBbc3RyaW5nXVxuICBAcmV0dXJuIFthcnJheV1cbiovXG5leHBvcnQgY29uc3Qgc3BsaXRTcGFjZURlbGltaXRlZCA9ICh2YWx1ZSkgPT4gaXNTdHJpbmcodmFsdWUpID8gdmFsdWUuc3BsaXQoJyAnKSA6IFt2YWx1ZV07XG5cbi8qXG4gIENvbnZlcnQgbnVtYmVyIHRvIHggZGVjaW1hbCBwbGFjZXNcblxuICBAcGFyYW0gW251bWJlcl1cbiAgQHBhcmFtIFtudW1iZXJdXG4gIEByZXR1cm4gW251bWJlcl1cbiovXG5leHBvcnQgY29uc3QgdG9EZWNpbWFsID0gKG51bSwgcHJlY2lzaW9uID0gMikgPT4ge1xuICBwcmVjaXNpb24gPSAxMCAqKiBwcmVjaXNpb247XG4gIHJldHVybiBNYXRoLnJvdW5kKG51bSAqIHByZWNpc2lvbikgLyBwcmVjaXNpb247XG59O1xuIl19