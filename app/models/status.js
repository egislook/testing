var mongoose = require('mongoose');
var statusSchema = new mongoose.Schema({}, {strict : false});


var model = {
  //sets default mongoose model
  Status : mongoose.model('Status', statusSchema),
  
  returnStatus : function(callback){
    model.Status.find({}, function(err, data) {
      callback(err, data);
    });
  }
  
}


module.exports = model;