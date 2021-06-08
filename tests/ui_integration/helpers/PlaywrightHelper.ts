export = class PlaywrightHelper extends Helper {
    _before() {
        const { page } = this.helpers.Playwright;

        page._routes = [];
    }

    async mockTheEndpoint(endpoint: string, content: string) {
        const { page } = this.helpers.Playwright;

        await page.unroute(endpoint);

        await page.route(
            endpoint,
            (route: {
                fulfill: (arg0: {
                    body: string;
                    headers: {
                        "content-type": string;
                        "access-control-allow-origin": string;
                    };
                }) => any;
            }) =>
                route.fulfill({
                    body: JSON.stringify(content),
                    headers: {
                        "content-type": "application/json",
                        "access-control-allow-origin": "*",
                    },
                }),
        );
    }

    getPageInfo() {
        const { page } = this.helpers.Playwright;

        return page.url();
    }
};
