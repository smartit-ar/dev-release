(namespace('SmartFran.Seed.JS.ko').Mask = function () {
  ko.subscribable.fn.maskedField = function (initParams) {
    var self = this;
    initParams = initParams || {};
    if (typeof initParams != "object") {
      initParams = { mask: initParams };
    }
    var mask = initParams.mask || '';
    var unmask = initParams.unmask || '';
    var type = initParams.type || 'generic';

    self.masked = ko.computed({
      read: function () {
        return getMaskValue(self());
      },
      write: function (value) {
        var val = self.peek();
        var unmaskVal;
        unmaskVal = getUnmaskValue(value);
        if (val == unmaskVal) {
          self.notifySubscribers(unmaskVal);
        } else {
          self(unmaskVal);
        };
      },
      owner: self
    });

    self.masked.setMask = function (params) {
      params = params || {};
      if (typeof params != "object") {
        params = { mask: params };
      }
      mask = params.mask || '';
      unmask = params.unmask || '';
      type = params.type || 'generic';
    };

    function getMaskValue(value) {
      if (type == 'number') {
        return maskNumber(value);
      } else if (type == 'date') {
        return maskDate(value);
      }

      return maskGeneric(value);
    }

    function getUnmaskValue(value) {
      return value.replace(unmask, '');
    }

    function maskGeneric(value) {
      var v = value, m = mask;
      var r = "x#*", rt = [], nv = "", t, x, a = [], j = 0, rx = { "x": "A-Za-z", "#": "0-9", "*": "A-Za-z0-9" };

      // strip out invalid characters
      v = v.replace(new RegExp("[^" + rx["*"] + "]", "gi"), "");
      for (var i = 0; i < m.length; i++) {
        // grab the current character
        x = m.charAt(i);
        // check to see if current character is a mask, escape commands are not a mask character
        t = (r.indexOf(x) > -1);
        // if the current character is an escape command, then grab the next character
        if (x == "!") x = m.charAt(i++);
        // build a regex to test against
        if (t) rt[rt.length] = "[" + rx[x] + "]";
        // build mask definition table
        a[a.length] = { "chr": x, "mask": t };
      }

      // if the regex fails, return an error
      if (!(new RegExp(rt.join(""))).test(v)) return '';
      // loop through the mask definition, and build the formatted string
      for (i = 0; i < a.length; i++) {
        if (a[i].mask) {
          while (v.length > 0 && !(new RegExp(rt[j])).test(v.charAt(j))) v = (v.length == 1) ? "" : v.substring(1);
          if (v.length > 0) {
            nv += v.charAt(j);
          }
          j++;
        } else nv += a[i].chr;
      }
      return nv;
    }

    function maskNumber(value) {
      var v = String(value).replace(/[^\d.-]*/gi, ""), m = mask;
      // make sure there's only one decimal point
      v = v.replace(/\./, "d").replace(/\./g, "").replace(/d/, ".");

      // check to see if an invalid mask operation has been entered
      if (!/^[\$]?((\$?[\+-]?([0#]{1,3},)?[0#]*(\.[0#]*)?)|([\+-]?\([\+-]?([0#]{1,3},)?[0#]*(\.[0#]*)?\)))$/.test(m))
        return value;

      if (v.length == 0) v = NaN;
      var vn = Number(v);
      if (isNaN(vn)) return '';

      // if no mask, stop processing
      if (m.length == 0) return v;

      // get the value before the decimal point
      var vi = String(Math.abs((v.indexOf(".") > -1) ? v.split(".")[0] : v));
      // get the value after the decimal point
      var vd = (v.indexOf(".") > -1) ? v.split(".")[1] : "";

      var isNegative = (vn != 0 && Math.abs(vn) * -1 == vn);

      // check for masking operations
      var show = {
        "$": /^[\$]/.test(m),
        "(": (isNegative && (m.indexOf("(") > -1)),
        "+": ((m.indexOf("+") != -1) && !isNegative)
      };
      show["-"] = (isNegative && (!show["("] || (m.indexOf("-") != -1)));


      // replace all non-place holders from the mask
      m = m.replace(/[^#0.,]*/gi, "");

      /*
        make sure there are the correct number of decimal places
      */
      // get number of digits after decimal point in mask
      var dm = (m.indexOf(".") > -1) ? m.split(".")[1] : "";
      if (dm.length == 0) {
        vi = String(Math.round(Number(vi)));
        vd = "";
      } else {
        // find the last zero, which indicates the minimum number
        // of decimal places to show
        var md = dm.lastIndexOf("0") + 1;
        // if the number of decimal places is greater than the mask, then round off
        if (vd.length > dm.length) vd = String(Math.round(Number(vd.substring(0, dm.length + 1)) / 10));
          // otherwise, pad the string w/the required zeros
        else while (vd.length < md) vd += "0";
      }

      /*
        pad the int with any necessary zeros
      */
      // get number of digits before decimal point in mask
      var im = (m.indexOf(".") > -1) ? m.split(".")[0] : m;
      im = im.replace(/[^0#]+/gi, "");
      // find the first zero, which indicates the minimum length
      // that the value must be padded w/zeros
      var mv = im.indexOf("0") + 1;
      // if there is a zero found, make sure it's padded
      if (mv > 0) {
        mv = im.length - mv + 1;
        while (vi.length < mv) vi = "0" + vi;
      }
      /*
        check to see if we need commas in the thousands place holder
      */
      if (/[#0]+,[#0]{3}/.test(m)) {
        // add the commas as the place holder
        var x = [], i = 0, n = Number(vi);
        while (n > 999) {
          x[i] = "00" + String(n % 1000);
          x[i] = x[i].substring(x[i].length - 3);
          n = Math.floor(n / 1000);
          i++;
        }
        x[i] = String(n % 1000);
        vi = x.reverse().join(",");
      }
      /*
        combine the new value together
      */
      if (vd.length > 0) {
        v = vi + "." + vd;
      } else {
        v = vi;
      }

      if (show["$"]) v = mask.replace(/(^[\$])(.+)/gi, "$") + v;
      if (show["+"]) v = "+" + v;
      if (show["-"]) v = "-" + v;
      if (show["("]) v = "(" + v + ")";
      return v;
    }

    function maskDate(value) {
      var v = value, m = mask;
      var a, e, mm, dd, yy, x, s;

      // split mask into array, to see position of each day, month & year
      a = m.split(/[^mdy]+/);
      // split mask into array, to get delimiters
      s = m.split(/[mdy]+/);
      // convert the string into an array in which digits are together
      e = v.split(/[^0-9]/);

      if (s[0].length == 0) s.splice(0, 1);

      for (var i = 0; i < a.length; i++) {
        x = a[i].charAt(0).toLowerCase();
        if (x == "m") mm = parseInt(e[i], 10) - 1;
        else if (x == "d") dd = parseInt(e[i], 10);
        else if (x == "y") yy = parseInt(e[i], 10);
      }

      // if year is abbreviated, guess at the year
      if (String(yy).length < 3) {
        yy = 2000 + yy;
        if ((new Date()).getFullYear() + 5 < yy) yy = yy - 100;
      }

      // create date object
      var d = new Date(yy, mm, dd);

      if (d.getDate() != dd) return '';
      else if (d.getMonth() != mm) return '';

      var nv = "";

      for (i = 0; i < a.length; i++) {
        x = a[i].charAt(0).toLowerCase();
        if (x == "m") {
          mm++;
          if (a[i].length == 2) {
            mm = "0" + mm;
            mm = mm.substring(mm.length - 2);
          }
          nv += mm;
        } else if (x == "d") {
          if (a[i].length == 2) {
            dd = "0" + dd;
            dd = dd.substring(dd.length - 2);
          }
          nv += dd;
        } else if (x == "y") {
          if (a[i].length == 2) nv += d.getYear();
          else nv += d.getFullYear();
        }

        if (i < a.length - 1) nv += s[i];
      }

      return nv;
    };

    return self;
  };
})();