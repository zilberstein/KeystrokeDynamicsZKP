import sqlite3
from flask import Flask, render_template, request, g, redirect, url_for, \
             abort, render_template, flash
from contextlib import closing

app = Flask(__name__, static_folder='static', static_url_path='')
app.config.from_object('__init__')

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/newuser/", methods=['POST'])
def new_user(name, my_hash):
    return name + '/'   + my_hash

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
    return sqlite4.connect(app.config['DATABASE'])

if __name__ == "__main__":
    app.run(debug=True)
