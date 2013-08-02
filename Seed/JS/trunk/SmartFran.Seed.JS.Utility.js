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
    jsonToDateTime: function (date) {
      if (typeof date != "string") {
        return date;
      }
      return new Date(parseInt(date.substr(6)));
    },
    isJsonDateTime: function (date) {
      var regJsonDate = new RegExp(/Date\(([^)]+)\)/);
      return regJsonDate.exec(date) != null;
      //var regJsonDate = new RegExp(/^\/Date\((\d+)(?:-(\d+))?\)\/$/);
      //return regJsonDate.exec(date) != null;
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
    }
}
};