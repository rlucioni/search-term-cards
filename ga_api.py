import os
import json
import datetime

import requests


YOALL_URL = 'https://api.justyo.co/yoall/'


class TokenRefreshError(Exception):
    """There was a problem refreshing the access token. """
    pass

class DataRequestError(Exception):
    """There was a problem with the request for new data. """
    pass


def refresh_token():
    """Refresh the GA access token.

    Sends a Yo! if something goes wrong.

    Returns:
        string: The fresh GA access token.

    Raises:
        TokenRefreshError

    """
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
        # Notify anyone who wants to know that we weren't able to refresh
        # the access token.
        yoall_data = {
            'api_token': str(os.environ.get('YO_API_TOKEN_TOKENREFRESHERROR'))
        }
        requests.post(YOALL_URL, data=yoall_data)

        raise TokenRefreshError(
            "Token refresh failed with status code {}".format(
                auth_response.status_code
            )
        )

    return access_token


def request_data(access_token):
    """Get top site-search terms from GA.

    Sends a Yo! if something goes wrong.

    Args:
        access_token (string): A fresh GA access token.

    Returns:
        dict: A dictionary containing an array of up to 10,000
            site-search terms, keyed by country code.

    Raises:
        DataRequestError

    """
    start_date = datetime.datetime.now() + datetime.timedelta(-int(os.environ.get('DAYS_BACK')))
    end_date = datetime.datetime.now()
    ga_url = 'https://www.googleapis.com/analytics/v3/data/ga?' \
        'ids=ga%3A86300562&' \
        'dimensions=ga%3AsearchKeyword&' \
        'metrics=ga%3AsearchUniques&' \
        'sort=-ga%3AsearchUniques&' \
        'start-date={start_date}&' \
        'end-date={end_date}&' \
        'max-results={max_results}'.format(
            start_date=start_date.strftime('%Y-%m-%d'), 
            end_date=end_date.strftime('%Y-%m-%d'),
            max_results=int(os.environ.get('MAX_RESULTS'))
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

        return processed_data
    else:
        # Notify anyone who wants to know that we weren't able to get
        # fresh data.
        yoall_data = {
            'api_token': str(os.environ.get('YO_API_TOKEN_DATAREQUESTERROR'))
        }
        requests.post(YOALL_URL, data=yoall_data)

        raise DataRequestError(
            "Data request failed with status code {}".format(
                ga_response.status_code
            )
        )
