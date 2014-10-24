var mongoose = require('mongoose');
var help = require(process.cwd() + '/lib/help.js');
var betSchema = new mongoose.Schema({}, {strict : false});


var model = {
  Bets : mongoose.model('Bets', betSchema),
  
  return : function(callback){
    model.Bets.find({}, function(err, data) {
      callback(err, data);
    }).lean();
  },
  
  returnSortedByMatch : function(callback){
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
  
  returnByUser : function(user, callback){
    model.Bets.find({user : user}, function(err, data) {
      var temp = {};
      for(var i in data){
        temp[data[i].matchId] ? temp[data[i].matchId].push(data[i]) : temp[data[i].matchId] = [data[i]];
      }
      callback(err, temp);
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
  
  finished : function(data, callback){
    var bet = { 
      winner : data.winner || 'none',
      updated : help.date('ms')
    }
    
    model.Bets.update({matchId : data.matchId}, {$set :bet}, {upsert : false}, function(err, data) {
      callback(err, data);
    });
  },
  
  update : function(data, callback){
    var bet = { 
      win : data.win,
      pot : data.pot,
      updated : help.date('ms')
    }
    
    model.Bets.update({matchId : data.matchId, user : data.user}, {$set :bet}, {upsert : true}, function(err, data) {
      callback(err, data);
    });
  }
  
}


module.exports = model;