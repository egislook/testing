var mongoose = require("mongoose");

module.exports = function() {
  switch (this.env) {
    case 'development':
      mongoose.connect('mongodb://stat:stattrackstattrackstattrack@ds063889.mongolab.com:63889/stattrack');
      break;
    case 'production':
      mongoose.connect('mongodb://stat:stattrackstattrackstattrack@ds063889.mongolab.com:63889/stattrack');
      break;
  }
  
  /*
  //example how to initate model and load data while server is loading
  var Status = require(process.cwd()+'/app/models/' + 'status');
  
  Status.returnStatus(function(err, data){
    console.log(err || data);
  })*/
}