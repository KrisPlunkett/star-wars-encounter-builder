import queryString from 'query-string';

export default {
    /**
     * @method merge
     * Merges all arguments into a new object.
     *
     * merge({
     *     'category': 'Animals',
     *     'animals': { 'dog': 1, 'cat': 2 }
     * },
     * {
     *     'type': 'Good',
     *     'animals': { 'fish': 3, 'Parastratiosphecomyia stratiosphecomyioides': 4  }
     * }) =
     * {
     *     'category': 'Animals',
     *     'animals': { 'fish': 3, 'Parastratiosphecomyia stratiosphecomyioides': 4  }
     *     'type': 'Good',
     * }
     *
     */
    merge(...args) {
        return Object.assign({}, ...args);
    },

    /**
     *
     * Explicitly merges nested objects of the leading Object's properties
     * @param args Array of Objects to merge
     * @returns merged Object
     *
     * extend(
     *     'category': 'Animals',
     *     'animals': { 'dog': 1, 'cat': 2 }
     * },
     * {
     *     'type': 'Good',
     *     'animals': { 'fish': 3, 'Parastratiosphecomyia stratiosphecomyioides': 4  }
     * }) =
     * {
     *     'category': 'Animals',
     *     'animals': {
     *          'dog': 1,
     *          'cat': 2,
     *          'fish': 3,
     *          'Parastratiosphecomyia stratiosphecomyioides': 4
     *     }
     *     'type': 'Good',
     * }
     */

    /**
     * Merge two or more objects together.
     * https://vanillajstoolkit.com/helpers/extend/
     * @param   {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
     * @param   {Object}   objects  The objects to merge together
     * @returns {Object}            Merged values of defaults and options
     */
    extend(...args) {
        let cls = this;

        let extended = {};
        let deep = true;
        let i = 0;

        // Merge the object into the extended object
        let merge = function(obj) {
            for (let prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    // If property is an object, merge properties
                    if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                        extended[prop] = cls.extend(extended[prop], obj[prop]);
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        // Loop through each object and conduct a merge
        for (; i < args.length; i++) {
            merge(args[i]);
        }

        return extended;
    },

    /**
     * @method fromQueryString
     * Creates an object given a query string.
     * @param {Object} str - The string for which to create an object.
     * @returns {String}
     */
    fromQueryString(str='') {
        return queryString.parse(str);
    },

    /**
     * @method toQueryString
     * Creates a query string given an object.
     * @param {Object} data - The data for which to create a query string.
     * @returns {String}
     */
    toQueryString(data) {
        // Copy our data so we can filter it
        let filteredData = Object.assign({}, data);

        // Remove nulls
        Object.keys(filteredData).forEach(
            (key) => (filteredData[key] === null || filteredData[key] === undefined) && delete filteredData[key]
        );

        // Stringify
        return queryString.stringify(filteredData);
    },

    /**
     * Detect if the passed argument is an object
     * @param obj
     * @returns {boolean}
     */
    isObject(obj) {
        return typeof obj === 'object';
    },

    /**
     * Determine if the passed object is empty
     * @param obj
     * @returns {boolean}
     */
    isEmpty(obj) {
        return this.isObject(obj) && Object.keys(obj).length === 0;
    },

    /* eslint-disable complexity */
    deepEqual(x, y) {
        'use strict';
        if (x === null || x === undefined || y === null || y === undefined) {
            return x === y;
        }

        // after this just checking type of one would be enough
        if (x.constructor !== y.constructor) {
            return false;
        }

        // if they are functions, they should exactly refer to same one (because of closures)
        if (x instanceof Function) {
            return x === y;
        }

        // if they are regexps, they should exactly refer to same one
        // (it is hard to better equality check on current ES)
        if (x instanceof RegExp) {
            return x === y;
        }

        if (x === y || x.valueOf() === y.valueOf()) {
            return true;
        }
        if (Array.isArray(x) && x.length !== y.length) {
            return false;
        }

        // if they are dates, they must had equal valueOf
        if (x instanceof Date) {
            return false;
        }

        // if they are strictly equal, they both need to be object at least
        if (!(x instanceof Object)) {
            return false;
        }
        if (!(y instanceof Object)) {
            return false;
        }

        // recursive object equality check
        let p = Object.keys(x);
        return Object.keys(y).every((i) => {
            return p.indexOf(i) !== -1;
        }) && p.every((i) => {
            return this.deepEqual(x[i], y[i]);
        });
    },
    /* eslint-enable complexity */

    /**
     * Remove empty keys from an object
     * @param obj
     */
    removeEmptyKeys(obj) {
        // Remove the empty keys
        Object.keys(obj).filter(
            key => obj[key] === undefined || obj[key] === null
        ).forEach(emptyKey => delete obj[emptyKey]);

        // Return the object
        return obj;
    }
};
