import requests
from django.conf import settings


class SWAPI(object):
    """
    An interface to the Star Wars API
    """
    def __init__(self):
        self._initialize()

    def _initialize(self):
        self._rewind_starships_url()

    def _rewind_starships_url(self):
        # Initialize the url to the first page
        self.starships_url = '/'.join([settings.SWAPI_URL, 'starships'])

    def get_starships_by_page(self):
        """
        Returns a generator for each page of results from starships from the API
        """
        while True:
            results = self._get_starships_page()
            if results:
                yield results
            else:
                self._initialize()
                break

    def _get_starships_page(self):
        """
        Returns results for the current page of starships, updates the url to the next page
        """
        if self.starships_url is None:
            return

        # Get the results for the current page
        response = requests.get(self.starships_url).json()

        # Update the url to the next page
        self.starships_url = response.get('next')
        return response.get('results')
