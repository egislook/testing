var locomotive = require('locomotive')
  , Controller = locomotive.Controller;

var pagesController = new Controller();
var Status = require(process.cwd()+'/app/models/' + 'status');

pagesController.main = function() {
  this.title = 'Locomotive';
  
  //to secure callback
  var app = this;
  Status.returnStatus(function(err, status){
    app.status = err || status;
    app.render();
  })
  
}

pagesController.blabla = function() {
  this.title = 'asdf';
  this.blabla = 'asdafbSCNDALINVLAf';
  this.render();
}

module.exports = pagesController;
