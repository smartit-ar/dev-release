namespace('SmartFran.Seed.JS').Utility = {
  Date: {
    ageToCertainDate: function (birthDate, certainDate) {
      var intCertainDate = Seed.Utility.Date.jsonToDateTime(certainDate);
      var intBirthDate = Seed.Utility.Date.jsonToDateTime(birthDate);
      var dif = (intCertainDate - intBirthDate);
      var age = Math.floor(dif / 31557600000);
      return age;
    },
    writeSpLargeDate: function () {
      var fecha = new Date();
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
    writeSpShortMonth: function () {
      var fecha = new Date();
      var mes = fecha.getMonth();
      var meses = new Array('ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC');
      document.write(meses[mes]);
    },
    writeDateMonthDay: function () {
      var fecha = new Date();
      var diaMes = fecha.getDate();
      document.write(diaMes);
    },
    writeDateYear: function () {
      var fecha = new Date();
      var anio = fecha.getFullYear();
      document.write(anio);
    },
    dateTimeToDotNetTicks: function (date) {
      return (date.getTime() * 10000) + 621355968000000000;
    },
    dateTimeToJson: function (date) {
      if (typeof date == "string" && this.isJsonDateTime(date)) {
        return date;
      }
      if (typeof date != "number") {
        date = Date.parse(date);
      }
      return "/Date(" + date + ")/";
    },
    dateTimeUtcToJson: function (date) {
      if (typeof date == "string" && this.isJsonDateTime(date)) {
        return date;
      }
      if (typeof date != "number") {
        date = Date.parse(date);
      }
      return "/Date(" + (parseInt(date) + ((new Date()).getTimezoneOffset() * 60000)) + ")/";
    },
    jsonToDateTime: function (date) {
      if (typeof date != "string") {
        return date;
      }
      return new Date(parseInt(date.substr(6)));
    },
    isJsonDateTime: function (date) {
      var regJsonDate = new RegExp(/Date\(([^)]+)\)/);
      return regJsonDate.exec(date) != null;
      ////var regJsonDate = new RegExp(/^\/Date\((\d+)(?:-(\d+))?\)\/$/);
      ////return regJsonDate.exec(date) != null;
    },
    getDateWithoutTime: function (date) {
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
    totalDaysCalculator: function(since, to) {
      var datediff = Seed.Utility.Date.jsonToDateTime(to) - Seed.Utility.Date.jsonToDateTime(since);
      if (Math.ceil(datediff / 86400000) == 0) {
        return 1;
      }
      return Math.ceil(datediff / 86400000);
    },
    totalSelectedDaysCalculator: function (since, to) {
      var datediff = Seed.Utility.Date.jsonToDateTime(to) - Seed.Utility.Date.jsonToDateTime(since);
      return Math.ceil(datediff / 86400000) + 1;
    }
  }
};