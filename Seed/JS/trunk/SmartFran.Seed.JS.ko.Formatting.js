﻿/// <reference path="~/Scripts/_Knockout/knockout.js" />
/// <reference path="~/Scripts/_jQuery/jquery-vsdoc.js" />
/// <reference path="~/Scripts/_KoGrid/KoGrid.js" />

(namespace('SmartFran.Seed.JS.ko').Formatting = function () {
  var formatMoney = function (value) {
    var toks = value.toFixed(2).replace('-', '').split('.');
    var display = '$' + $.map(toks[0].split('').reverse(), function (elm, i) {
      return [(i % 3 === 0 && i > 0 ? ',' : ''), elm];
    }).reverse().join('') + '.' + toks[1];

    return value < 0 ? '-' + display : display;
  };

  ko.subscribable.fn.money = function () {
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


  var formatDecimal = function (value, decs) {
    var toks = value.toFixed(decs).replace('-', '').split('.');
    var display = $.map(toks[0].split('').reverse(), function (elm, i) {
      return [(i % 3 === 0 && i > 0 ? ',' : ''), elm];
    }).reverse().join('') + '.' + toks[1];

    return value < 0 ? '-' + display : display;
  };

  ko.subscribable.fn.decimal = function (decs) {
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
        return formatDecimal(target(), decs);
      },
      write: writeTarget
    });

    result.isNegative = ko.computed(function () {
      return target() < 0;
    });

    return result;
  };
})();