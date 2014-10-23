var Matches = require(process.cwd()+'/app/models/' + 'matches');
var Bets = require(process.cwd()+'/app/models/' + 'bets');
var help = require(process.cwd()+'/lib/' + 'help');

var repeat = function(interval, fn){
    setTimeout(function(){fn();repeat(interval,fn)}, interval);
}

var update = function(){
 Matches.returnUnfinished(function(err, games){
    if(games && games.length){
        Matches.getAllJson(function(err, data){
            var matches = help.arrToObj(data, 'matchId');
            
            for(var i in games){
                if(matches[games[i].matchId] && matches[games[i].matchId].finished){
                    var match = matches[games[i].matchId];
                    delete match.time;
                    Matches.finished(match, function(){});
                    Bets.finished(match, function(){});
                }
            }
        })
    }
 })
}

module.exports = function() {
    
  repeat(3600000, function(){
      update();
  })
}

