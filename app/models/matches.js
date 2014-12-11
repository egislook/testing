var mongoose = require('mongoose');
var cheerio = require('cheerio');
var request = require('request');
var help = require(process.cwd() + '/lib/help.js');
var matchSchema = new mongoose.Schema({}, {strict : false});


var model = {
  //sets default mongoose model
  Matches : mongoose.model('Matches', matchSchema),
  
  return : function(callback){
    model.Matches.find({finished : true}).lean().sort({finished : 1, startMs : -1}).exec(function(err, data) {
      callback(err, data);
    });
  },
  
  returnById : function(id, callback){
    model.Matches.findOne({matchId : id}, function(err, data) {
      callback(err, data);
    }).lean();
  },
  
  returnByList : function(list, callback){
    model.Matches.find({matchId : {$in : list}}).sort({date : -1, finished : 1}).lean().exec(function(err, data) {
      callback(err, data);
    });
  },
  
  returnUnfinished : function(callback){
    model.Matches.find({$or : [{"finished" : {$exists : false}}, {"finished" : false}]}).sort({startMs : 1}).lean().exec(function(err, data) {
      callback(err, data);
    });
  },
  
  returnFinished : function(callback){
    model.Matches.find({finished : true}).sort({date : -1, startMs : -1}).limit(20).lean().exec(function(err, data) {
      callback(err, data);
    });
  },
  
  finished : function(data, callback){
    data.updated = help.date('ms');
    model.Matches.update({matchId : data.matchId}, {$set : data}, {upsert : true}, function(err, data) {
      callback(err, data);
    });
  },
  
  save : function(data, callback){
    data.date = help.date();
    data.updated = help.date('ms');
    model.Matches.update({matchId : data.matchId}, data, {upsert : true}, function(err, data) {
      callback(err, data);
    });
  },
  
  update : function(data, callback){
    data.date = help.date();
    data.updated = help.date('ms');
    delete data.finished;
    model.Matches.update({matchId : data.matchId}, {$set : data}, {}, function(err, data) {
      callback(err, data);
    });
  },
  
  data : function(id, callback){
    model.returnById(id, function(err,data){
      if(!err && data){
        callback(err,{a :'none', d : data});
      }else{
        model.getOneJson(id, function(err,data){
          if(!err && data){
            data.matchId = id;
            model.save(data, function(){
              callback(err,{a :'new', d : data});
            })
          } else {
            callback(err);
          }
        });
      }
    });
  },
  
  getOneJson : function(id, callback){
    //id = '1685';
    var url = 'http://csgolounge.com/match?m='+id;
    var match = {};
    request(url,function(err,body){
      if(!err && body && body.statusCode == 200){
        var $ = cheerio.load(body.body);
        var cont = $('.box-shiny-alt').eq(0);
        var halfs = cont.find('.half');
        var teams = cont.find('.team');
        
        match = {
          left : halfs.eq(0).text(),
          games : halfs.eq(1).text(),
          start : halfs.eq(2).text(),
          t1 : {
            name : teams.eq(0).parent().find('b').text(),
            rate : teams.eq(0).parent().find('i').text(),
            img : teams.eq(0).css('background').replace("url('",'').replace("')",'').replace("\\",'')
          },
          t2 : {
            name : teams.eq(1).parent().find('b').text(),
            rate : teams.eq(1).parent().find('i').text(),
            img : teams.eq(1).css('background').replace("url('",'').replace("')",'').replace("\\",'')
          }
        }
       
        match.date = help.dateFromNow(match.left, 'standart');
        match.startMs = help.date('ms', match.date+' '+match.start.split(' ')[0]);
        
        match.startDate = help.date('full', match.startMs);
        
      }
      callback(err, match);
    })
  },
  
  getAllJson : function(callback){
    //id = '1685';
    var url = 'http://csgolounge.com/';
    var matches = [];
    var match;
    request(url,function(err,body){
      if(!err && body && body.statusCode == 200){
        var $ = cheerio.load(body.body);
        var games = $('.matchmain');
        
        games.each(function(){
          match = false;
          var time = false;
          var game = $(this);
          var href = game.find('a').attr('href');
          var type = href.indexOf('match') != -1 ? 'match' : false;
          if(type){
            
            match = {
              time : game.find('.whenm').eq(0).text(),
              matchId : game.find('a').attr('href').split('?m=')[1],
              finished : game.find('.notavailable').length ? true : false,
              t1 : {
                name : game.find('.teamtext').eq(0).find('b').text(),
                rate : game.find('.teamtext').eq(0).find('i').text(),
                img : game.find('.team').eq(0).css('background').replace("url('",'').replace("')",'').replace("\\",'')
              },
              t2 : {
                name : game.find('.teamtext').eq(1).find('b').text(),
                rate : game.find('.teamtext').eq(1).find('i').text(),
                img : game.find('.team').eq(1).css('background').replace("url('",'').replace("')",'').replace("\\",'')
              }
            }
            
            if(!match.aviable && game.find('img').length){
              match.winner = game.find('.team').eq(0).find('img').length ? 't1' : 't2';
            }
            
            time = match.time;
            if(match.time.indexOf('LIVE')!=-1){
              match.live = true;
            }
            match.time = parseInt(match.time) + ' ' + (time.indexOf('minute')!=-1 ? 'm' : time.indexOf('hour')!=-1 ? 'h' : 'd');
              
            }
          match ? matches.push(match) : false;
        })
      }
      callback(err, matches);
    })
  },
  
  getHLTVstatistic : function(offset,callback){
    var url = 'http://www.hltv.org/?pageid=188&gameid=2&offset='+offset;
    var matches = matches ? matches : [];
    var match = {};
    var t1,t2;
    var matchIndex = matchIndex ? matchIndex : 0;
    var dataIndex = 0;
      request(url,function(err,body){
        if(!err && body && body.statusCode == 200){
          var $ = cheerio.load(body.body);
          var matchData = $('.covSmallHeadline')
          var data;
          matchData.map(function(i){
            data = $(matchData[i].children).text();
            if(i > 5){
              switch(dataIndex){
                case 0:
                  match.date = data;
                  break;
                case 1:
                  t1=data;
                  match.t1 = data.substring(0,t1.indexOf('(')-1);
                  break;
                case 2:
                  t2=data;
                  match.t2 = data.substring(0,t2.indexOf('(')-1);
                  break;
                case 3:
                  match.map = data;
                  break;
                case 4:
                  match.event = data;
                  match.t1Score = parseInt(t1.substring(t1.indexOf('(')+1,t1.indexOf(')')));
                  match.t2Score = parseInt(t2.substring(t2.indexOf('(')+1,t2.indexOf(')')));
                  match.winner = match.t1Score > match.t2Score ? match.t1 : match.t2;
                  break;
              }
              if((i+5)%5 == 0){
                dataIndex = 0;
                matches[matchIndex++]=match;
              }else
                dataIndex++;
            }
          })
        }
        
        callback(err, matches);
      })
      
    //offset < 50 ? setTimeout(function(){model.getHLTVstatistic(offset+50,matches,matchIndex)}, 500) : false;
  },

}


module.exports = model;