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
    this._countLoading = 0;
  },
  loadingCall: function (startLoading) {
    if (this._loadingCall) {
      if (startLoading) {
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
    this.loadingCall(true);
    $.ajax(params.url, {
      data: JSON.stringify(params.data),
      type: "post",
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
  }
}