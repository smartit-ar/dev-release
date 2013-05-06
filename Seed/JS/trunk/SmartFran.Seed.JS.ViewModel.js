/// <reference path="~/Scripts/_Knockout/knockout.js" />
/// <reference path="~/Scripts/_jQuery/jquery-vsdoc.js" />
/// <reference path="~/Scripts/_KoGrid/KoGrid.js" />

namespace('SmartFran.Seed.JS').ViewModel = {
  _errorMessageCall: null,
  _loadingCall: null,
  _countLoading: 0,

  // params.loadingCall
  // params.errorMessageCall
  initialize: function (params) {
    this._errorMessageCall = params.errorMessageCall;
    this._loadingCall = params.loadingCall;
    this._loadingModal = params.loadingModal;
    this._countLoading = 0;
  },
  loadingCall: function (startLoading, loadingModal) {
    if (this._loadingCall) {
      if (startLoading) {
        if (this._loadingModal) {
          this._loadingModal(loadingModal || (this._loadingModal._latestValue && this._loadingCall()));
        }
        ++this._countLoading;
        this._loadingCall(true);
      }
      else {
        this._countLoading = Math.max(0, (this._countLoading - 1));
        if (this._countLoading == 0) {
          this._loadingCall(false);
        }
      }
    }
  },
  catchException: function (exception, errorCallback) {
    if (this._errorMessageCall) {
      this._errorMessageCall(exception.Message + ' (' + exception.ExceptionType + ')');
    }
    if (errorCallback) {
      errorCallback(exception);
    }
  },
  asyncCallToModel: function (params) {
    var self = this;
    this.loadingCall(true, params.loadingModal);
    params.type = params.type || 'post';
    var data = params.data;
    if (params.type.toLowerCase() == 'post') {
      data = JSON.stringify(data);
    }
    $.ajax(params.url, {
      data: data,
      type: params.type,
      contentType: "application/json",
      success: function (result) {
        try {
          params.success(result);
        } catch (ex) {

        }
        self.loadingCall(false);
      },
      error: function (result) {
        try {
          var exception = $.parseJSON(result.responseText);
          self.catchException(exception, params.error);
        } catch (ex) {
        }
        self.loadingCall(false);
      }
    });
  },
  submitGet: function (params) {
    var url = params.url;
    var data = params.data;
    var separator = '?';
    if ($.isArray(data)) {
      data.forEach(function(elem) {
        url = url + separator + elem.name.toString() + '=' + escape(elem.value.toString());
        separator = '&';
      });
    }
    window.location.href = url;
    return;
  },
  submitPost: function (params) {
    var form = document.createElement("form");
    var url = params.url;
    var data = params.data;
    if ($.isArray(data)) {
      data.forEach(function (elem) {
        var opt = document.createElement("textarea");
        opt.name = elem.name.toString();
        opt.value = elem.value.toString();
        form.appendChild(opt);
      });
    }
    form.action = url;
    form.method = "POST";
    form.style.display = "none";
    document.body.appendChild(form);
    form.submit();
    return;
  },
  redirect: function (url) {
    window.location.href = url;
    return;
  }
}