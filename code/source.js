lastTime = 0;
sslow = -2;
slow = -1;
same = 0;
fast = 1;
ffast = 2;


function recordTime() {
    d = new Date();
    t = d.getTime();
    if (lastTime === 0) lastTime = t;
    diff = t - lastTime
    $('#data tr td').last().append(diff + '<br />');
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
    $('#vect tr td').last().append(met + '<br />');
    lastTime = t;

}

$('#box').keydown(recordTime);
$('#box').keyup(recordTime);

$('#clear').click(function() {
    $('#data tr').append('<td></td>');
    $('#vect tr').append('<td></td>');
    $('#box').val('');
    lastTime = 0;
    $('#box').focus();
});
