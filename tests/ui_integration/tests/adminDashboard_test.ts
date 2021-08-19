
Feature("Admin Dashboard Page");

Before(async ({I, mocks }) => {
    await I.mockTheEndpoint("**/models", mocks.adminDashboardModels, 200);
    await I.mockTheEndpoint("**/queues/input", mocks.inputQueueStats, 200);
    await I.mockTheEndpoint("**/queues/output", mocks.outputQueueStats, 200);
    await I.mockTheEndpoint("**/execution_stats?days=1", mocks.adminDashboardAggregatedExecutionStatsDay, 200);
    await I.mockTheEndpoint("**/execution_stats?days=7", mocks.adminDashboardAggregatedExecutionStatsWeek, 200);
    await I.mockTheEndpoint(`**/execution_stats?days=1000&model_id=${mocks.adminDashboardModels[0]["model_name"]}-1.0.0`, mocks.adminDashboardExecutionStatsModel1, 200);
    await I.mockTheEndpoint(`**/execution_stats?days=1000&model_id=${mocks.adminDashboardModels[1]["model_name"]}-1.0.0`, mocks.adminDashboardExecutionStatsModel2, 200);
    await I.mockTheEndpoint(`**/execution_stats?days=1000&model_id=${mocks.adminDashboardModels[2]["model_name"]}-1.0.0`, mocks.adminDashboardExecutionStatsModel3, 200);
    await I.mockTheEndpoint(`**/execution_stats?days=1000&model_id=${mocks.adminDashboardModels[3]["model_name"]}-1.0.0`, mocks.adminDashboardExecutionStatsModel4, 200);
    await I.mockTheEndpoint(`**/execution_stats?days=7*`, mocks.adminDashboardExecutionStatsModel4, 200);
    await I.mockTheEndpoint(`**/execution_stats?days=30*`, mocks.adminDashboardExecutionStatsModel3, 200);
    await I.mockTheEndpoint(`**/executions?*`, mocks.adminDashboardExecutionResultsModel1, 200);
    await I.mockTheEndpoint(`**/pipeline/*`, mocks.adminDashboardPipelinesModel1, 200);

    I.amOnPage('/#/admin-dashboard')
});

Scenario.skip(
    "On the admin page I can sort, free text search and change model view",
    async ({adminDashboardPage}) => {
        // await adminDashboardPage.ITestWeeklyAndMonthlyView(); // This feature has been temporarily disabled in the app, this test should work once the feature has been enabled
        await adminDashboardPage.ITestFreetextSearch();
        await adminDashboardPage.ITestSorts();
    }
);

Scenario.skip(
    "On the admin page I can view a specific model's details",
    async ({screenshotter, adminDashboardPage}) => {
        await screenshotter.TakePageScreenshotAndCompare("adminDashboardDefault");
        await adminDashboardPage.ITestPagination();
        await adminDashboardPage.ITestViewingModels();
    }
);

/* These features have been temporarily disabled in the app, the tests should work once the features have been enabled
Scenario(
    "On the admin page I can view the execution log",
    async ({adminDashboardPage}) => {
        await adminDashboardPage.ITestViewExecutionLog();
    }
);

Scenario(
    "On the admin page I can view a model output",
    async ({adminDashboardPage}) => {
        await adminDashboardPage.ITestViewModelOutput();
    }
);
*/

Scenario.skip(
    "On the admin page I can view the execution pipeline",
    async ({adminDashboardPage}) => {
        await adminDashboardPage.ITestViewExecutionPipeline();
    }
).tag('test');
