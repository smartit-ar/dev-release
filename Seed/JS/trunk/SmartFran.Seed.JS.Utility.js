namespace('SmartFran.Seed.JS').Utility = {
  Date: {
    ageToCertainDate: function (birthDate, certainDate) {
      if ((birthDate == null || birthDate == 'undefined') || (certainDate == null || certainDate == 'undefined')) {
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
      var dias = new Array('Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado');
      var meses = new Array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
      document.write(dias[diaSemana] + ", " + diaMes + " de " + meses[mes] + " de " + anio);
    },
    writeSpShortWeekDay: function () {
      var fecha = new Date();
      var diaSemana = fecha.getDay();
      var dias = new Array('DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB');
      document.write(dias[diaSemana]);
    },
    writeSpShortMonth: function (mes) {
      if (mes == null) {
        var fecha = new Date();
        mes = fecha.getMonth();
      }
      var meses = new Array('ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC');
      document.write(meses[mes]);
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
      if (date == null || date == 'undefined') {
        return null;
      }

      return (date.getTime() * 10000) + 621355968000000000;
    },
    dateTimeToJson: function (date) {
      if (date == null || date == 'undefined') {
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
      if (date == null || date == 'undefined') {
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
      if (date == null || date == 'undefined') {
        return null;
      }

      if (typeof date != "string") {
        return date;
      }
      return new Date(parseInt(date.substr(6)));
    },
    isJsonDateTime: function (date) {
      if (date == null || date == 'undefined') {
        return null;
      }

      var regJsonDate = new RegExp(/Date\(([^)]+)\)/);
      return regJsonDate.exec(date) != null;
    },
    getDateWithoutTime: function (date) {
      if (date == null || date == 'undefined') {
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
      return new Date(year, date.getMonth() - 1, 1);
    },
    getDateLastDayOfLastMonthWithoutTime: function () {
      var date = new Date();

      function getLastDay(month, year) {
        year = month == 0 ? parseInt(year) - 1 : parseInt(year);
        month = parseInt(month) - 1;
        switch (month) {
          case 0: case 2: case 4: case 6: case 7: case 9: case 11: return 31;
          case 1: return (year % 4 == 0) ? 29 : 28;
        }
        return 30;
      };

      return new Date(date.getFullYear(), date.getMonth() - 1, getLastDay(date.getMonth(), date.getFullYear()));
    },
    totalDaysCalculator: function (since, to) {
      if ((since == null || since == 'undefined') || (to == null || to == 'undefined')) {
        return null;
      }

      var datediff = Seed.Utility.Date.jsonToDateTime(to) - Seed.Utility.Date.jsonToDateTime(since);
      if (Math.ceil(datediff / 86400000) == 0) {
        return 1;
      }
      return Math.ceil(datediff / 86400000);
    },
    totalSelectedDaysCalculator: function (since, to) {
      if ((since == null || since == 'undefined') || (to == null || to == 'undefined')) {
        return null;
      }

      var datediff = Seed.Utility.Date.jsonToDateTime(to) - Seed.Utility.Date.jsonToDateTime(since);
      return Math.ceil(datediff / 86400000) + 1;
    }
  },
  Number: {
    getStringMaskedIntegerNumber: function (number) {
      if (number == null || number == 'undefined') {
        return null;
      }

      var stringNumber = '' + number;
      var amount = stringNumber.split("").reverse();
      var output = "";
      for (var i = 0; i <= amount.length - 1; i++) {
        output = amount[i] + output;
        if ((i + 1) % 3 == 0 && (amount.length - 1) !== i) output = '.' + output;
      }
      return output;
    }
  },
  Html: {
    encodeTilde: function (str) {
      str = str.replace(/á/g, '&aacute;');
      str = str.replace(/é/g, '&eacute;');
      str = str.replace(/í/g, '&iacute;');
      str = str.replace(/ó/g, '&oacute;');
      str = str.replace(/ú/g, '&uacute;');

      str = str.replace(/Á/g, '&Aacute;');
      str = str.replace(/É/g, '&Eacute;');
      str = str.replace(/Í/g, '&Iacute;');
      str = str.replace(/Ó/g, '&Oacute;');
      str = str.replace(/Ú/g, '&Uacute;');

      str = str.replace(/ñ/g, '&ntilde;');
      str = str.replace(/Ñ/g, '&Ntilde;');
      return str;
    }
  }
};