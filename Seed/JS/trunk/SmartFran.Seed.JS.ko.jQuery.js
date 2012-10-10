//
// Custom handler para integrar dialogo modal y buttons jQuery.UI
// bindeando con Knockout. 
// Requiere: jQuery, jQuery UI, jQuery-templ, Knockout
//
// Html sample
// <div id="editDialog" title="Edit" data-bind="jqDialog: { autoOpen: false, resizable: false, modal: true }, template: { name: 'editDialogTmpl', data: selectedItem }, openDialog: selectedItem">
// </div>
// <script id="editDialogTmpl" type="text/html">
//   <label>
//     Name:</label>
//   <input data-bind="value: editName" /><br />
//   <label>
//     Code:</label>
//   <input data-bind="value: editCode" /><br />
//   <button data-bind="buttonEdit: {}, click: $root.accept">Accept</button>
//   <button data-bind="buttonEdit: {}, click: $root.cancel">Cancel</button>
// </script>
//

(namespace('SmartFran.Seed.JS.ko').jQuery = function() {
  //custom binding to initialize a jQuery UI dialog
  ko.bindingHandlers.jqDialog = {
    init: function(element, valueAccessor) {
      var options = ko.utils.unwrapObservable(valueAccessor()) || { };

      //handle disposal
      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
        $(element).dialog("destroy");
      });

      $(element).dialog(options);
    }
  };

  //custom binding handler that opens/closes the dialog
  ko.bindingHandlers.openDialog = {
    update: function(element, valueAccessor) {
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
    init: function(element, valueAccessor) {
      var options = ko.utils.unwrapObservable(valueAccessor()) || { };

      //handle disposal
      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
        $(element).button("destroy");
      });

      $(element).button(options);
    }
  };
})();