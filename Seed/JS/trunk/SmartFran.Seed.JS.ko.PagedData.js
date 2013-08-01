/// <reference path="~/Scripts/_Knockout/knockout.js" />
/// <reference path="~/Scripts/_KoGrid/KoGrid.js" />

namespace('SmartFran.Seed.JS.ko').PagedData = function (params) {
  var self = this;
  
  params = params || {};

  self.list = ko.observableArray([]);
  self.pageIndex = ko.observable(1);
  self.pageSize = ko.observable(params.pageSize || 50);
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
    ko.computed(function() {
      var pageIndex = self.pageIndex();
      var pageSize = self.pageSize();
      var sort = self.sort();
      var filter = self.filter.peek();
      getPage(pageIndex, pageSize, sort, filter);
    });
    self.filter.subscribe(function(value) {
      if (self.pageIndex() > 1) {
        self.pageIndex(1);
      } else {
        getPage(1, self.pageSize(), self.sort(), value);
      }
    });
  };
  self.reset = function() {
    if (self.pageIndex() != 1)
    {
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