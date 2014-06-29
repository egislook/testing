var mongoose = require('mongoose');
var PuslapiaiSchema = new mongoose.Schema({}, {strict : false});


var model = {
  //sets default mongoose model
  Puslapiai : mongoose.model('Puslapiai', PuslapiaiSchema),
  
  returnPuslapiai : function(callback){
    model.Puslapiai.find({}, function(err, data) {
      callback(err, data);
    }).lean();
  }
  
}


module.exports = model;