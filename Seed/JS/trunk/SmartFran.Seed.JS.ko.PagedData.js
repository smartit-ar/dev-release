/// <reference path="~/Scripts/_Knockout/knockout.js" />
/// <reference path="~/Scripts/_jQuery/jquery-vsdoc.js" />
/// <reference path="~/Scripts/_KoGrid/KoGrid.js" />

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
  self._getFilterInfo = params.getFilterInfo;
  self._url = params.url;
  self._newItem = params.newItem;
  
  function onGetPage() {
    var pageIndex = self.pageIndex();
    var pageSize = self.pageSize();
    if (!pageIndex || !pageSize) {
      return;
    }
    var sortInfo = null;
    var filterInfo = null;
    if (self._getSortInfo) {
      sortInfo = self._getSortInfo(self.sort());
    }
    if (self._getFilterInfo) {
      filterInfo = self._getFilterInfo(self.filter());
    }
    Seed.ko.ViewModel.asyncCallToModel({
      loadingModal: true,
      url: self._url,
      data: { PageIndex: pageIndex, PageSize: pageSize, SortInfo: sortInfo, FilterInfo: filterInfo },
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
    self.pageIndex.subscribe(onGetPage);
    self.pageSize.subscribe(onGetPage);
    self.sort.subscribe(onGetPage);
    self.filter.subscribe(onGetPage);
    onGetPage();
  };
  //End: Public method
};