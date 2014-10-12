from flask import Flask, render_template, jsonify
import requests
import os
import json

f = open('static/data/terms.json', 'r')
TERMS = json.loads(f.read())
f.close()

# Initialize the Flask application
app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/api/terms/', methods=['GET'])
def get_terms():
    return jsonify(**TERMS)

# Run the app
if __name__ == '__main__':
    app.debug = True
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port)
