from flask import Flask
app = Flask(__name__)

@app.route("/login/<s>")
def login(s):
    return s

@app.route("/new/<name>/<my_hash>")
def new_user(name, my_hash):
    return name + '/' + my_hash;


if __name__ == "__main__":
    app.run()
