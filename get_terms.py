import os
import requests
import json
import datetime

# This script is used to update terms.json by pulling
# the top 1000 site-search terms from Google Analytics.
# It is run daily using the Heroku Scheduler and should
# be run manually after every deploy.

auth_url = 'https://accounts.google.com/o/oauth2/token'
parameters = {
    'refresh_token': str(os.environ.get('REFRESH_TOKEN')),
    'client_id': str(os.environ.get('CLIENT_ID')),
    'client_secret': str(os.environ.get('CLIENT_SECRET')),
    'grant_type': 'refresh_token'
}

# Use the refresh token to get a new access token
auth_response = requests.post(auth_url, data=parameters)
if auth_response.status_code is 200:
    access_token = json.loads(auth_response.content)['access_token']
else:
    raise Exception("Authentication request failed with status code {}".format(auth_response.status_code))

start_date = datetime.datetime.now() + datetime.timedelta(-7) # Once search is launched, change this to a 1 day difference
end_date = datetime.datetime.now()
ga_url = 'https://www.googleapis.com/analytics/v3/data/ga?' \
    'ids=ga%3A86300562&' \
    'dimensions=ga%3AsearchKeyword&' \
    'metrics=ga%3AsearchUniques&' \
    'sort=-ga%3AsearchUniques&' \
    'start-date={start_date}&end-date={end_date}'.format(
        start_date=start_date.strftime('%Y-%m-%d'), 
        end_date=end_date.strftime('%Y-%m-%d')
    )
header = {'Authorization': 'Bearer {}'.format(access_token)}

# Use the access token to get raw JSON from GA
ga_response = requests.get(ga_url, headers=header)
if ga_response.status_code is 200:
    raw_data = json.loads(ga_response.content)
    processed_data = {'1': []}

    # Process the JSON into the format the app expects
    for row in raw_data['rows']:
        # Pull out the search term, ignoring the count
        processed_data['1'].append(row[0])

    with open('static/data/terms.json', 'wb') as outfile:
        outfile.write(json.dumps(processed_data, indent=2))

    # Notify anyone who wants to know that the app's been updated with a Yo!
    yoall_url = 'https://api.justyo.co/yoall/'
    yoall_data = {
        'api_token': str(os.environ.get('YO_API_TOKEN')),
        'link': 'http://edx-search-terms.herokuapp.com/'
    }
    requests.post(yoall_url, data=yoall_data)
else:
    raise Exception("Data request failed with status code {}".format(ga_response.status_code))
