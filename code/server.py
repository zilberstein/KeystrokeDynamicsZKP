from flask import Flask, render_template

app = Flask(__name__, static_folder='static', static_url_path='')

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/login/<s>")
def login(s):
    return s

@app.route("/new/<name>/<my_hash>")
def new_user(name, my_hash):
    return name + '/' + my_hash;


if __name__ == "__main__":
    app.run()
