var Seed = namespace('SmartFran.Seed.JS');

(namespace('SmartFran.Seed.JS.ko').PluginUI = function () {
  ko.bindingHandlers.jqInputMasked = {
    init: function (element, valueAccessor, allBindingsAccessor) {
      var observable = valueAccessor();
      if (allBindingsAccessor().mask) {
        $(element).inputmask(mask);
      } else {
        if (typeof observable.assignMask == "function") {
          ko.utils.registerEventHandler(element, 'focus', function () {
            observable.assignMask($(element));
          });
        }
      }
      ko.utils.registerEventHandler(element, 'focusout', function () {
        observable($(element).val());
      });
    },
    update: function (element, valueAccessor) {
      var value = ko.utils.unwrapObservable(valueAccessor());
      $(element).val(value);
    }
  };

  ko.bindingHandlers.jqSpinner = {
    init: function (element, valueAccessor, allBindingsAccessor) {
      var options = allBindingsAccessor().spinnerOptions || {};
      $(element).spinner(options);
      ko.utils.registerEventHandler(element, "spinchange", function () {
        var observable = valueAccessor();
        observable($(element).spinner("value"));
      });
      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        $(element).spinner("destroy");
      });
    },
    update: function (element, valueAccessor) {
      var value = ko.utils.unwrapObservable(valueAccessor());

      var current = $(element).spinner("value");
      if (value !== current) {
        $(element).spinner("value", value);
      }
    }
  };

  ko.bindingHandlers.jqButton = {
    init: function (element, valueAccessor) {
      var options = ko.utils.unwrapObservable(valueAccessor()) || {};
      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        $(element).button("destroy");
      });
      $(element).button(options);
    }
  };

  ko.bindingHandlers.jqDatePicker = {
    init: function(element, valueAccessor, allBindingsAccessor) {

      function getDateRange() {
        var d = new Date();
        var dateRange = (d.getFullYear() - 100) + ':' + (d.getFullYear() + 10);
        return dateRange;
      }

      var options = allBindingsAccessor().datepickerOptions;
      options.monthNames = options.monthNames || ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      options.monthNamesShort = options.monthNamesShort || ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      options.dateFormat = options.dateFormat || 'dd/mm/yy';
      options.yearRange = options.yearRange || getDateRange();
      options.nextFocus = options.nextFocus || element;

      $(element)
        .datepicker(options)
        .bind("change", function() {
          ko.bindingHandlers.jqDatePicker.updateValue(element, valueAccessor, allBindingsAccessor);
        });
      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
        $(element).datepicker("destroy");
      });
    },
    update: function(element, valueAccessor) {
      var value = ko.utils.unwrapObservable(valueAccessor());
      var currentDate = $(element).datepicker("getDate");
      if (value && value - currentDate !== 0) {
        $(element).datepicker("setDate", value);
      }
    },
    updateValue: function(element, valueAccessor, allBindingsAccessor) {
      var observable = valueAccessor();
      var dateValue = $(element).datepicker("getDate");

      $(allBindingsAccessor().datepickerOptions.nextFocus).focus();

      if (ko.isWriteableObservable(observable)) {
        observable(dateValue);
        return;
      }
      if (allBindingsAccessor()._ko_property_writers) {
        allBindingsAccessor()._ko_property_writers.datepicker(dateValue);
      }
    }
  };
})();