module.exports = {
    getPagesFromArguments(pages) {
        pages = pages || [];
        let applicationPageMap = {};
        for (let i = 0; i < pages.length; i++) {
            let pageParts = pages[i].split('__');
            let app = pageParts[0];
            let page = pageParts[1];

            // Make sure that the app key exists
            if (applicationPageMap[app] === undefined) {
                applicationPageMap[app] = [];
            }

            // Add the page to the app
            if (applicationPageMap[app].indexOf(page) === -1 && page !== undefined) {
                applicationPageMap[app].push(page);
            }
        }

        // Return the application page map
        return applicationPageMap;
    }
};

