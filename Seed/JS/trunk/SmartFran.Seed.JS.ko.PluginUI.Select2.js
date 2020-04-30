(namespace("SmartFran.Seed.JS.ko.PluginUI").koSelect2 = function () {

  //Select2 Component
  ko.bindingHandlers.koSelect2 = {
    init: (element, valueAccessor, allBindingsAccessor, viewModel) => {
      $(element).select2({});
    },
    update: (element, valueAccessor, allBindingsAccessor, viewModel) => {
      var allBindings = allBindingsAccessor();
      //lookupKey = allBindings.lookupKey;
      $(element).select2("destroy");

      //// change selection when options change
      $(element).select2({
        "data": ko.utils.unwrapObservable(valueAccessor()),
      });

      $(element).select2(ko.utils.unwrapObservable(allBindings.settings));

      allBindings.koSelect2.subscribe(function (value) {
        if (value.length == 0) {
          $(element).empty();
          if (allBindings.settings.defaultOption) {
            allBindings.koSelect2.push({ id: "0", text: allBindings.settings.defaultOption });
          }
          allBindings.customSelectedOptions(undefined);
        }
      });

      if (allBindings.customSelectedOptions) {
        allBindings.customSelectedOptions.subscribe(function (value) {
          var re = new RegExp("^[i]{1}[0-9]*$");
          if (value != undefined) {
            if (value.__proto__.constructor.name == "String") {
              if (re.test(value)) {
                if (allBindings.settings.allowClear && allBindings.settings.autoComplete) {
                  $(element).val(null).trigger("change.select2");
                } else {
                  var selectedOp = $(element)[0].options[parseInt(value.substring(1))];
                  if (selectedOp) {
                    $(element).val(selectedOp.value).trigger("change.select2");
                  }
                }
              } else {
                $(element).val(value).trigger("change.select2");
              }
            }
          }
        });
      }

      ko.utils.registerEventHandler(element, "change.select2", function (data) {

        var settings = ko.utils.unwrapObservable(allBindings.settings);
        var optionsList = ko.utils.unwrapObservable(valueAccessor());
        var selectedOptions = data.currentTarget.selectedOptions;
        if (allBindings.customSelectedOptions) {
          if (settings.multiple) {
            //TODO: Se debe revisar La logica cuando la seleccion sea multiple
            //var result = [];
            //Array.from(options).forEach(function (op) { result.push({ value: op.value, text: op.text }); });
            //allBindings.customSelectedOptions(result);
          } else {
            if (selectedOptions.length > 0) {
              allBindings.customSelectedOptions({ value: selectedOptions[0].value, text: selectedOptions[0].text });
            } else {
              if (optionsList.length == 0 || allBindings.settings.allowClear && allBindings.settings.autoComplete) {
                $(element).empty();
                allBindings.customSelectedOptions(null);
              } else {
                allBindings.customSelectedOptions("i0");
              }
            }
          }
        }
        if (settings.onChange != undefined) {
          settings.onChange({
            elementId: element.id,
            selectedOptions: selectedOptions,
            optionsList: optionsList,
          });
        }

        if (settings.actionChild != undefined) {
          var childrenComponents = [];
          settings.childrenComponents.forEach(function (item) {
            childrenComponents.push($("#" + item));
          });
          settings.actionChild({
            elementId: element.id,
            childrenComponents: childrenComponents,
            selectedOptions: selectedOptions,
            optionsList: optionsList,
          });
        }
      });
    },
  };
})();