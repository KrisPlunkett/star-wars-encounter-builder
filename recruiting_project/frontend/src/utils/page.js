
export default {

    /**
     * @method getEmbeddedData
     * Reads embedded JSON using the given selector.
     * @param {String} selector - The selector for getting the element.
     * @returns {Object} - The resulting data.
     */
    getEmbeddedData(selector) {
        let element = document.querySelector(selector);
        let data = {};

        if (element) {
            data = JSON.parse(element.value);
        }

        return data;
    },

    /**
     * @method getPageData
     * Caches and gets page data for the given selector.
     * @param {String} [selector='#page-data'] - The selector for getting page data.
     * @returns {Object}
     */
    getPageData(selector='#page-data') {
        if (!this._pageData) {
            this._pageData = this.getEmbeddedData(selector);
        }

        return this._pageData;
    }
};
