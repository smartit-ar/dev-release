Array.prototype.max = function () {
  return Math.max.apply(null, this);
};
Array.prototype.min = function () {
  return Math.min.apply(null, this);
};
String.prototype.toCamelCase = function () {
  var str = this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  return str.trim();
};
String.prototype.capitalizeFirstLetter = function () {
  var str = this.charAt(0).toUpperCase() + this.substring(1);
  return str.trim();
};
namespace("SmartFran.Seed.JS").Utility = {
  Date: {
    ageToCertainDate: function (birthDate, certainDate) {
      if ((birthDate == null || birthDate == "undefined") || (certainDate == null || certainDate == "undefined")) {
        return null;
      }

      var intCertainDate = Seed.Utility.Date.jsonToDateTime(certainDate);
      var intBirthDate = Seed.Utility.Date.jsonToDateTime(birthDate);
      var difAnio = intCertainDate.getFullYear() - intBirthDate.getFullYear();
      var age = -1; // Error que representa edad negativa. Fecha Nacim posterior a fecha de referencia p/calculo edad
      if (difAnio == 0) {
        age = intCertainDate.getMonth() > intBirthDate.getMonth()
          ? 0                                                       // age = 0 ; Edad = meses o días (bebé)
          : intCertainDate.getMonth() == intBirthDate.getMonth()
            ? intCertainDate.getDate() >= intBirthDate.getDate()
              ? 0
              : age
            : age;
      }
      if (difAnio > 0) {
        age = intCertainDate.getMonth() > intBirthDate.getMonth()
          ? difAnio
          : intCertainDate.getMonth() < intBirthDate.getMonth()
            ? difAnio - 1
            : intCertainDate.getDate() >= intBirthDate.getDate()
              ? difAnio
              : difAnio - 1;
      }
      return age;
    },
    writeSpLargeDate: function (date) {
      var fecha = date != null ? date : new Date;
      var mes = fecha.getMonth();
      var diaMes = fecha.getDate();
      var diaSemana = fecha.getDay();
      var anio = fecha.getFullYear();
      var dias = new Array("Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado");
      var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
      document.write(dias[diaSemana] + ", " + diaMes + " de " + meses[mes] + " de " + anio);
    },
    writeSpShortWeekDay: function () {
      var fecha = new Date();
      var diaSemana = fecha.getDay();
      var dias = new Array("DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB");
      document.write(dias[diaSemana]);
    },
    writeSpShortMonth: function (mes) {
      if (mes == null) {
        var fecha = new Date();
        mes = fecha.getMonth();
      }
      var meses = new Array("ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC");
      document.write(meses[mes]);
      return meses[mes];
    },
    getShortMonth: function (mes) {
      if (mes == null) {
        var fecha = new Date();
        mes = fecha.getMonth();
      }
      var meses = new Array("ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC");
      return meses[mes];
    },
    writeDateMonthDay: function () {
      var fecha = new Date();
      var diaMes = fecha.getDate();
      document.write(diaMes);
    },
    writeDateYear: function (anio) {
      if (anio == null) {
        var fecha = new Date();
        anio = fecha.getFullYear();
      }
      document.write(anio);
    },
    dateTimeToDotNetTicks: function (date) {
      if (date == null || date == "undefined") {
        return null;
      }

      return (date.getTime() * 10000) + 621355968000000000;
    },
    dateTimeToJson: function (date) {
      if (date == null || date == "undefined") {
        return null;
      }

      if (typeof date == "string" && this.isJsonDateTime(date)) {
        return date;
      }
      if (typeof date != "number") {
        date = Date.parse(date);
      }
      return "/Date(" + date + ")/";
    },
    dateTimeUtcToJson: function (date) {
      if (date == null || date == "undefined") {
        return null;
      }

      if (typeof date == "string" && this.isJsonDateTime(date)) {
        return date;
      }
      if (typeof date != "number") {
        date = Date.parse(date);
      }
      return "/Date(" + (parseInt(date) + ((new Date()).getTimezoneOffset() * 60000)) + ")/";
    },
    jsonToDateTime: function (date) {
      if (date == null || date == "undefined") {
        return null;
      }

      if (typeof date != "string") {
        return date;
      }

      if (typeof date === "string" && date.startsWith("/Date(")) {
        return new Date(parseInt(date.substr(6)));
      }

      return new Date(date);
    },
    isJsonDateTime: function (date) {
      if (date == null || date == "undefined") {
        return null;
      }

      var regJsonDate = new RegExp(/Date\(([^)]+)\)/);
      return regJsonDate.exec(date) != null;
    },
    getDateWithoutTime: function (date) {
      if (date == null || date == "undefined") {
        return null;
      }

      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    },
    getNowWithoutTime: function () {
      return this.getDateWithoutTime(new Date());
    },
    getDateFirstDayOfCurrentMonthWithoutTime: function () {
      var date = new Date();
      return new Date(date.getFullYear(), date.getMonth(), 1);
    },
    getDateLastDayOfCurrentMonthWithoutTime: function () {
      var date = new Date();

      function getLastDay(month, year) {
        month = parseInt(month);
        year = parseInt(year);
        switch (month) {
          case 0: case 2: case 4: case 6: case 7: case 9: case 11: return 31;
          case 1: return (year % 4 == 0) ? 29 : 28;
        }
        return 30;
      };

      return new Date(date.getFullYear(), date.getMonth(), getLastDay(date.getMonth(), date.getFullYear()));
    },
    getDateFirstDayOfLastMonthWithoutTime: function () {
      var date = new Date();
      var year = date.getMonth() == 0 ? date.getFullYear() - 1 : date.getFullYear();
      return date.getMonth() == 0 ? new Date(date.getFullYear(), date.getMonth() - 1, 1) : new Date(year, date.getMonth() - 1, 1);
    },
    getDateLastDayOfLastMonthWithoutTime: function () {
      var date = new Date();

      function getLastDay(month, year) {
        year = month == 0 ? parseInt(year) - 1 : parseInt(year);
        month = parseInt(month) - 1;
        switch (month) {
          case -1: case 0: case 2: case 4: case 6: case 7: case 9: case 11: return 31;
          case 1: return (year % 4 == 0) ? 29 : 28;
        }
        return 30;
      };
      return new Date(date.getFullYear(), date.getMonth() - 1, getLastDay(date.getMonth(), date.getFullYear()));
    },
    totalDaysCalculator: function (since, to) {
      if ((since == null || since == "undefined") || (to == null || to == "undefined")) {
        return null;
      }

      var datediff = Seed.Utility.Date.jsonToDateTime(to) - Seed.Utility.Date.jsonToDateTime(since);
      if (Math.ceil(datediff / 86400000) == 0) {
        return 1;
      }
      return Math.ceil(datediff / 86400000);
    },

    totalSelectedDaysCalculator: function (since, to) {
      if ((since == null || since == "undefined") || (to == null || to == "undefined")) {
        return null;
      }

      var datediff = Seed.Utility.Date.jsonToDateTime(to) - Seed.Utility.Date.jsonToDateTime(since);
      return Math.ceil(datediff / 86400000) + 1;
    },

    getTodayPlusDays: function (days) {
      if ((days == "undefined") || (days == null) || (typeof days !== "number")) {
        days = 0;
      }

      var date = new Date();
      return date.setDate(date.getDate() + days);
    },

    add: function (part, offset, date) {
      if (
        typeof part !== "string"
        || typeof offset !== "number"
        || Object.prototype.toString.call(date) !== "[object Date]") {
        return null;
      }

      var result = new Date(date);
      if (part.toLowerCase().substr(0, 3) == "day") {
        result = new Date(date.setDate(date.getDate() + offset));
      }
      else if (part.toLowerCase().substr(0, 4) == "week") {
        result = new Date(date.setDate(date.getDate() + (offset * 7)));
      }
      else if (part.toLowerCase().substr(0, 4) == "hour") {
        result = new Date(date.setHours(date.getHours() + offset));
      }
      else if (part.toLowerCase().substr(0, 3) == "min") {
        result = new Date(date.setMinutes(date.getMinutes() + offset));
      }
      else if (part.toLowerCase().substr(0, 3) == "sec") {
        result = new Date(date.setSeconds(date.getSeconds() + offset));
      }
      else if (part.toLowerCase().substr(0, 5) == "month") {
        result = new Date(date.setMonth(date.getMonth() + offset));
      }
      else if (part.toLowerCase().substr(0, 4) == "year") {
        result = new Date(date.setFullYear(date.getFullYear() + offset));
      }

      return result;
    },

    diff: function (part, since, to) {
      if (
        typeof part !== "string"
        || Object.prototype.toString.call(since) !== "[object Date]"
        || Object.prototype.toString.call(to) !== "[object Date]") {
        return null;
      }

      var result = 0;
      var diffMs = to - since;

      if (part.toLowerCase().substr(0, 3) == "day") {
        result = parseInt(diffMs / (1000 * 60 * 60 * 24));
      }
      else if (part.toLowerCase().substr(0, 4) == "hour") {
        result = parseInt(diffMs / (1000 * 60 * 60));
      }
      else if (part.toLowerCase().substr(0, 3) == "min") {
        result = parseInt(diffMs / (1000 * 60));
      }
      else if (part.toLowerCase().substr(0, 3) == "sec") {
        result = parseInt(diffMs / 1000);
      }
      else if (part.toLowerCase().substr(0, 4) == "week") {
        result = parseInt(diffMs / (1000 * 60 * 60 * 24 * 7));
      }
      else if (part.toLowerCase().substr(0, 5) == "month") {
        result = (to.getMonth() + (12 * to.getFullYear())) - (since.getMonth() + (12 * since.getFullYear()));
      }
      else if (part.toLowerCase().substr(0, 4) == "year") {
        result = parseInt(((to.getMonth() + (12 * to.getFullYear())) - (since.getMonth() + (12 * since.getFullYear()))) / 12);
      }

      return result;
    },
  },

  Number: {
    getStringMaskedIntegerNumber: function (number) {
      if (number == null || number == "undefined") {
        return null;
      }

      var stringNumber = "" + number;
      var amount = stringNumber.split("").reverse();
      var output = "";
      for (var i = 0; i <= amount.length - 1; i++) {
        output = amount[i] + output;
        if ((i + 1) % 3 == 0 && (amount.length - 1) !== i) output = "." + output;
      }
      return output;
    },
    getStringMaskedDoubleNumber: function (number) {
      if (number == null || number == "undefined") {
        return null;
      }

      var stringNumberArray = number.toFixed(2).toString().replace(".", ",").split(",");

      var amount = stringNumberArray[0].split("").reverse();
      var output = "";
      for (var i = 0; i <= amount.length - 1; i++) {
        output = amount[i] + output;
        if ((i + 1) % 3 == 0 && (amount.length - 1) !== i) output = "." + output;
      }

      return output + "," + stringNumberArray[1];
    },
    addZeros: function (str, len) {
      if (typeof str === "number" || Number(str)) {
        str = str.toString();
        return (len - str.length > 0) ? new Array(len + 1 - str.length).join("0") + str : str;
      } else {
        for (var i = 0, spl = str.split(" "); i < spl.length; spl[i] = (Number(spl[i]) && spl[i].length < len) ? addZeros(spl[i], len) : spl[i], str = (i == spl.length - 1) ? spl.join(" ") : str, i++);
        return str;
      }
    },
  },
  Html: {
    encodeTilde: function (str) {
      str = str.replace(/á/g, "&aacute;");
      str = str.replace(/é/g, "&eacute;");
      str = str.replace(/í/g, "&iacute;");
      str = str.replace(/ó/g, "&oacute;");
      str = str.replace(/ú/g, "&uacute;");

      str = str.replace(/Á/g, "&Aacute;");
      str = str.replace(/É/g, "&Eacute;");
      str = str.replace(/Í/g, "&Iacute;");
      str = str.replace(/Ó/g, "&Oacute;");
      str = str.replace(/Ú/g, "&Uacute;");

      str = str.replace(/ñ/g, "&ntilde;");
      str = str.replace(/Ñ/g, "&Ntilde;");
      return str;
    },
  },
};

ko.bindingHandlers.verticalSlideVisible = {
  init: function (element, valueAccessor) {
    // Initially set the element to be instantly visible/hidden depending on the value
    var value = valueAccessor();
    $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
  },
  update: function (element, valueAccessor) {
    // Whenever the value subsequently changes, slowly fade the element in or out
    var value = valueAccessor();
    ko.unwrap(value) ? $(element).slideDown() : $(element).slideUp();
  },
};