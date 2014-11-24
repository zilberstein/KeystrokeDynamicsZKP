import sqlite3
from flask import Flask, render_template, request, g, redirect, url_for, \
             abort, flash, session
from contextlib import closing

app = Flask(__name__, static_folder='static', static_url_path='')
app.config.from_object('__init__')

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/newuser/", methods=['POST'])
def new_user():
    name = request.form['name']
    my_hash = request.form['hash']
    r = g.db.execute('INSERT INTO USERS (name, hash) \
                  VALUES (\'%s\', \'%s\')' % (name, my_hash))
    return str(r.fetchall())

@app.route("/login/<s>", methods=['GET'])
def login(s):
    error = None
    if request.method == 'GET':
        return url_for('success')
        if request.form['name'] != app.config['name']:
            error = 'Invalid username'
        else:
            session['logged_in'] = True
            flash('You were logged in')
        return url_for('success')
    return url_for('success')

@app.route("/success")
def success():
    return render_template('success.html')

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')
    return render_template('index.html')

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
