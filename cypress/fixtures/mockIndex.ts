// Placed here so that mock data can be read while tests are in progress
export default class ApiMocks {
    public static ADMIN_DASHBOARD_MODELS = require("./adminDashboardModels.json");
    public static INPUT_QUEUE_STATS = require("./inputQueueStats.json");
    public static OUTPUT_QUEUE_STATS = require("./outputQueueStats.json");
    public static ADMIN_DASH_EXECUTION_STATS_MODEL_1 = require("./adminDashboardExecutionStatsModel1.json");
    public static ADMIN_DASH_EXECUTION_STATS_MODEL_2 = require("./adminDashboardExecutionStatsModel2.json");
    public static ADMIN_DASH_EXECUTION_STATS_MODEL_3 = require("./adminDashboardExecutionStatsModel3.json");
    public static ADMIN_DASH_EXECUTION_STATS_MODEL_4 = require("./adminDashboardExecutionStatsModel4.json");
    public static ADMIN_DASH_AGG_EXECUTION_STATS_DAY = require("./adminDashboardAggregatedExecutionStatsDay.json");
    public static ADMIN_DASH_AGG_EXECUTION_STATS_WEEK = require("./adminDashboardAggregatedExecutionStatsWeek.json");
    public static ADMIN_DASH_EXECUTION_RESULTS_MODEL_1 = require("./adminDashboardExecutionResultsModel1.json");
    public static ADMIN_DASH_EXECUTION_RESULTS_MODEL_2 = require("./adminDashboardExecutionResultsModel2.json");
    public static ADMIN_DASH_PIPELINES_MODEL_1 = require("./adminDashboardPipelinesModel1.json");
    public static CLINICAL_REVIEW = require("./clinicalReview.json");
    public static CLINICAL_REVIEW_RESPONSE = require("./clinicalReviewResponse.json");
    public static EXECUTION_LOGS = require("./executionLogs.json");
    public static OUTPUT_FILE = require("./outputFile.json");
    public static REMOTE_DICOM_METADATA = require("./remoteDicomMetadata");
}