﻿namespace("SmartFran.Seed.JS.ko").ViewModel = {
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
          this._loadingModal(loadingModal || (this._loadingModal.peek() && this._loadingCall()));
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
    if (exception){
      if (typeof errorCallback == "function") {
        if (!errorCallback(exception) && (typeof exception.Message == "string") && (exception.Message.length > 0)) {
          this._errorMessageCall(exception.Message);
        }
      }
      else if (typeof this._errorMessageCall == "function" && (typeof exception.Message == "string") && (exception.Message.length > 0)) {
        this._errorMessageCall(exception.Message);
      }
    }
  },
  asyncCallToModel: function (params) {
    var self = this;
    if (typeof(this._errorMessageCall) == "function") this._errorMessageCall("");

    this.loadingCall(true, params.loadingModal);
    var type = params.type || 'post';
    var contentType = params.contentType == null || params.contentType == undefined ? 'application/json' : params.contentType;
    var processData = params.processData == null || params.processData == undefined || params.processData;
    var data = params.data;
    if ((type.toLowerCase() == 'post') && (typeof contentType == "string") && (contentType.toLowerCase().indexOf('application/json') != -1)) {
      data = JSON.stringify(data);
    }
    $.ajax(params.url, {
      data: data,
      type: type,
      contentType: contentType,
      processData: processData,
      success: function (result) {
        try {
          params.success(result);
        } catch (ex) {
          self.loadingCall(false);
          throw ex;
        }
        self.loadingCall(false);
      },
      error: function (result) {
        if (result.status == 401) {
          self.submitGet({ url: "/Account/Login", data: { ReturnUrl: location.pathname, Unauthorized: true } });
        }
        else {
          if ((typeof result.responseText == "string") && (result.responseText.length > 0)) {
            try {
              var exception = $.parseJSON(result.responseText);
              self.catchException(exception, params.error);
            } catch (ex) {
              self.catchException({ Message: result.responseText }, params.error);
            }
          } else {
            throw 'Se presentó una condición de falla.';
          }
        }
        self.loadingCall(false);
      },
    });
  },
  submitGet: function (params) {
    var url = params.url;
    var data = params.data || {};
    var separator = '?';
    if (typeof data == "object") {
      for (var prop in data) {
        url += separator + prop + '=' + escape(data[prop] ? data[prop].toString() : '');
        separator = '&';
      }
    }
    window.location.href = url;
    return;
  },
  submitPost: function (params) {
    var form = document.createElement("form");
    var url = params.url;
    var data = params.data || {};
    if (typeof data == "object") {
      for (var prop in data) {
        var opt = document.createElement("textarea");
        opt.name = prop;
        opt.value = (data[prop] == undefined) || (data[prop] == null) ? "" : data[prop].toString();
        form.appendChild(opt);
      }
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