lastTime = 0;

function recordTime() {
    d = new Date();
    t = d.getTime();
    if (lastTime === 0) lastTime = t;
    $('#data tr td').last().append(t - lastTime + '<br />');
    lastTime = t;
}

$('#box').keydown(recordTime);
$('#box').keyup(recordTime);

$('#clear').click(function() {
    $('#data tr').append('<td></td>');
    $('#box').val('');
    lastTime = 0;
    $('#box').focus();
});
