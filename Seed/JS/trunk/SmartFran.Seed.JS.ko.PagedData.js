// **
// **
// Tomado del koGrid.js
// Se debe actualizar cuando se baje una nueva versión.
// Pone es español etiquetas que estan en ingles en la grilla.
if (window.kg) {
  window.kg.defaultGridTemplate = function () { return '<div data-bind="css: {\'ui-widget\': jqueryUITheme, \'kgNoSelect\' : disableTextSelection}"><div class="kgTopPanel" data-bind="css: {\'ui-widget-header\':jqueryUITheme, \'ui-corner-top\': jqueryUITheme}, style: $data.topPanelStyle"><div class="kgGroupPanel" data-bind="visible: $data.showGroupPanel, style: headerStyle"><div class="kgGroupPanelDescription" data-bind="visible: configGroups().length == 0">Arrastre el encabezado de una columna hacia este espacio, y suelte para agrupar.</div><ul data-bind="visible: configGroups().length > 0, foreach: configGroups" class="kgGroupList"><li class="kgGroupItem"><span class="kgGroupElement"><div class="kgGroupName"><span data-bind="text: displayName"></span><span data-bind="click: function(data) { $root.removeGroup($index()) }" class="kgRemoveGroup">x</span></div><span data-bind="visible: $index() < ($root.configGroups().length - 1)" class="kgGroupArrow"></span></span></li></ul></div><div class="kgHeaderContainer" data-bind="style: headerStyle"><div class="kgHeaderScroller" data-bind="style: headerScrollerStyle, kgHeaderRow: $data" ></div></div><div class="kgHeaderButton" data-bind="visible: ($data.showColumnMenu || $data.showFilter), click: toggleShowMenu"><div class="kgHeaderButtonArrow"></div></div><div data-bind="visible: showMenu" class="kgColMenu"><div data-bind="visible: showFilter"><input placeholder="Seach Field:Value" type="text" data-bind="value: filterText, valueUpdate: \'afterkeydown\'"/></div><div data-bind="visible: showColumnMenu"><span class="kgMenuText">Choose Columns:</span><ul class="kgColList" data-bind="foreach: nonAggColumns"><li class="kgColListItem"><label style="position: relative;"><input type="checkbox" class="kgColListCheckbox" data-bind="checked: visible"/><span data-bind="text: displayName, click: toggleVisible"></span><a title="Agrupa por" data-bind="attr: {\'class\': groupedByClass }, visible: (field != \'\u2714\'), click: $parent.groupBy"></a><span class="kgGroupingNumber" data-bind="visible: groupIndex() > 0, text: groupIndex"></span></label></li></ul></div></div></div><div class="kgViewport" data-bind="css: {\'ui-widget-content\': jqueryUITheme}, style: viewportStyle"><div class="kgCanvas" data-bind="style: canvasStyle"><div data-bind="foreach: renderedRows" style="position: absolute;"><div data-bind="style: { \'top\': offsetTop, \'height\': $parent.rowHeight + \'px\' }, click: toggleSelected, css: {\'selected\': selected, \'even\': isEven , \'odd\': isOdd, \'ui-state-default\': $parent.jqueryUITheme && isOdd, \'ui-state-active\':$parent.jqueryUITheme && isEven}, kgRow: $data" class="kgRow"></div></div></div></div><div class="kgFooterPanel" data-bind="css: {\'ui-widget-content\': jqueryUITheme, \'ui-corner-bottom\': jqueryUITheme}, style: footerStyle"><div class="kgTotalSelectContainer" data-bind="visible: footerVisible"><div class="kgFooterTotalItems" data-bind="css: {\'kgNoMultiSelect\': !multiSelect}" ><span class="kgLabel">Total Reg: <span data-bind="text: maxRowsDisplay"></span></span><span data-bind="visible: filterText().length > 0" class="kgLabel">(Mostrando: <span data-bind="text: totalFilteredItemsLength"></span>)</span></div><div class="kgFooterSelectedItems" data-bind="visible: multiSelect"><span class="kgLabel">Reg Sel: <span data-bind="text: selectedItemCount"></span></span></div></div><div class="kgPagerContainer" style="float: right; margin-top: 10px;" data-bind="visible: (footerVisible && enablePaging), css: {\'kgNoMultiSelect\': !multiSelect}"><div style="float:left; margin-right: 10px;" class="kgRowCountPicker"><span style="float: left; margin-top: 3px;" class="kgLabel">Reg x Pág:</span><select style="float: left;height: 27px; width: 100px" data-bind="value: pagingOptions.pageSize, options: pagingOptions.pageSizes"></select></div><div style="float:left; margin-right: 10px; line-height:25px;" class="kgPagerControl" style="float: left; min-width: 135px;"><button class="kgPagerButton" data-bind="click: pageToFirst, disable: cantPageBackward()" title="Primer Pág"><div class="kgPagerFirstTriangle"><div class="kgPagerFirstBar"></div></div></button><button class="kgPagerButton" data-bind="click: pageBackward, disable: cantPageBackward()" title="Pág Anterior"><div class="kgPagerFirstTriangle kgPagerPrevTriangle"></div></button><input class="kgPagerCurrent" type="number" style="width:50px; height: 24px; margin-top: 1px; padding: 0px 4px;" data-bind="value: pagingOptions.currentPage, valueUpdate: \'afterkeydown\'"/><button class="kgPagerButton" data-bind="click: pageForward, disable: cantPageForward()" title="Próxima Pág"><div class="kgPagerLastTriangle kgPagerNextTriangle"></div></button><button class="kgPagerButton" data-bind="click: pageToLast, disable: cantPageForward()" title="Utltima Pág"><div class="kgPagerLastTriangle"><div class="kgPagerLastBar"></div></div></button></div></div></div></div>'; };
}
// **
// **

namespace('SmartFran.Seed.JS.ko').PagedData = function (params) {
  var self = this;

  params = params || {};

  self.list = ko.observableArray([]);
  self.pageIndex = ko.observable(1);
  self.pageSize = ko.observable(params.pageSize || 10);
  self.sort = ko.observable();
  self.filter = ko.observable();
  self.totalItems = ko.observable(0);
  self.activeFilter = ko.observable();
  self.selected = ko.observableArray([]);

  self._getSortInfo = params.getSortInfo;
  self._getParamInfo = params.getParamInfo;
  self._getFilterInfo = params.getFilterInfo;
  self._url = params.url;
  self._newItem = params.newItem;

  function getPage(pageIndex, pageSize, sort, filter) {
    if (!pageIndex || !pageSize) {
      return;
    }

    var sortInfo = null;
    if (self._getSortInfo) {
      sortInfo = self._getSortInfo(sort);
    }

    var filterInfo = null;
    if (self._getFilterInfo) {
      filterInfo = self._getFilterInfo(filter);
    }

    var paramInfo = null;
    if (self._getParamInfo) {
      paramInfo = self._getParamInfo();
    }

    var data = { PageIndex: pageIndex, PageSize: pageSize, SortInfo: sortInfo, FilterInfo: filterInfo };
    if (typeof paramInfo == "object") {
      $.extend(data, paramInfo);
    }

    Seed.ko.ViewModel.asyncCallToModel({
      loadingModal: true,
      url: self._url,
      data: data,
      success: function (result) {
        self.totalItems(result.TotalItems);

        if (typeof self._newItem == "function") {
          var mapped = $.map(result.Items, self._newItem);
          self.list(mapped);
        } else {
          self.list(result.Items);
        }

        self.activeFilter(filterInfo);
      }
    });
  };

  //Start: Public method
  self.activate = function () {
    ko.computed(function () {
      var pageIndex = self.pageIndex();
      var pageSize = self.pageSize();
      var sort = self.sort();
      var filter = self.filter.peek();
      getPage(pageIndex, pageSize, sort, filter);
    });
    self.filter.subscribe(function (value) {
      if (self.pageIndex() > 1) {
        self.pageIndex(1);
      } else {
        getPage(1, self.pageSize(), self.sort(), value);
      }
    });
  };
  self.reset = function () {
    if (self.pageIndex() != 1) {
      self.pageIndex(1);
      return;
    }
    var pageIndex = self.pageIndex();
    var pageSize = self.pageSize();
    var sort = self.sort();
    var filter = self.filter();
    getPage(pageIndex, pageSize, sort, filter);
  };
  //End: Public method
};