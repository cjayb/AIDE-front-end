const Helper = require('@codeceptjs/helper');

class PlaywrightHelper extends Helper {
    _before() {
        const { page } = this.helpers.Playwright;

        page._routes = [];
    }

    async mockTheEndpoint(endpoint, content) {
        const { page } = this.helpers.Playwright;

        await page.unroute(endpoint);

        await page.route(endpoint, route =>
            route.fulfill({
                body: JSON.stringify(content),
                headers: { "content-type": "application/json", "access-control-allow-origin": "*" }
            })
        );
    }

    getPageInfo() {
        const { page } = this.helpers.Playwright;

        return page.url();
    }
}

module.exports = PlaywrightHelper;
