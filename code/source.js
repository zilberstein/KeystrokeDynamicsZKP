lastTime = 0;
sslow = -2;
slow = -1;
same = 0;
fast = 1;
ffast = 2;
data = []
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
<<<<<<< HEAD
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
    data.push(met)
    $('#vect tr td').last().append(met + '<br />');
=======
    if (lastTime === 0) {
        lastTime = t;
    }
    trials[tnum].strokes.push(t - lastTime);
    $('#data tr td').last().append(t - lastTime + '<br />');
>>>>>>> cc6bbc3181538f38a4916ec2f73a24135641c1e0
    lastTime = t;

}

function calcVector(form) {
    result = asc2hex(String(form.elements[0].value));
    console.log(data)
    for (var i in data){
        result += data[i];
    }
    data = []
    alert(result);
}

$('#box').keydown(recordTime);
//$('#box').keyup(recordTime);

$('#clear').click(function() {
<<<<<<< HEAD
    //$('#data tr').append('<td></td>');
    $('#vect tr').append('<td></td>');
=======
    trials[tnum].word = $('#box').val();
    $('#data tr').append('<td></td>');
>>>>>>> cc6bbc3181538f38a4916ec2f73a24135641c1e0
    $('#box').val('');
    lastTime = 0;
    $('#box').focus();
    trials.push({'word':'', 'strokes':[]});
    tnum++;
});
