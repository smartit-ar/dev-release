ko.validation.rules["isLessThan"] = {
  validator: function (val, someOtherVal) {
    return val < someOtherVal;
  },
  message: "Debe seleccionar un valor menor al valor 'hasta' seleccionado.",
};

ko.validation.rules["isLessThanOrEqual"] = {
  validator: function (val, someOtherVal) {
    return val <= someOtherVal;
  },
  message: "Debe seleccionar un valor menor o igual al valor 'hasta' seleccionado.",
};

ko.validation.rules["isMoreThan"] = {
  validator: function (val, someOtherVal) {
    return val > someOtherVal;
  },
  message: "Debe seleccionar un valor mayor al valor 'desde' seleccionado.",
};

ko.validation.rules["isMoreThanOrEqual"] = {
  validator: function (val, someOtherVal) {
    return val >= someOtherVal;
  },
  message: "Debe seleccionar un valor mayor o igual al valor 'desde' seleccionado.",
};