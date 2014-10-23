function timer(){
  console.log('test');
    var length = document.getElementsByClassName("time-left").length;
    
    var timeLeft=0;
    for(var i=0; i<length; i++){
        time = document.getElementsByClassName("time-left")[i].textContent;
        if(time != 'delayed')
            timeChanger(parseInt(time), i);
        timeLeft = 0;
    }
}

function timeChanger(t, i){
    t = t-1;
    var h = Math.floor(t / 3600);
    var m = Math.floor((t - (h * 3600)) / 60);
    var s = t - (h * 3600) - (m * 60);
    if (h   < 10) {h   = "0"+h;}
    if (m < 10) {m = "0"+m;}
    if (s < 10) {s = "0"+s;}
    document.getElementsByClassName("time-left")[i].innerHTML = h+":"+m+":"+s;
    if(t>0)
        setTimeout(function(){timeChanger(t, i)},1000);
    else{
        document.getElementsByClassName("time-left")[i].innerHTML = 'live';
    }
        
}