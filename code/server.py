import sqlite3
from flask import Flask, render_template, request, g, redirect, url_for, \
             abort, flash, session
from contextlib import closing
from math import sqrt, frexp
from decimal import Decimal

app = Flask(__name__, static_folder='static', static_url_path='')
app.config.from_object('__init__')

G = 16
P = 340282366920938463463374607431768211507

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/newuser/", methods=['POST'])
def new_user():
    name = request.form['name']
    my_hash = request.form['hash']
    r = g.db.execute('''INSERT INTO USERS (name, hash) \
                  VALUES ('%s', '%s')''' % (name, my_hash))
    # not safe at all
    g.db.commit()
    # result = g.db.execute("SELECT * FROM USERS")
    return "Successfully created account."

@app.route("/login/", methods=['POST'])
def login():
    error = None
    if request.method == 'POST':
        r = g.db.execute('SELECT hash FROM USERS WHERE name = \"' + request.form['name'] + '\"')
        #print r.fetchone()
        '''
        refer to slides:
        a = g^r
        b in Z_r chosen by server
        c = r+ f(V) + b
        '''
        a = request.form['a']
        b = request.form['b']
        c = request.form['c']
        l = len(request.form['name'])
        if check_match(Decimal(a), Decimal(b), c, l, r.fetchone()[0]):
            session['logged_in'] = True
            flash('You were logged in')
            return url_for('success')
        else:
            error = 'Invalid username'
    return url_for('index')

def converttoString(s):
    result = '/'
    for i in s:
        result += str(i)+'/'
    return result

# ZK authentication match
def check_match(a, b, c, l, ans):
    total = 0
    s = c.split('/')[1:-1]
    t = ans.split('/')[1:-1]
    for n1, n2 in zip(s,t):
        #print pow(G,Decimal(n1))
        #print a*pow(Decimal(n2),b)
        total = abs(pow(G,Decimal(n1)) - a*pow(Decimal(n2),b))
    # total = sqrt(total / len(s))
    m,e = frexp(total)
    with open('trials', 'a') as f:
        f.write(str(l)+'\t'+str(e/l)+'\n')
    print e/l
    if e != 0 and e/l < 40:
        return True
    return False

@app.route("/success")
def success():
    return render_template('success.html')

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')
    return redirect(url_for('index'))

# initializes DB
def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

@app.before_request
def before_request():
    g.db = connect_db()

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

def connect_db():
    return sqlite3.connect(app.config['DATABASE'])

@app.route('/entries')
def show_entries():
    cur = g.db.execute('SELECT * FROM USERS')
    entries = [dict(title=row[0], text=row[1]) for row in cur.fetchall()]
    return str(entries)



if __name__ == "__main__":
    app.run(debug=True)
