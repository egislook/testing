var mongoose = require('mongoose');
var help = require(process.cwd() + '/lib/help.js');
var userSchema = new mongoose.Schema({}, {strict : false});


var model = {
  Users : mongoose.model('Users', userSchema),
  
  return : function(callback){
    model.Users.find({}).sort().lean().exec(function(err, data) {
      data.sort(function(a, b){
        return(b.stats.balance - a.stats.balance);
      });
      
      callback(err,  help.arrToObj(data, 'user'));
    });
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
  },
  
  setStats : function(user, stats){
    model.Users.update({user : user}, {$set : {stats : stats}}, function(){});
  }
  
}


module.exports = model;