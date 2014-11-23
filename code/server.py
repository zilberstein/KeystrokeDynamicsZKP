from flask import Flask
app = Flask(__name__)

@app.route("/<s>")
def hello(s):
    return s

if __name__ == "__main__":
    app.run()
