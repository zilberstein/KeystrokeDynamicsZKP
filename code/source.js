lastTime = 0;
sslow = -2;
slow = -1;
same = 0;
fast = 1;
ffast = 2;
data = [];
trials = [{'word':'', 'strokes':[]}];
tnum = 0;

function asc2hex(pStr) {
        tempstr = '';
        for (a = 0; a < pStr.length; a = a + 1) {
            tempstr = tempstr + pStr.charCodeAt(a).toString(16);
        }
        return tempstr;
    }

function recordTime() {
    d = new Date();
    t = d.getTime();
    if (lastTime === 0) {
        lastTime = t;
    }
    trials[tnum].strokes.push(t - lastTime);
    $('#data tr td').last().append(t - lastTime + '<br />');
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
    $('#vect tr td').last().append(met + '<br />');
    lastTime = t;

}

function calcVector(form) {
    result = asc2hex(String(form.elements[0].value));
    console.log(data)
    for (var i in data){
        result += data[i];
    }
    data = [];
    alert(result);
}

$('#box').keydown(recordTime);
//$('#box').keyup(recordTime);

$('#clear').click(function() {
    $('#vect tr').append('<td></td>');
    trials[tnum].word = $('#box').val();
    $('#data tr').append('<td></td>');
    $('#box').val('');
    lastTime = 0;
    $('#box').focus();
    trials.push({'word':'', 'strokes':[]});
    tnum++;
    data=[];
});
