var locomotive = require('locomotive'),
  async = require('async'),
  Controller = locomotive.Controller;

var help = require(process.cwd()+'/lib/' + 'help');
var HLTVstats = require(process.cwd()+'/app/models/' + 'HLTVstats');
var pagesController = new Controller();
var Matches = require(process.cwd()+'/app/models/' + 'matches');
var Bets = require(process.cwd()+'/app/models/' + 'bets');
var Users = require(process.cwd()+'/app/models/' + 'users');


pagesController.main = function() {
  this.title = 'Stat Track';
  
  var app = this;
  async.parallel(
    {
      unFinished  : Matches.returnUnfinished,
      finished    : Matches.returnFinished,
      bets        : Bets.returnSortedByMatch,
      users       : Users.return
    },
    function(err, results){
      app.users = err || results.users;
      app.html = err || results.html;
      app.unFinished = err || results.unFinished;
      app.finished = err || results.finished;
      app.bets = err || results.bets;
      app.ms = help.date('ms')+3600000;
      app.render();
    }
  );
}

pagesController.profile = function() {
  var app=this,req=app.req,res=app.res;
  var user = req.params.user || false;
  if(user){
    async.waterfall(
      [
        function(callback){
          Users.exists(user, function(err, count){
            !err && count ? callback(err) : callback('user does not exists');
          })
        },
        function(callback){
          Bets.returnByUser(user, function(err, bets){
            callback(err, bets);
          })
        },
        function(bets, callback){
          Matches.returnByList(Object.keys(bets), function(err, matches){
            callback(err, {bets : bets, matches : matches});
          })
        }
      ],
      function(err, results){
        if(err){res.send(err)}else {
          app.matches = err || results.matches;
          app.bets = err || results.bets;
          app.ms = help.date('ms')+7200000;
          app.render();
        }
      }
    );
  } else res.send('no profile found')
}



pagesController.stats = function(){
  var app=this,req=app.req,res=app.res;
  var games = JSON.parse(req.body.games);
  var user = req.body.user || false;
  var ip = help.getIp(req);
  var a = {msg : 'server can not save data', ok : false};
  
  console.log('just got some data');
  
  if(user){
    
    Users.returnByUser(user, function(err, userData){
      if(userData && ( (userData.ips && userData.ips.indexOf(ip)!=-1) || !userData.ips )){
        games.forEach(function(game) {
          
          game.user = user;
          if(game.t1 && game.t2){
            var win = game.win;
            async.parallel({
              
              bet : function(callback){
                Bets.returnById(game, function(err, bet){
                  console.log(bet);
                  if(bet && bet.win != win){
                    Bets.update(game, function(err){callback(err, {a : 'updated', d : bet})});
                  } else if(bet && bet.win == win) {
                    callback(err, {a : 'none', d : bet})
                  } else {
                    Bets.save(game, function(err, bet){callback(err, {a : 'new', d : bet})});
                  }
                });
              },
              
              match : function(callback){
                Matches.data(game.matchId, function(err, data){
                  callback(err, data);
                })
              }
              
            },function(err, results){
            });
          }
        });
        res.send({msg : 'bet saved', ok : true});
      } else res.send(a);
    })
    
  } else res.send(a);
  
}

pagesController.match = function(){
  var app=this,req=app.req,res=app.res;
  var id = req.params.id || false;
  if(id){
    Matches.getOneJson(id, function(err, data){
      data.matchId = id;
      Matches.save(data, function(){});
      res.send(data);
    })
  } else {
    Matches.getAllJson(function(err, data){
      var matches = {};
      for(var match in data){
        match = data[match];
        matches[match['matchId']] = match;
      }
      
      Matches.returnUnfinished(function(err, games){
        res.send({games : games, matches : matches});
      })
    })
  }
}

pagesController.hltv = function(){
  var app=this,req=app.req,res=app.res;
  var match, teams = [];
  var isQuery = Object.getOwnPropertyNames(req.query).length;
  var showTeams = req.query.teams && Array.isArray(req.query.teams) ? req.query.teams : [];
  app.query = showTeams;
  app.stats = [];
  HLTVstats.return(function(err, data){
    var allMatches = data[1].matches;
    for(var i in allMatches){
      match = allMatches[i];
      teams.indexOf(match.t1.trim())==-1 ? teams.push(match.t1.trim()) : false;
      teams.indexOf(match.t2.trim())==-1 ? teams.push(match.t2.trim()) : false;
      isQuery && showTeams.indexOf(match.t1.trim())!=-1 ? app.stats.push(match) 
        : showTeams.indexOf(match.t2.trim())!=-1 ? app.stats.push(match) :  false;
    }
    app.teams = teams.sort();
    !isQuery ? app.stats = data[1].matches : false;
    app.render();
  });
}

module.exports = pagesController;
