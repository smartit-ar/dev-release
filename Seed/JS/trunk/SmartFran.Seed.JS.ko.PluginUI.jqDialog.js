﻿(namespace('SmartFran.Seed.JS.ko.PluginUI').jqDialog = function () {
  ko.bindingHandlers.jqDialog = {
    init: function (element, valueAccessor, allBindingsAccessor) {
      var options = ko.utils.unwrapObservable(valueAccessor()) || {};
      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        $(element).dialog("destroy");
      });

      options.close = function () {
        allBindingsAccessor().jqOpenDialog(false);
      };

      setTimeout(function () {
        $(element).dialog(options);
      }, 0);
    }
  };

  ko.bindingHandlers.jqOpenDialog = {
    update: function (element, valueAccessor) {
      var value = ko.utils.unwrapObservable(valueAccessor());
      var instance = $.data(element, "ui-dialog");
      if (instance) {
        if (value) {
          $(element).dialog("open");
        } else {
          $(element).dialog("close");
        }
      }
    }
  };

})();