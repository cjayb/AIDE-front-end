Feature("Clinical Review Page");

Before(async ({I, mocks, clinicalReviewPage}) => {
    await I.mockTheEndpoint(`**/executions?*`, mocks.clinicalReview, 200);
    I.amOnPage("#/clinical-review");
    clinicalReviewPage.IWaitForDicomViewerToLoad();
});

Scenario.skip(
    "I can view and filter the Work List",
    async ({ screenshotter, clinicalReviewPage }) => {
        await screenshotter.TakePageScreenshotAndCompare("clinicalReviewDefault");
        // await clinicalReviewPage.IViewAndFilterWorkList(); TODO: Re-enable this once filtering is working
    }
);
