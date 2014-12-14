var lastTime = 0;
var sslow = -2;
var slow = -1;
var same = 0;
var fast = 1;
var ffast = 2;

var P = str2bigInt("340282366920938463463374607431768211507", 10);
//var G = str2bigInt("18446744073709617151",10);
var G = 16;
var DELTA = 0.05;

function init_data() {
    data = [];
    trials = [{'word':'', 'strokes':[]}];
    tnum = 0;
}

init_data();

baseURL = 'http://127.0.0.1:5000/';

function asc2hex(pStr) {
    tempstr = '';
    for (a = 0; a < pStr.length; a = a + 1) {
        tempstr = tempstr + pStr.charCodeAt(a).toString(16);
    }
    return tempstr;
}

function recordTime(event) {
    d = new Date();
    t = d.getTime();
    if (lastTime === 0) {
        lastTime = t;
    }
    diff = t - lastTime
    trials[tnum].strokes.push(diff);
    if (diff > 100.0){
        met = ffast;
    } else if (diff > 50){
        met = fast;
    } else if (diff > -50){
        met = same;
    } else if (diff > -100){
        met = slow;
    } else {
        met = sslow;
    }
    data.push(met)
    lastTime = t;
}

function sendPwd(data) {
    alert(data);
}

function calcVector(strokes) {
    var result = "/";
    for (i = 0; i < strokes.length; i++) {
        result += strokes[i].toString() + '/';
    }
    console.log(result);
    return result;
}

function get_hs(strokes) {
    var result = "/";
    for (var i = 0; i < strokes.length; i++) {
        var stroke = Math.round(strokes[i] * DELTA);
        //var strokeBI = str2bigInt(stroke.toString(),10);
        //result += bigInt2str(Math.pow(G, strokeBI),10)  + "/";
        result += Math.pow(G, stroke).toString()  + "/";
    }
    return result;
}

//create user
$('#username').keydown(function(event) {
    recordTime();
    if (event.which == 13) {
        // enter button
        name = $('#username').val();
        var req = {
            type: "POST",
            url: baseURL + 'newuser/',
            data : {
                'name' : name,
                'hash' : get_hs(trials[tnum].strokes),
            },
            success : sendPwd
        };
        console.log(req);
        $.ajax(req);
        clearBox($('#username'));
    }
});

function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function bigRandom(bits) {
    var result = "";
    var a = Math.pow(2, 32);
    for (var i = 0; i < bits / 32; i++) {
        var r = Math.ceil(a * Math.random());
        result += r.toString();
    }
    //return str2bigInt(result,10);
    return result.toString()
}

function get_zkp(strokes, r, b) {
    var result = "/";
    for (var i = 0; i < strokes.length; i++) {
        var stroke = Math.round(strokes[i] * DELTA);
        //var strokeBI = str2bigInt(stroke.toString(),10);
        //var val = add(r, mult(strokeBI, b));
        var val = r + stroke * b;
        //result += bigInt2str(val,10) + '/';
        result += val.toString()+'/';
    }
    return result;
}

// log in
$('#box').keydown(function(event) {
    recordTime();
    name = $('#box').val();
    if (event.which == 13) {
        name = $('#box').val();
        //var r = bigRandom(128);
        //var b = bigRandom(128);
        var r = 4;
        var b = 10;
        var req = {
            type : "POST",
            url  : baseURL + 'login/',
            data : {
                'name' : name,
                //'a' : bigInt2str(Math.pow(G, r), 10),
                'a' : Math.pow(G, r).toString(),
                'b' : b.toString(),
                'c' : get_zkp(trials[tnum].strokes,r,b)
            },
            success : function(d){window.location.href = d}
        };
        console.log(req);
        $.ajax(req);
        clearBox($('#box'));
    }
});

$('#clear').click(clearBox);

function clearBox(box) {
    trials[tnum].word = box.val();
    box.val('');
    lastTime = 0;
    box.focus();
    trials.push({'word':'', 'strokes':[]});
    tnum++;
    data=[];
}

$('#make_account').click(function() {
    $('#login').hide();
    $('#new_user').show();
    init_data();
});

$('#log_in').click(function() {
    $('#new_user').hide();
    $('#login').show();
    init_data();
});
