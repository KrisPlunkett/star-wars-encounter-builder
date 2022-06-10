import React from 'react';
export default {

    /**
     * @method getToken
     * Caches and gets the csrf token embedded in the page.
     * @returns {String} - The csrf token.
     */
    getToken() {
        let input;

        if (!this._csrfToken) {
            input = document.querySelector('input[name="csrfmiddlewaretoken"]');
            this._csrfToken = input ? input.value : '';
        }

        return this._csrfToken;
    },

    /**
     * @method getInput
     * Gets a hidden input containing a csrf token for form submission.
     * @returns {Object} - The input component.
     */
    getInput() {
        return (<input name="csrfmiddlewaretoken" type="hidden" value={this.getToken()} />);
    }

};
