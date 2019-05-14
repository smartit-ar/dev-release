(namespace("SmartFran.Seed.JS.ko").Mask = function () {
  ko.subscribable.fn.maskedField = function (initParams) {
    var self = this;
    var input;
    initParams = initParams || {};
    if (typeof initParams !== "object") {
      initParams = { mask: initParams, };
    }
    var mask = initParams.mask || "remove";
    var unmask = initParams.unmask || "";

    function prepareMask() {
      if (!input) {
        input = $("<input type='text'>");
      }
      if (mask === "currency") {
        input.inputmask("$ 999,999,999.99", { numericInput: true, });
      } else {
        input.inputmask(mask);
      }
    }

    function getMaskValue(value) {
      if (mask === "currency") {
        return formatToCurrency(value);
      }

      var dateEval = value;
      if (typeof dateEval === "string" && dateEval.startsWith("/Date(")) {
        dateEval = new Date(parseInt(dateEval.substr(6)));
      }

      if (typeof dateEval === "string") {
        try {
          dateEval = new Date(dateEval);
        }
        catch (error) {
          dateEva = null;
        }
      }

      if (typeof dateEval === "string") {
        try {
          dateEval = new Date(dateEval);
        }
        catch (error) {
          dateEval = null;
        }
      }

      if (dateEval !== null
        && Object.prototype.toString.call(dateEval) === "[object Date]"
        && !isNaN(dateEval.getTime())) {
        return moment(dateEval).format(mask);
      }

      prepareMask();
      input.val(value);
      return input.val();
    }

    function formatToCurrency(value) {
      if (value === null) {
        return null;
      }
      var part = value.toString().split(".");
      var dec = "00";
      var inte = "0";
      if (part.length === 2) {
        inte = part[0];
        dec = (part[1] + "00").substr(0, 2);
      }
      if (part.length === 1) {
        inte = part[0];
      }
      return "$" + inte + "." + dec;
    };

    function getUnmaskValue(value) {
      if (unmask) {
        return value.replace(unmask, "");
      }

      prepareMask();
      input.val(value).change();
      var result = value;
      if (input.inputmask("hasMaskedValue")) {
        result = input.inputmask("unmaskedvalue");
      }
      return result;
    }

    prepareMask();

    self.masked = ko.computed({
      read: function () {
        return getMaskValue(self());
      },
      write: function (value) {
        var val = self.peek();
        var unmaskVal = getUnmaskValue(value);
        if (val != unmaskVal) {
          self(unmaskVal);
        };
      },
      owner: self,
    });

    self.masked.assignMask = function (elem) {
      elem.inputmask(mask);
    };

    self.masked.setMask = function (params) {
      params = params || {};
      if (typeof params != "object") {
        params = { mask: params, };
      }
      mask = params.mask || "remove";
      unmask = params.unmask || "";
      prepareMask();
    };

    self.masked.noMask = function () {
      mask = "remove";
      unmask = "";
      prepareMask();
    };

    return self;
  };

  ko.validation.rules["isValidEmail"] = {
    validator: function (val, params) {
      params[0] = "El formato del email no es válido. - Su email tiene caracteres especiales no permitidos para la registración en nuestra página.";
      var re = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/i;
      if (re.test(val) != true) {
        var re2 = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9\u00E1\u00E9\u00ED\u00F3\u00FA\u00F1\u00FC]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/i;
        if (re2.test(val) == true) {
          params[0] = params[0].split("-")[1];
          return false;
        } else {
          params[0] = params[0].split("-")[0];
          return false;
        }
      } else {
        return true;
      }
    },
    message: "{0}",
  };
})();