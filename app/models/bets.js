var mongoose = require('mongoose');
var help = require(process.cwd() + '/lib/help.js');
var betSchema = new mongoose.Schema({}, {strict : false});


var model = {
  Bets : mongoose.model('Bets', betSchema),
  
  return : function(callback){
    model.Bets.find({}, function(err, data) {
      var temp = {};
      for(var i in data){
        temp[data[i].matchId] ? temp[data[i].matchId].push(data[i]) : temp[data[i].matchId] = [data[i]];
      }
      callback(err, temp);
    }).lean();
  },
  
  returnById : function(data, callback){
    model.Bets.findOne({matchId : data.matchId, user : data.user}, function(err, bet) {
      callback(err, bet);
    }).lean();
  },
  
  save : function(data, callback){
    
    var bet = {
      matchId : data.matchId || false,
      win : data.win,
      user : data.user,
      items : data.items,
      date : help.date('ms'),
      updated : help.date('ms'),
      pot : data.pot,
      value : data.value
    }
    model.Bets.update({matchId : bet.matchId, user : bet.user}, bet, {upsert : true}, function(err, data) {
      callback(err, bet);
    });
  },
  
  update : function(data, callback){
    var bet = { 
      win : data.win,
      updated : help.date('ms')
    }
    
    model.Bets.update({matchId : data.matchId, user : data.user}, {$set :bet}, {upsert : true}, function(err, data) {
      callback(err, data);
    });
  }
  
}


module.exports = model;