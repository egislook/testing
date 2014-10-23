var mongoose = require('mongoose');
var cheerio = require('cheerio');
var request = require('request');
var help = require(process.cwd() + '/lib/help.js');
var matchSchema = new mongoose.Schema({}, {strict : false});


var model = {
  //sets default mongoose model
  Matches : mongoose.model('Matches', matchSchema),
  
  return : function(callback){
    model.Matches.find({}).lean().sort({date : -1}).exec(function(err, data) {
      callback(err, data);
    });
  },
  
  returnById : function(id, callback){
    model.Matches.findOne({matchId : id}, function(err, data) {
      callback(err, data);
    }).lean();
  },
  
  save : function(data, callback){
    data.date = help.date();
    data.updated = help.date('ms');
    model.Matches.update({matchId : data.matchId}, data, {upsert : true}, function(err, data) {
      callback(err, data);
    });
  },
  
  data : function(id, callback){
    model.returnById(id, function(err,data){
      if(!err && data){
        callback(err,{a :'none', d : data});
      }else{
        model.getHtml(id, function(err,data){
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
  
  getHtml : function(id, callback){
    //id = '1685';
    var url = 'http://csgolounge.com/match?m='+id;
    var match = {};
    request(url,function(err,body){
      if(!err && body && body.statusCode == 200){
        var $ = cheerio.load(body.body);
        var cont = $('.gradient').eq(0);
        var halfs = cont.find('.half');
        var teams = cont.find('.team');
        
        match = {
          left : halfs.eq(0).text(),
          games : halfs.eq(1).text(),
          start : halfs.eq(2).text(),
          t1 : {
            name : teams.eq(0).parent().find('b').text(),
            rate : teams.eq(0).parent().find('i').text(),
            img : teams.eq(0).css('background').split("'")[1]
          },
          t2 : {
            name : teams.eq(1).parent().find('b').text(),
            rate : teams.eq(1).parent().find('i').text(),
            img : teams.eq(1).css('background').split("'")[1]
          }
        }
      }
      callback(err, match);
    })
  }
  
}


module.exports = model;