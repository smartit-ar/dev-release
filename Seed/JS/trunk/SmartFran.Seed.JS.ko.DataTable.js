ko.bindingHandlers.koDataTable = {
  page: 0,
  init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    var binding = ko.utils.unwrapObservable(valueAccessor());

    ko.unwrap(binding.data);

    if (binding.options.paging) {
      binding.data.subscribe(function (changes) {
        var table = $(element).closest("table").DataTable();
        ko.bindingHandlers.koDataTable.page = table.page();
        table.destroy();
      }, null, "arrayChange");
    }

    var nodes = Array.prototype.slice.call(element.childNodes, 0);
    ko.utils.arrayForEach(nodes, function (node) {
      if (node && node.nodeType !== 1) {
        node.parentNode.removeChild(node);
      } 
    });

    return ko.bindingHandlers.foreach.init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
  },
  update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    var binding = ko.utils.unwrapObservable(valueAccessor()),
      key = "koDataTable_Initialized";

    ko.unwrap(binding.data);

    var table;
    if (!binding.options.paging) {
      table = $(element).closest("table").DataTable();
      table.destroy();
    }

    ko.bindingHandlers.foreach.update(element, valueAccessor, allBindings, viewModel, bindingContext);

    table = $(element).closest("table").DataTable(binding.options);

    if (binding.options.paging) {
      if (table.page.info().pages - ko.bindingHandlers.koDataTable.page === 0) {
        table.page(--ko.bindingHandlers.koDataTable.page).draw(false);
      } else {
        table.page(ko.bindingHandlers.koDataTable.page).draw(false);
      }
    }

    if (!ko.utils.domData.get(element, key) && (binding.data || binding.length)) {
      ko.utils.domData.set(element, key, true);
    }

    return {
      controlsDescendantBindings: true,
    };
  },
};
