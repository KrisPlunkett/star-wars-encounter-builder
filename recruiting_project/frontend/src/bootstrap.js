/* eslint-disable */
import page from 'utils/page';


class Bootstrap {
    constructor() {
        // Set the page data
        this.pageData = page.getPageData();
    }
}

// Initialize the system
(() => {
    new Bootstrap();
})();
