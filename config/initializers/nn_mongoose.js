var mongoose = require("mongoose");

module.exports = function() {
  switch (this.env) {
    case 'development':
      mongoose.connect('mongodb://admin:mkalns@ds053139.mongolab.com:53139/mkalns');
      break;
    case 'production':
      mongoose.connect('mongodb://admin:mkalns@ds053139.mongolab.com:53139/mkalns');
      break;
  }
  
  /*
  //example how to initate model and load data while server is loading
  var Status = require(process.cwd()+'/app/models/' + 'status');
  
  Status.returnStatus(function(err, data){
    console.log(err || data);
  })*/
}