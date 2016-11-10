'use strict';

exports.__esModule = true;

var _utils = require('../inc/utils');

exports.default = {
  test: function (unparsed) {
    var _findValueAndUnit = (0, _utils.findValueAndUnit)(unparsed),
        value = _findValueAndUnit.value;

    return (0, _utils.isNum)(value) && !isNaN(value) ? true : false;
  },

  parse: function (unparsed, parent) {
    var _findValueAndUnit2 = (0, _utils.findValueAndUnit)(unparsed),
        value = _findValueAndUnit2.value,
        unit = _findValueAndUnit2.unit;

    if (unit && unit !== parent.unit) {
      parent.unit = unit;
    }

    return value;
  },

  serialize: function (parsed, parent) {
    return parsed + (parent.unit || '');
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZS10eXBlcy91bml0LmpzIl0sIm5hbWVzIjpbInRlc3QiLCJ1bnBhcnNlZCIsInZhbHVlIiwiaXNOYU4iLCJwYXJzZSIsInBhcmVudCIsInVuaXQiLCJzZXJpYWxpemUiLCJwYXJzZWQiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7a0JBRWU7QUFDYkEsUUFBTSxVQUFVQyxRQUFWLEVBQW9CO0FBQUEsNEJBQ04sNkJBQWlCQSxRQUFqQixDQURNO0FBQUEsUUFDaEJDLEtBRGdCLHFCQUNoQkEsS0FEZ0I7O0FBRXhCLFdBQVEsa0JBQU1BLEtBQU4sS0FBZ0IsQ0FBQ0MsTUFBTUQsS0FBTixDQUFsQixHQUFrQyxJQUFsQyxHQUF5QyxLQUFoRDtBQUNELEdBSlk7O0FBTWJFLFNBQU8sVUFBVUgsUUFBVixFQUFvQkksTUFBcEIsRUFBNEI7QUFBQSw2QkFDVCw2QkFBaUJKLFFBQWpCLENBRFM7QUFBQSxRQUN6QkMsS0FEeUIsc0JBQ3pCQSxLQUR5QjtBQUFBLFFBQ2xCSSxJQURrQixzQkFDbEJBLElBRGtCOztBQUdqQyxRQUFJQSxRQUFRQSxTQUFTRCxPQUFPQyxJQUE1QixFQUFrQztBQUNoQ0QsYUFBT0MsSUFBUCxHQUFjQSxJQUFkO0FBQ0Q7O0FBRUQsV0FBT0osS0FBUDtBQUNELEdBZFk7O0FBZ0JiSyxhQUFXLFVBQUNDLE1BQUQsRUFBU0gsTUFBVDtBQUFBLFdBQW9CRyxVQUFVSCxPQUFPQyxJQUFQLElBQWUsRUFBekIsQ0FBcEI7QUFBQTtBQWhCRSxDIiwiZmlsZSI6InVuaXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc051bSwgZmluZFZhbHVlQW5kVW5pdCB9IGZyb20gJy4uL2luYy91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdGVzdDogZnVuY3Rpb24gKHVucGFyc2VkKSB7XG4gICAgY29uc3QgeyB2YWx1ZSB9ID0gZmluZFZhbHVlQW5kVW5pdCh1bnBhcnNlZCk7XG4gICAgcmV0dXJuIChpc051bSh2YWx1ZSkgJiYgIWlzTmFOKHZhbHVlKSkgPyB0cnVlIDogZmFsc2U7XG4gIH0sXG5cbiAgcGFyc2U6IGZ1bmN0aW9uICh1bnBhcnNlZCwgcGFyZW50KSB7XG4gICAgY29uc3QgeyB2YWx1ZSwgdW5pdCB9ID0gZmluZFZhbHVlQW5kVW5pdCh1bnBhcnNlZCk7XG5cbiAgICBpZiAodW5pdCAmJiB1bml0ICE9PSBwYXJlbnQudW5pdCkge1xuICAgICAgcGFyZW50LnVuaXQgPSB1bml0O1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfSxcblxuICBzZXJpYWxpemU6IChwYXJzZWQsIHBhcmVudCkgPT4gcGFyc2VkICsgKHBhcmVudC51bml0IHx8ICcnKVxufTtcbiJdfQ==