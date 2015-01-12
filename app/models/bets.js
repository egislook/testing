var mongoose = require('mongoose');
var help = require(process.cwd() + '/lib/help.js');
var betSchema = new mongoose.Schema({}, {strict : false});


var model = {
  Bets : mongoose.model('Bets', betSchema),
  
  return : function(callback){
    model.Bets.find({}).sort({updated : 1}).lean().exec(function(err, data) {
      callback(err, data);
    });
  },
  
  returnSortedByMatch : function(callback){
    model.Bets.find({}, function(err, data) {
      var temp = {};
      for(var i in data){
        if(temp[data[i].matchId]){
          temp[data[i].matchId][data[i].win] 
            ? temp[data[i].matchId][data[i].win].push(data[i]) 
            : temp[data[i].matchId][data[i].win] = [data[i]]
        } else {
          temp[data[i].matchId] = {};
          temp[data[i].matchId][data[i].win] 
            ? temp[data[i].matchId][data[i].win].push(data[i]) 
            : temp[data[i].matchId][data[i].win] = [data[i]]
        }
        
      }
      callback(err, temp);
    }).lean();
  },
  
  returnByMatchId : function(matchId, callback){
    model.Bets.find({matchId : matchId}).lean().exec(function(err, bets){
      callback(err, bets);
    });
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
  
  finished : function(match, callback){
    //console.log(data);
    match.t1.cof = parseInt(match.t2.rate) / parseInt(match.t1.rate);
    match.t2.cof = parseInt(match.t1.rate) / parseInt(match.t2.rate);
    var data = { 
      winner : match.winner || 'none',
      updated : help.date('ms')
    }
    callback(false, false);
    
    model.returnByMatchId(match.matchId, function(err, bets){
      bets.forEach(function(bet){
        var betPot = (bet.value * match[bet.win].cof).toFixed(2);
        data.pot = betPot;
        model.Bets.update({matchId : match.matchId, user : bet.user}, {$set : data}, {upsert : false}, function(err, data) {});
      });
      callback(err, bets);
    })
    
    /*model.Bets.update({matchId : data.matchId}, {$set :bet}, {upsert : false, multi: true}, function(err, data) {
      callback(err, data);
    });*/
  },
  
  update : function(data, callback){
    var bet = { 
      win : data.win,
      pot : data.pot,
      value : data.value,
      items : data.items,
      updated : help.date('ms')
    }
    
    model.Bets.update({matchId : data.matchId, user : data.user}, {$set :bet}, {upsert : true}, function(err, data) {
      callback(err, data);
    });
  }
  
}


module.exports = model;