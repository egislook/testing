var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');
var help = require(process.cwd() + '/lib/help.js');
var HLTVstatsSchema = new mongoose.Schema({}, {strict : false});


var model = {
  HLTVstats : mongoose.model('HLTVstats', HLTVstatsSchema),
  
  return : function(callback){
    model.HLTVstats.find({}).sort({ id : -1 }).lean().exec(function(err, data) {
      callback(err,  data);
    });
  },
  
  setStats : function(match){
    model.HLTVstats.insert(match);
  },
  
  getHLTVstatistic : function(offset,matches,matchIndex){
    offset = offset ? offset : 0;
    var url = 'http://www.hltv.org/?pageid=188&gameid=2&offset='+offset;
    matches = matches ? matches : [];
    var match = {},date = {};
    var t1,t2;
    matchIndex = matchIndex ? matchIndex : 0;
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
                  date = {
                    day : parseInt(data.substring(0,t1.indexOf('/')-1)),
                    month : parseInt(data.substring(t1.indexOf('/')+1,t1.indexOf(' '))),
                    year : data.substring(6,8)
                  }
                  match.date = date;
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
                matches[matchIndex++] = match;
                match = {};
                date = {};
              }else
                dataIndex++;
            }
          })
        }
        console.log(offset);
        offset < 5000 ? setTimeout(function(){model.getHLTVstatistic(offset+50,matches,matchIndex)}, 500) : model.HLTVstats.update({type : 'list'},{ matches : matches},{upsert : true}, function(){});;
      });
      
  }
  
}

module.exports = model;