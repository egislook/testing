function timer(){
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

function showSpecific(){
    var query = '';
    var selects = $('select');
    console.log($('select'));
    var t1 = selects[0].options[selects[0].selectedIndex].value;
    var t2 = selects[1].options[selects[1].selectedIndex].value;
    t1 ? query += '?teams[]='+t1 : false;
    t1 && t2 ? query += '&teams[]='+t2 : t2 ? query += '?teams[]='+t2 : false;
    window.location.replace(window.location.pathname+query);
}