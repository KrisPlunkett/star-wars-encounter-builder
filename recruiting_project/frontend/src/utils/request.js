import csrf from './csrf';
import json from './json';
import object from './object';
import queryString from 'query-string';


/**
 * @method _onload
 * Handles a request when it loads.
 * Resolves or rejects the promise.
 * @param {Object} request - The request that loaded.
 * @param {String} method - The method used for the request.
 * @param {Function) resolve - The promise's resolve method.
 * @param {Function} reject - The promise's reject method.
 */
function _onload(request, method, resolve, reject) {
    if (request.status > 199 && request.status < 400) {
        let data = json.tryParse(request.responseText);
        // if the backend handler directs us to redirect, we'll do that here.
        if (data != null && object.isObject(data)) {
            if (data.redirect) {
                return location.href = data.redirect;
            }
        }
        resolve({
            data: data,
            request: request
        });
    } else {
        reject({
            error: new Error(method + ': Status Error ' + request.status),
            request: request
        });
    }
}

/**
 * @method _onerror
 * Handles a request when it loads.
 * Resolves or rejects the promise.
 * @param {Object} request - The request that loaded.
 * @param {String} method - The method used for the request.
 * @param {Function} reject - The promise's reject method.
 */
function _onerror(request, method, reject) {
    reject({
        error: new Error(method + ': Network Error'),
        request: request
    });
}


class Request {
    constructor() {
        this.httpRequest = new window.XMLHttpRequest();
        this.METHODS = {
            GET: 'GET',
            POST: 'POST',
            PUT: 'PUT',
            PATCH: 'PATCH',
            DELETE: 'DELETE'
        };
    }

    /**
     * @method get
     * Makes a GET request.
     * @param {String} url - The url for the request.
     * @param {Object} data - The data for the request.
     * @returns {Object} - A promise for the request.
     */
    get(url, data={}) {
        return this.request(url, this.METHODS.GET, data);
    }

    /**
     * @method post
     * Makes a POST request.
     * @param {String} url - The url for the request.
     * @param {Object} data - The data for the request.
     * @returns {Object} - A promise for the request.
     */
    post(url, data={}) {
        return this.request(url, this.METHODS.POST, data);
    }

    /**
     * @method post
     * Makes a PUT request.
     * @param {String} url - The url for the request.
     * @param {Object} data - The data for the request.
     * @returns {Object} - A promise for the request.
     */
    put(url, data={}) {
        return this.request(url, this.METHODS.PUT, data);
    }

    /**
     * @method post
     * Makes a DELETE request.
     * @param {String} url - The url for the request.
     * @param {Object} data - The data for the request.
     * @returns {Object} - A promise for the request.
     */
    delete(url, data={}) {
        return this.request(url, this.METHODS.DELETE, data);
    }

    /**
     * @method request
     * Creates and makes the actual request and returns a new promise
     * @param {String} url - The url for the request.
     * @param {String} method - The method to use for the request.
     * @param {Object} data - The data for the request.
     * @returns {Object} - A promise for the request.
     */
    request(url, method, data=null) {
        // Set the initial data
        data = data || {};

        // Setup our headers
        let headers = {};

        // Check if the data that was passed is a FormData instance
        let isFormData = (window.FormData && data instanceof window.FormData);

        // Parse the url into its parts
        let parsedUrl = queryString.parseUrl(url);
        let urlData = parsedUrl.query;

        // Ensure that we have a format in our url data
        urlData.format = urlData.format || 'json';

        // Update the main url to be our parsed url with no query params
        url = parsedUrl.url;

        // If this is a get request merge our url data with our passed data
        // The passed in data will take precedence
        if (method === this.METHODS.GET) {
            // Merge all the data
            data = Object.assign(
                {},
                urlData,
                data
            );

            // Update the url
            url = url + '?' + object.toQueryString(data);

        // If this is any other type of request
        // Add custom headers for all other request methods
        } else {
            // Add the django csrf token
            headers['X-CSRFToken'] = csrf.getToken();

            // Update the url with the proper query params
            url = url + '?' + object.toQueryString(urlData);

            // If this is a regular data object add a url encoded header
            // And update the data to be url encoded
            if (!isFormData) {
                headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
                data = object.toQueryString(data)
            }
        }

        // Setup the promise to make the request
        return new Promise((resolve, reject) => {
            // Create the request
            let request = this.httpRequest;

            // Create and open the url
            request.open(method, url, true);

            // Add the headers to the request
            for (let key in headers) {
                if (Object.prototype.hasOwnProperty.call(headers, key)) {
                    request.setRequestHeader(key, headers[key]);
                }
            }

            // Setup our promise callbacks
            request.onload = _onload.bind(request, request, method, resolve, reject);
            request.onerror = _onerror.bind(request, request, method, reject);

            // Send the request
            request.send(data);
        });
    }

    abort() {
        this.httpRequest.abort();
    }
}


let defaultExport = {
    METHODS: {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        PATCH: 'PATCH',
        DELETE: 'DELETE'
    },

    /**
     * @method get
     * Makes a GET request.
     * @param {String} url - The url for the request.
     * @param {Object} data - The data for the request.
     * @returns {Object} - A promise for the request.
     */
    get(url, data={}) {
        return (new Request()).get(url, data);
        // return this.request(url, this.METHODS.GET, data);
    },

    /**
     * @method post
     * Makes a POST request.
     * @param {String} url - The url for the request.
     * @param {Object} data - The data for the request.
     * @returns {Object} - A promise for the request.
     */
    post(url, data={}) {
        return (new Request()).post(url, data);
        // return this.request(url, this.METHODS.POST, data);
    },

    /**
     * @method post
     * Makes a PUT request.
     * @param {String} url - The url for the request.
     * @param {Object} data - The data for the request.
     * @returns {Object} - A promise for the request.
     */
    put(url, data={}) {
        return (new Request()).put(url, data);
        // return this.request(url, this.METHODS.PUT, data);
    },

    /**
     * @method post
     * Makes a DELETE request.
     * @param {String} url - The url for the request.
     * @param {Object} data - The data for the request.
     * @returns {Object} - A promise for the request.
     */
    delete(url, data={}) {
        return (new Request()).delete(url, data);
        // return this.request(url, this.METHODS.DELETE, data);
    },

    /**
     * @method request
     * Creates and makes the actual request and returns a new promise
     * @param {String} url - The url for the request.
     * @param {String} method - The method to use for the request.
     * @param {Object} data - The data for the request.
     * @returns {Object} - A promise for the request.
     */
    request(url, method, data=null) {
        return (new Request()).request(url, method, data);
    },

    Request: Request
};

export default defaultExport;
