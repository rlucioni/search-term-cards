import os
import json

from flask import Flask, render_template, jsonify

import ga_api

# Initialize the Flask application
app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    """Render the index page.

    Returns:
        HttpResponse: 200 if the index page was sent successfully

    """
    return render_template('index.html')

@app.route('/api/terms/', methods=['GET'])
def get_terms():
    """Get new site-search terms from Google Analytics (GA)

    If requests to Google fail at any point, preventing us from
    getting fresh JSON, we use the canned JSON we have on hand.

    Returns:
        HttpResponse: 200 if the JSON was sent successfully

    """
    try:
        access_token = ga_api.refresh_token()
        try:
            terms = ga_api.request_data(access_token)
            return jsonify(**terms)
        except ga_api.DataRequestError:
            # In the event that we can't get a fresh data,
            # use the canned JSON we have on hand
            with open('static/data/terms.json', 'rb') as f:
                terms = json.loads(f.read())
            return jsonify(**terms)
    except ga_api.TokenRefreshError:
        # In the event that we can't get a fresh access token,
        # use the canned JSON we have on hand
        with open('static/data/terms.json', 'rb') as f:
            terms = json.loads(f.read())
        return jsonify(**terms)

# Run the app
if __name__ == '__main__':
    # app.debug = True
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
