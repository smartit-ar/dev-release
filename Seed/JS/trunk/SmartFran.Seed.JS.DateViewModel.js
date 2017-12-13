namespace('SmartFran.Seed.JS').DateViewModel = function (params) {
  var self = this;


  self.years = ko.observableArray([]);
  self.months = ko.observableArray([
    { Code: 0, Name: "Ene" },
    { Code: 1, Name: "Feb" },
    { Code: 2, Name: "Mar" },
    { Code: 3, Name: "Abr" },
    { Code: 4, Name: "May" },
    { Code: 5, Name: "Jun" },
    { Code: 6, Name: "Jul" },
    { Code: 7, Name: "Ago" },
    { Code: 8, Name: "Sep" },
    { Code: 9, Name: "Oct" },
    { Code: 10, Name: "Nov" },
    { Code: 11, Name: "Dic" }
  ]);
  self.days = ko.observableArray([]);

  self.selectedYear = ko.observable(params && params.date ? moment(params.date).year() : moment().year());
  self.selectedMonth = ko.observable(params && params.date ? moment(params.date).month() : moment().month());
  self.selectedDay = ko.observable(params && params.date ? moment(params.date).date() : moment().date());

  for (var i = 1900; i <= moment().year(); i++) {
    self.years.push(i);
  }

  setDaysInMonth(self.selectedYear(), self.selectedMonth());

  self.set = function (date) {
    self.selectedYear(moment(date).year());
    self.selectedMonth(moment(date).month());
    self.selectedDay(moment(date).date());
    setDaysInMonth(self.selectedYear(), self.selectedMonth());
  };

  self.FullDate = ko.computed(function () {
    return moment({ year: self.selectedYear(), month: self.selectedMonth(), day: self.selectedDay() })._d;
  },
    this);

  function setDaysInMonth(year, month) {
    var selectedDay = self.selectedDay();
    self.days.removeAll();
    var daysInMonth = moment(year.toString() + (month + 1).toString(), "YYYYMM").daysInMonth();
    for (var i = 1; i <= daysInMonth; i++) {
      self.days.push(i);
    }
    self.selectedDay(selectedDay);
  };

  self.selectedMonth.subscribe(function (value) {
    setDaysInMonth(self.selectedYear(), value);
  });

  self.selectedYear.subscribe(function (value) {
    setDaysInMonth(value, self.selectedMonth());
  });
};