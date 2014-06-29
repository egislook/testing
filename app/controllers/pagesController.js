var locomotive = require('locomotive'),
  async = require('async'),
  Controller = locomotive.Controller;

var pagesController = new Controller();
var Status = require(process.cwd()+'/app/models/' + 'status');
var Kainos = require(process.cwd()+'/app/models/' + 'kainos');
var Puslapiai = require(process.cwd()+'/app/models/' + 'puslapiai');

pagesController.main = function() {
  this.title = 'Locomotive';
  
  //to secure callback
  /*var app = this;
  Status.returnStatus(function(err, status){
    Kainos.returnStatus(function(err, kainos){
      app.kainos = err || kainos;
      app.status = err || status;
      app.render();
    })
  })*/
  
  var app = this;
  async.series(
    {
      status : Status.returnStatus,
      kainos : Kainos.returnKainos,
      puslapiai : Puslapiai.returnPuslapiai
    },
    function(err, results){
      app.kainos = err || results.kainos;
      app.status = err || results.status;
      app.puslapiai = err || results.puslapiai;
      app.render();
    }
  );
  
  
}

pagesController.blabla = function() {
  this.title = 'asdf';
  this.blabla = 'asdafbSCNDALINVLAf';
  this.render();
}

module.exports = pagesController;
