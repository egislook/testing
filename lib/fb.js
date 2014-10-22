var request = require('request');
var querystring = require("querystring");
var async = require("async");

var fb = {
  
  opt : {
    clientId: '1476265532637675',
    clientSecret: '4d83678667694a08b9563804dddc38da',
    callbackUrl: "https://stattrack-c9-noneede.c9.io/auth/facebook/callback",
    //mainCallbackUrl: "http://www.buy365sell.com/auth/facebook/callback"
  },
  
  login : function(req,res,next){
    
    //var cb = req.get('host') == 'buy365sell-c9-evas60.c9.io' ? fb.opt.callbackUrl : fb.opt.mainCallbackUrl;
    var cb = fb.opt.callbackUrl;
    //email scope
    var code = req.query.code;
    var tokenUrl = 
    'https://graph.facebook.com/oauth/access_token' +
    '?client_id=' + fb.opt.clientId +
    '&redirect_uri=' + cb +
    '&client_secret=' + fb.opt.clientSecret +
    '&code=' +code;
    
    async.waterfall([
      
        function(callback){
          request(tokenUrl, function(err, body){
            var token = body.body ? querystring.parse(body.body).access_token : false;
            callback(null,  token);
          });
        },
        
        /*function(token, callback){
          var checkUrl =
          'https://graph.facebook.com/debug_token'+
          '?input_token='+token+
          '&access_token='+fb.opt.clientId+'|'+fb.opt.clientSecret;
          
          request(checkUrl, function(err, body){
            console.log();
            var fbId = body.body ? JSON.parse(body.body).data.user_id : false;
            console.log(fbId);
            callback(null, fbId, token);
          });
        },*/
        
        function(token , callback){
            var getInfoUrl =
            'https://graph.facebook.com/v2.0/me'+
            '?access_token='+token;
            request(getInfoUrl, function(err, body){
              callback(null, JSON.parse(body.body));
            });
        }
        
    ], function (err, profile) {
      profile.type = 'fb';
      req.profile = profile;
      next();
      
    });
  },
  
  redirect : function(req,res,next){
    var cb = fb.opt.callbackUrl;
    var url = 
    'https://www.facebook.com/dialog/oauth'+
    '?client_id='+fb.opt.clientId+
    '&redirect_uri='+cb+
    '&scope=email,publish_stream,manage_pages';
    res.redirect(url);
  },
  
}

module.exports = fb;