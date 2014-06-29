var mongoose = require('mongoose');
var kainosSchema = new mongoose.Schema({}, {strict : false});


var model = {
  //sets default mongoose model
  Kainos : mongoose.model('Kainos', kainosSchema),
  
  returnKainos : function(callback){
    model.Kainos.find({}, function(err, data) {
      callback(err, data);
    }).lean();
  }
  
}


module.exports = model;