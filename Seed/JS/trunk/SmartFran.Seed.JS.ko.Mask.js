(namespace('SmartFran.Seed.JS.ko').Mask = function () {
  ko.subscribable.fn.maskedField = function (initParams) {
    var self = this;
    var input;
    initParams = initParams || {};
    if (typeof initParams != "object") {
      initParams = { mask: initParams };
    }
    var mask = initParams.mask || 'remove';
    var unmask = initParams.unmask || '';

    function prepareMask() {
      if (!input) {        
        input = $("<input type='text'>");
      }            
      if (mask == 'currency') {
        input.inputmask('$ 999.999.999,99', { numericInput: true, radixPoint: "," });
      } else {
        input.inputmask(mask);
      }      
    }

    function getMaskValue(value) {
      if (mask == 'currency') {        
        return formatToCurrency(value);
      }      
      var regJsonDate = new RegExp(/^\/Date\((\d+)(?:-(\d+))?\)\/$/);
      if (regJsonDate.exec(value) != null) {
        return moment(value).format(mask);
      }
      prepareMask();
      input.val(value);
      return input.val();
    }
    
    function formatToCurrency(value) {
      if (value == null) {
        return null;
      }
      var str = value.toString();
      var dec = str.split('.');
      if ((dec.length == 2) && (dec[1].length == 1)) {
        dec[1] = dec[1] + '0';
        return '$' + dec[0] + '.' + dec[1];
      }
      if (dec[0] == '') {
        dec[0] = '0';
      }
      return '$' + dec[0] + '.00';
    };

    function getUnmaskValue(value) {
      if (unmask) {
        return value.replace(unmask, '');
      }

      prepareMask();
      input.val(value).change();
      var result = value;
      if (input.inputmask('hasMaskedValue')) {
        result = input.inputmask('unmaskedvalue');
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
      owner: self
    });

    self.masked.assignMask = function (elem) {
      elem.inputmask(mask);
    };
    
    self.masked.setMask = function (params) {
      params = params || {};
      if (typeof params != "object") {
        params = { mask: params };
      }
      mask = params.mask || 'remove';
      unmask = params.unmask || '';
      prepareMask();
    };
    
    self.masked.noMask = function () {
      mask = 'remove';
      unmask = '';
      prepareMask();
    };
    
    return self;
  };
})();