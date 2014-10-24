var Matches = require(process.cwd()+'/app/models/' + 'matches');
var Bets = require(process.cwd()+'/app/models/' + 'bets');
var Users = require(process.cwd()+'/app/models/' + 'users');
var help = require(process.cwd()+'/lib/' + 'help');

var repeat = function(interval, fn){
    setTimeout(function(){fn();repeat(interval,fn)}, interval);
}

var update = function(){
 Matches.returnUnfinished(function(err, games){
     console.log('checking unfinished games ' + games.length);
    if(games && games.length){
        Matches.getAllJson(function(err, data){
            var matches = help.arrToObj(data, 'matchId');
            
            for(var i in games){
                if(matches[games[i].matchId] && matches[games[i].matchId].finished){
                    var match = matches[games[i].matchId];
                    delete match.time;
                    console.log('upadet ' + games[i].matchId);
                    
                    Matches.finished(match, function(){});
                    Bets.finished(match, function(){});
                    statsUpdate();
                }
            }
        })
    }
 })
}

var statsUpdate = function(){
    Bets.return(function(err, bets){
        var stats = {}, bet;
        for(var i in bets){
            bet = bets[i];
            stats[bet.user] ? false : stats[bet.user] = {value : 0, win : 0, loss : 0, count : 0};
            if(bet.value){
                bet.winner ? stats[bet.user].count ++ : false;
                if(bet.winner && bet.winner!='none'){
                    bet.winner == bet.win ? stats[bet.user].win += Number(bet.pot) : stats[bet.user].loss += bet.value;
                }
                stats[bet.user].value += bet.value;
            }
        }
        
        for(var u in stats){
            Users.setStats(u, stats[u]);
        }
        
    });
}

module.exports = function() {
    update();
    statsUpdate();
  repeat(600000, update);
}

