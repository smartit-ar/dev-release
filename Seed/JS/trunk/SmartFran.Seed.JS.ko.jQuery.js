(namespace('SmartFran.Seed.JS.ko').jQuery = function () {
  //custom binding to initialize a jQuery UI dialog
  ko.bindingHandlers.jqDialog = {
    init: function (element, valueAccessor) {
      var options = ko.utils.unwrapObservable(valueAccessor()) || {};

      //handle disposal
      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        $(element).dialog("destroy");
      });

      $(element).dialog(options);
    }
  };

  //custom binding handler that opens/closes the dialog
  ko.bindingHandlers.openDialog = {
    update: function (element, valueAccessor) {
      var value = ko.utils.unwrapObservable(valueAccessor());
      if (value) {
        $(element).dialog("open");
      } else {
        $(element).dialog("close");
      }
    }
  };

  //custom binding to initialize a jQuery UI button
  ko.bindingHandlers.jqButton = {
    init: function (element, valueAccessor) {
      var options = ko.utils.unwrapObservable(valueAccessor()) || {};

      //handle disposal
      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        $(element).button("destroy");
      });

      $(element).button(options);
    }
  };

  //custom binding handler for datepicker
  ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
      //Calcula rango de años a mostrar cuando option 'changeYear:true'
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

      $(element)
        .datepicker(options)
        .bind("change", function () {
          ko.bindingHandlers.datepicker.updateValue(element, valueAccessor, allBindingsAccessor);
        });
      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        $(element).datepicker("destroy");
      });
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
      var value = ko.utils.unwrapObservable(valueAccessor());

      // If the date is coming from a Microsoft webservice.
      if (typeof value === "string" && value.indexOf('/Date(') === 0) {
        value = new Date(parseInt(value.replace(/\/Date\((.*?)\)\//gi, "$1")));
      }
      var currentDate = $(element).datepicker("getDate");

      // Check if the date has changed.
      if (value && value - currentDate !== 0) {
        $(element).datepicker("setDate", value);
      }
    },
    updateValue: function (element, valueAccessor, allBindingsAccessor) {
      var observable = valueAccessor(),
        dateValue = $(element).datepicker("getDate");

      // Two-way-binding means a writeable observable.
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