

module.exports = function() {
  var dir = process.cwd() + '/app/models/';
  // Configure view-related settings.  Consult the Express API Reference for a
  // list of the available [settings](http://expressjs.com/api.html#app-settings).
  this.set('models', dir);
}
