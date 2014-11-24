lastTime = 0;
sslow = -2;
slow = -1;
same = 0;
fast = 1;
ffast = 2;

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

function calcVector(name) {
    result = asc2hex(String(name));
    console.log(data)
    for (var i in data){
        result += data[i];
    }
    data = [];
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
                'hash' : calcVector(name),
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
    if (event.which == 13) {
        name = $('#box').val();
        //$.ajax(baseURL + 'login/' + calcVector(name), {success : sendPwd});
        //ajax breaks everything, cant be redirected or auth
        window.location.href = (httpGet(baseURL + 'login/' + calcVector(name)))
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
