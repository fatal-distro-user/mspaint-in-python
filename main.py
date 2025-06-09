# myapp.py

from flask import Flask, render_template, request
import base64
import os
import re

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/save", methods=["POST"])
def save():
    data_url = request.form["image"]

    if not re.match(r'^data:image/png;base64,', data_url):
        return "Invalid image data", 400

    header, encoded = data_url.split(",", 1)
    data = base64.b64decode(encoded)

    path = os.path.join("static", "drawing.png")
    with open(path, "wb") as f:
        f.write(data)

    return "Saved"

# kein app.run() hier!
