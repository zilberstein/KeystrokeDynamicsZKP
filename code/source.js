lastTime = 0;
trials = [{'word':'', 'strokes':[]}];
tnum = 0;

function recordTime() {
    d = new Date();
    t = d.getTime();
    if (lastTime === 0) {
        lastTime = t;
    }
    trials[tnum].strokes.push(t - lastTime);
    $('#data tr td').last().append(t - lastTime + '<br />');
    lastTime = t;
}

$('#box').keydown(recordTime);
//$('#box').keyup(recordTime);

$('#clear').click(function() {
    trials[tnum].word = $('#box').val();
    $('#data tr').append('<td></td>');
    $('#box').val('');
    lastTime = 0;
    $('#box').focus();
    trials.push({'word':'', 'strokes':[]});
    tnum++;
});
