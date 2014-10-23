var locomotive = require('locomotive'),
  async = require('async'),
  Controller = locomotive.Controller;

var pagesController = new Controller();
var Matches = require(process.cwd()+'/app/models/' + 'matches');
var Bets = require(process.cwd()+'/app/models/' + 'bets');

var users = {
  'ofkys' : {
    name : 'Ofkys'
  }
}

pagesController.main = function() {
  this.title = 'Stat Track';
  
  var app = this;
  async.parallel(
    {
      matches : Matches.return,
      bets : Bets.return
    },
    function(err, results){
      app.html = err || results.html;
      app.matches = err || results.matches;
      app.bets = err || results.bets;
      app.render();
    }
  );
}

pagesController.stats = function(){
  var app=this,req=app.req,res=app.res;
  var games = JSON.parse(req.body.games);
  var user = req.body.user;
  var a = {msg : 'server can not save data', ok : false};
  
  if(user){
    games.forEach(function(game) {
      
      game.user = user;
      if(game.t1 && game.t2){
        var win = game.win;
        
        async.parallel({
          
          bet : function(callback){
            Bets.returnById(game, function(err, bet){
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
  
}

pagesController.match = function(){
  var app=this,req=app.req,res=app.res;
  var id = req.params.id || false;
  if(id){
    Matches.getOneJson(id, function(err, data){
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
        res.send(games);
      })
    })
  }
}

module.exports = pagesController;
