namespace('SmartFran.Seed.JS').Utility = {
  Date: {
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
    isJsonDateTime: function(date) {
      var regJsonDate = new RegExp(/^\/Date\((\d+)(?:-(\d+))?\)\/$/);
      return regJsonDate.exec(date) != null;
    }
 }
};