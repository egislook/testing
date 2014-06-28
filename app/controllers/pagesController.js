var locomotive = require('locomotive')
  , Controller = locomotive.Controller;

var pagesController = new Controller();

pagesController.main = function() {
  this.title = 'Locomotive';
  this.render();
}

pagesController.blabla = function() {
  this.title = 'asdf';
  this.blabla = 'asdafbSCNDALINVLAf';
  this.render();
}

module.exports = pagesController;
