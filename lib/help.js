var help = {
  getIp : function(req){
    var ip = req.headers["x-forwarded-for"];
    if(ip){
        var list = ip.split(",");
        ip = list[list.length-1];
    } else {
        ip = req.connection.remoteAddress;
    }
    return ip;
  },
  
  date : function(type, date){
    date = date ? new Date(date) : new Date();
    type = type || 'standart';
    
    if(type == 'ms')
      date = date.getTime();
    
    if(type == 'standart' || type == 'full'){
      var dd = date.getDate();
      var mm = date.getMonth()+1;
      var yyyy = date.getFullYear();
      var h = date.getHours();
      var m = date.getMinutes();
      
      if(h<10){h='0'+h} if(m<10){m='0'+m} var time = h+':'+m;
      if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} date = yyyy+'-'+mm+'-'+dd;
      
      if(type == 'full')
         date = date +' '+ time;
    }
    
    return date;
  },
  
  ago : function(dateAdded){
    var currentTime = help.date('ms');
    var timeAgo = currentTime - dateAdded;
    console.log(timeAgo);
  },
  
  arrToObj : function(arr, key){
    var obj = {};
    for(var i in arr){
      obj[arr[i][key]]=arr[i];
    }
    return obj;
  },
  
  obj : {
    add : function(data, store){
      var temp, t, o, l;
      o = store;
      var keys = Object.keys(data);
      for(var k in keys){
        t = keys[k].split('.');
        l = t.length;
        temp = data[keys[k]];
        
        for(var i=0; i < l-1; i++) {
            var n = t[i];
            if (n in o) {
                o = o[n];
            } else {
                o[n] = {};
                o = o[n];
            }
        }
        o[t[l - 1]] = temp;
      }
      //return o;
      o=null;
    }
  }
}

module.exports= help;