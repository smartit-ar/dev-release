namespace("SmartFran.Seed.JS.VM").Base = function (model) {
  let self = this;

  self.model = model || {};
  self.isLoading = ko.observable(false);
  self.isLoadingModal = ko.observable(false);
  self.errorMessage = ko.observable(null);
  self._countLoading = 0;

  // "ErrorModal" is maintained for compatibility
  self.ErrorModal = {
    message: self.errorMessage, clearMessage: function () { self.errorModal(null); },
  };

  self.loadingCall = function (startLoading, loadingModal) {
    if (startLoading) {
      self.isLoadingModal(loadingModal || (self.isLoadingModal.peek() && self.isLoading()));
      ++self._countLoading;
      self.isLoading(true);
    }
    else {
      self._countLoading = Math.max(0, (self._countLoading - 1));
      if (self._countLoading == 0) {
        self.isLoading(false);
      }
    }
  };

  self.catchException = function (exception, errorCallback) {
    if (exception) {
      if (typeof errorCallback == "function") {
        if (!errorCallback(exception) && (typeof exception.Message == "string") && (exception.Message.length > 0)) {
          self.errorMessage(exception.Message);
        }
      }
      else if ((typeof exception.Message == "string") && (exception.Message.length > 0)) {
        self.errorMessage(exception.Message);
      }
    }
  };

  self.asyncCallToModel = function (params) {
    self.errorMessage("");

    self.loadingCall(true, params.loadingModal);
    var type = params.type || "post";
    var contentType = params.contentType == null || params.contentType == undefined ? "application/json" : params.contentType;
    var processData = params.processData == null || params.processData == undefined || params.processData;
    var data = params.data;
    if ((type.toLowerCase() == "post") && (typeof contentType == "string") && (contentType.toLowerCase().indexOf("application/json") != -1)) {
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
          self.submitGet({ url: vm_GetUrlToLogin(), data: { ReturnUrl: location.pathname, Unauthorized: true, }, });
        }
        else {
          if ((typeof result.responseText == "string") && (result.responseText.length > 0)) {
            try {
              var exception = $.parseJSON(result.responseText);
              self.catchException(exception, params.error);
            } catch (ex) {
              self.catchException({ Message: result.responseText, }, params.error);
            }
          } else {
            throw vm_GetDefaultExceptionMessage();
          }
        }
        self.loadingCall(false);
      },
    });
  };

  self.submitGet = function (params) {
    var url = params.url;
    var data = params.data || {};
    var separator = "?";
    if (typeof data == "object") {
      for (var prop in data) {
        url += separator + prop + "=" + escape(data[prop] ? data[prop].toString() : "");
        separator = "&";
      }
    }
    window.location.href = url;
    return;
  };

  self.submitPost = function (params) {
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
  };

  self.redirect = function (url) {
    window.location.href = url;
    return;
  };

  self.vm_GetUrlToLogin = function () {
    // Override
    return "/Account/Login";
  };

  self.vm_GetDefaultExceptionMessage = function () {
    // Override
    return "Se presentó una condición de falla.";
  };

  self.vm_OnLoad = function () {
    // Override
  };

  self.vm_OnAfterBinding = function () {
    // Override
  };

  self.vm_InitValidations = function () {
    // Override
  };

  self._load = function () {
    self.vm_OnLoad(self);
    if (typeof ko.validation === "object") {
      ko.validation.registerExtenders();
      self.vm_InitValidations(self);
    };
  };

  self._afterBinding = function () {
    self.vm_OnAfterBinding(self);
  };

  self.ajaxObjectProcessResults = function (params) {
    var type = params.type || "GET";
    var dataType = params.dataType == null || params.dataType == undefined ? "json" : params.contentType;
    var processData = params.processData == null || params.processData == undefined || params.processData;
    var data = params.data;
    if ((type.toLowerCase() == "post") && (typeof contentType == "string") && (contentType.toLowerCase().indexOf("application/json") != -1)) {
      data = JSON.stringify(data);
    }
    return {
      url: params.url,
      type: type,
      dataType: dataType,
      data: data,
      processResults: processData,
      error: function (result) {
        if (result.status == 401) {
          self.submitGet({ url: vm_GetUrlToLogin(), data: { ReturnUrl: location.pathname, Unauthorized: true, }, });
        }
        else {
          if ((typeof result.responseText == "string") && (result.responseText.length > 0)) {
            try {
              var exception = $.parseJSON(result.responseText);
              self.catchException(exception, params.error);
            } catch (ex) {
              self.catchException({ Message: result.responseText, }, params.error);
            }
          } else {
            throw vm_GetDefaultExceptionMessage();
          }
        }
      },
    };
  };

  self.ajaxObjectDataFilter = function (params) {
    var type = params.type || "GET";
    var dataType = params.dataType == null || params.dataType == undefined ? "json" : params.contentType;
    var dataFilter = params.dataFilter == null || params.dataFilter == undefined || params.dataFilter;
    var data = params.data;
    if ((type.toLowerCase() == "post") && (typeof contentType == "string") && (contentType.toLowerCase().indexOf("application/json") != -1)) {
      data = JSON.stringify(data);
    }
    return {
      url: params.url,
      type: type,
      dataType: dataType,
      data: data,
      dataFilter: dataFilter,
      error: function (result) {
        if (result.status == 401) {
          self.submitGet({ url: vm_GetUrlToLogin(), data: { ReturnUrl: location.pathname, Unauthorized: true, }, });
        }
        else {
          if ((typeof result.responseText == "string") && (result.responseText.length > 0)) {
            try {
              var exception = $.parseJSON(result.responseText);
              self.catchException(exception, params.error);
            } catch (ex) {
              self.catchException({ Message: result.responseText, }, params.error);
            }
          } else {
            throw vm_GetDefaultExceptionMessage();
          }
        }
      },
    };
  };

  document.addEventListener("DOMContentLoaded", function (event) {
    self._load();
    ko.applyBindings(self, document.body);
    self._afterBinding();
  });
};
