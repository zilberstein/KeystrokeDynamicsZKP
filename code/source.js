lastTime = 0;
trials = [{'word':'', 'strokes':[]}];
tnum = 0;

baseURL = 'http://127.0.0.1:5000/';

function recordTime(event) {
    d = new Date();
    t = d.getTime();
    if (lastTime === 0) {
        lastTime = t;
    }
    trials[tnum].strokes.push(t - lastTime);
    $('#data tr td').last().append(t - lastTime + '<br />');
    lastTime = t;
    if (event.which == 13) {
        $.ajax(baseURL + $('#box').val(), {success : sendPwd});
        clearBox();
    }
}

function sendPwd(data) {
    alert(data);
}

$('#box').keydown(recordTime);
//$('#box').keyup(recordTime);

$('#clear').click(clearBox);

function clearBox() {
    trials[tnum].word = $('#box').val();
    $('#data tr').append('<td></td>');
    $('#box').val('');
    lastTime = 0;
    $('#box').focus();
    trials.push({'word':'', 'strokes':[]});
    tnum++;
}
