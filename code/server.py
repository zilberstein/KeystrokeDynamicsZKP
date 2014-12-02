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
    print name
    print my_hash
    r = g.db.execute('''INSERT INTO USERS (name, hash) \
                  VALUES ('%s', '%s')''' % (name, my_hash))
    # not safe at all
    g.db.commit()
    # result = g.db.execute("SELECT * FROM USERS")
    return "Successfully created account."

@app.route("/login/<s>", methods=['GET'])
def login(s):
    error = None
    if request.method == 'GET':
        return url_for('success')
    if check_match(request.form['name'], request.form['has']):
            session['logged_in'] = True
            flash('You were logged in')
            return url_for('success')
        else:
            error = 'Invalid username'
    return url_for('index')

def check_match(guess, ans):

    return True

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
