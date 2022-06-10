export default {
    /**
     * @method tryParse
     * Tries to parse the given data string.
     * @param {String} data - The data string to parse.
     * @returns {* | undefined} - The parsed data or undefined.
     */
    tryParse(data) {
        let result;

        try {
            result = JSON.parse(data);
        } catch (e) {
            //
        }

        return result;
    },

    /**
     * @method tryStringify
     * Tries to stringify the given data.
     * @param {String} data - The data to stringify.
     * @returns {* | undefined} - The stringified data or undefined.
     */
    tryStringify(data) {
        let result;

        try {
            result = JSON.stringify(data);
        } catch (e) {
            //
        }

        return result;
    }
};
