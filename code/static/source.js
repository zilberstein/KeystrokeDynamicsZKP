lastTime = 0;
sslow = -2;
slow = -1;
same = 0;
fast = 1;
ffast = 2;
data = [];
trials = [{'word':'', 'strokes':[]}];
tnum = 0;

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
    if (event.which == 13) {
        // 'enter' was pressed
        $.ajax(baseURL + $('#box').val(), {success : sendPwd});
        clearBox();
    }
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

$('#username').keydown(function(event) {
    recordTime();
    if (event.which == 13) {
        name = $('#username').val();
        $.ajax(baseURL + 'login/' + calcVector(name), {success : sendPwd});
        clearBox();
    }
});

$('#box').keydown(function(event) {
    recordTime();
    if (event.which == 13) {
        name = $('#box').val();
        $.ajax(baseURL + 'login/' + calcVector(name), {success : sendPwd});
        clearBox();
    }
});

$('#clear').click(clearBox);

function clearBox() {
    $('#vect tr').append('<td></td>');
    trials[tnum].word = $('#box').val();
    $('#data tr').append('<td></td>');
    $('#box').val('');
    lastTime = 0;
    $('#box').focus();
    trials.push({'word':'', 'strokes':[]});
    tnum++;
    data=[];
}

$('#make_account').click(function() {
    $('#login').hide();
    $('#new_user').show();
    data = [];
    trials = [{'word':'', 'strokes':[]}];
});

$('#log_in').click(function() {
    $('#new_user').hide();
    $('#login').show();
    data = [];
    trials = [{'word':'', 'strokes':[]}];
});
