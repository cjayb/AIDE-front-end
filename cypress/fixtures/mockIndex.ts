
export default class ApiMocks {
    //New Admin Dashboard
    public static ADMIN_DASHBOARD_MODELS = require("./adminDashboardModels.json");
    public static ADMIN_DASHBOARD_MODEL_DETAILS_ONE_DAY = require("./adminDashboardModelDetailsOneDay");
    public static ADMIN_DASHBOARD_MODEL_DETAILS_TEN_DAYS = require("./adminDashboardModelDetailsTenDays");
    public static ADMIN_DASHBOARD_MODEL_DETAILS_ONE_HUNDRED_DAYS = require("./adminDashboardModelDetailsOneHundredDays");
    public static ADMIN_DASHBOARD_EXECUTION_LOGS = require("./adminDashboardExecutionLogs.json");
    public static ADMIN_DASHBOARD_NO_FAILED_MODELS = require("./adminDashboardNoFailedModels.json");
    public static ADMIN_DASHBOARD_FAILED_MODELS = require("./adminDashboardFailedModels.json");
    public static ADMIN_DASHBOARD_TASKS = require("./adminDashboardIssues.json");
    public static ADMIN_DASHBOARD_SINGLE_TASK = require("./adminDashboardSingleIssue.json")
    public static ADMIN_DASHBOARD_PAYLOAD_TABLE = require("./adminDashboardPayloadTable.json");
    public static ADMIN_DASHBOARD_PAYLOAD_EXECUTIONS = require("./adminDashboardPayloadExecutions.json");
    //Previously added
    public static INPUT_QUEUE_STATS = require("./inputQueueStats.json");
    public static OUTPUT_QUEUE_STATS = require("./outputQueueStats.json");
    public static ADMIN_DASH_EXECUTION_STATS_MODEL_1 = require("./adminDashboardOverviewModel1.json");
    public static ADMIN_DASH_EXECUTION_STATS_MODEL_2 = require("./adminDashboardOverviewModel2.json");
    public static ADMIN_DASH_EXECUTION_STATS_MODEL_3 = require("./adminDashboardOverviewModel3.json");
    public static ADMIN_DASH_EXECUTION_STATS_MODEL_4 = require("./adminDashboardOverviewModel4.json");
    public static ADMIN_DASH_AGG_EXECUTION_STATS_DAY = require("./adminDashboardAggregatedOverviewDay.json");
    public static ADMIN_DASH_AGG_EXECUTION_STATS_WEEK = require("./adminDashboardAggregatedOverviewWeek.json");
    public static ADMIN_DASH_EXECUTION_RESULTS_MODEL_1 = require("./adminDashboardExecutionResultsModel1.json");
    public static ADMIN_DASH_EXECUTION_RESULTS_MODEL_2 = require("./adminDashboardExecutionResultsModel2.json");
    public static ADMIN_DASH_PIPELINES_MODEL_1 = require("./adminDashboardPipelinesModel1.json");
    public static CLINICAL_REVIEW_ALL_EXECUTIONS = require("./allExecutionsForReview.json");
    public static CLINICAL_REVIEW_PAGE_1 = require("./clinicalReviewPage1.json");
    public static CLINICAL_REVIEW_PAGE_2 = require("./clinicalReviewPage2.json");
    public static CLINICAL_REVIEW_REVIEWED = require("./clinicalReviewed.json");
    public static CLINICAL_REVIEW_RESPONSE = require("./clinicalReviewResponse.json");
    public static EXECUTION_LOGS = require("./executionLogs.json");
    public static OUTPUT_FILE = require("./outputFile.json");
    public static REMOTE_DICOM_METADATA = require("./remoteDicomMetadata");
    public static APP_STORE_ALL_PERMUTATIONS = require("./appStoreAllPermutations.json");
    public static APP_PROFILE_PAGE1 = require("./appProfilePage1.json");
    public static APP_PROFILE_PAGE2 = require("./appProfilePage2.json");
    public static APP_STORE_SPECIALITY_DROP_DOWN = require("./appStoreSpecialityDropDown.json");
}
