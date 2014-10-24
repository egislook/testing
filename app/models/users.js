var mongoose = require('mongoose');
var help = require(process.cwd() + '/lib/help.js');
var userSchema = new mongoose.Schema({}, {strict : false});


var model = {
  Users : mongoose.model('Users', userSchema),
  
  return : function(callback){
    model.Users.find({}, function(err, data) {
      callback(err,  help.arrToObj(data, 'user'));
    }).lean();
  },
  
  returnByUser : function(user, callback){
    model.Users.findOne({user : user}, function(err, data){
      callback(err, data);
    }).lean();
  },
  
  exists : function(user, callback){
    model.Users.count({user : user}, function(err, count){
      callback(err, count);
    })
  }
  
}


module.exports = model;