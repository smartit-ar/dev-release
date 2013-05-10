(namespace('SmartFran.Seed.JS.ko').Extend = function() {
  ko.observableArray.fn.subscribeArrayChanged = function (addCallback, deleteCallback) {
    var previousValue = undefined;
    this.subscribe(function (prev) {
      previousValue = prev.slice(0);
    }, undefined, 'beforeChange');
    this.subscribe(function (latestValue) {
      var editScript = ko.utils.compareArrays(previousValue, latestValue);
      for (var i = 0, j = editScript.length; i < j; i++) {
        switch (editScript[i].status) {
          case "retained":
            break;
          case "deleted":
            if (deleteCallback)
              deleteCallback(editScript[i].value);
            break;
          case "added":
            if (addCallback)
              addCallback(editScript[i].value);
            break;
        }
      }
      previousValue = undefined;
    });
  };
})();