lastTime = 0;
sslow = -2;
slow = -1;
same = 0;
fast = 1;
ffast = 2;

P = str2BigInt("340282366920938463463374607431768211507");
G = str2BigInt("18446744073709617151");
DELTA = 0.2;

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
        var stroke = int2BigInt(Math.round(strokes[i] * DELTA));
        result += bigInt2Str(powMod(G, stroke, P))  + "/"
    }
    return result;
}

//create user
$('#username').keydown(function(event) {
    recordTime();
    if (event.which == 13) {
        // enter button
        name = $('#username').val();
        $.ajax({
            type: "POST",
            url: baseURL + 'newuser/',
            data : {
                'name' : name,
                'hs' : get_hs(trials[tnum].strokes),
            },
            success : sendPwd
        });
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

// log in
$('#box').keydown(function(event) {
    recordTime();
    name = $('#box').val();
    if (event.which == 13) {
        name = $('#box').val();
        $.ajax({
            type : "POST",
            url  : baseURL + 'login/',
            data : {
                'name' : name,
                'hash' : calcVector(trials[tnum].strokes)
            },
            success : function(d){window.location.href = d}
        });
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
