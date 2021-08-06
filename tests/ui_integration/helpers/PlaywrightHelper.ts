export = class PlaywrightHelper extends Helper {
    _before() {
        const { page } = this.helpers.Playwright;

        page._routes = [];
    }

    async mockTheEndpoint(endpoint: string, content?: string, status?: number) {
        const { page } = this.helpers.Playwright;

        await page.unroute(endpoint);

        await page.route(
            endpoint,
            (route: {
                fulfill: (arg0: {
                    body: string;
                    status: number;
                    headers: {
                        "content-type": string;
                        "Access-Control-Allow-Origin": string;
                    };
                }) => any;
            }) =>
                route.fulfill({
                    body: JSON.stringify(content),
                    status: status || 200,
                    headers: {
                        "content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }),
        );
    }

    getPageInfo(): Promise<string> {
        const { page } = this.helpers.Playwright;

        return page.url();
    }
};
