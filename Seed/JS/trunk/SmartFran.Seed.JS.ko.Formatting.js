(namespace('SmartFran.Seed.JS.ko').Formatting = function () {
  ko.subscribable.fn.formattedMoney = function () {
    function formatMoney(value) {
      var toks = value.toFixed(2).replace('-', '').split('.');
      var display = '$' + $.map(toks[0].split('').reverse(), function (elm, i) {
        return [(i % 3 === 0 && i > 0 ? ',' : ''), elm];
      }).reverse().join('') + '.' + toks[1];

      return value < 0 ? '-' + display : display;
    };

    var target = this;

    var writeTarget = function (value) {
      if (typeof value == 'number') {
        target(value);
      }
      else {
        var stripped = value
          .replace(/[^0-9.-]/g, '');

        target(parseFloat(stripped));
      }
    };

    var result = ko.computed({
      read: function () {
        return target();
      },
      write: writeTarget
    });

    result.formatted = ko.computed({
      read: function () {
        return formatMoney(target());
      },
      write: writeTarget
    });

    result.isNegative = ko.computed(function () {
      return target() < 0;
    });

    return result;
  };

  ko.subscribable.fn.formattedDecimal = function (decs) {
    function formatDecimal(value) {
      var toks = value.toFixed(decs).replace('-', '').split('.');
      var display = $.map(toks[0].split('').reverse(), function (elm, i) {
        return [(i % 3 === 0 && i > 0 ? ',' : ''), elm];
      }).reverse().join('') + '.' + toks[1];

      return value < 0 ? '-' + display : display;
    };

    var target = this;

    var writeTarget = function (value) {
      if (typeof value == 'number') {
        target(value);
      }
      else {
        var stripped = value
          .replace(/[^0-9.-]/g, '');

        target(parseFloat(stripped));
      }
    };

    var result = ko.computed({
      read: function () {
        return target();
      },
      write: writeTarget
    });

    result.formatted = ko.computed({
      read: function () {
        return formatDecimal(target());
      },
      write: writeTarget
    });

    result.isNegative = ko.computed(function () {
      return target() < 0;
    });

    return result;
  };
})();