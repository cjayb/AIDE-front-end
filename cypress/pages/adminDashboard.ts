import { table } from "console"
import { ModelTableColumn } from "../data/modelTableColumn"
import ApiMocks from "../fixtures/mockIndex"
import IPage from "./abstractPage"
export default class AdminDashboardPage implements IPage {
    // Default Screen
    // public static WEEKLY_VIEW: CodeceptJS.Locator = locate(".v-btn").withChild(".v-btn__content").withText("Weekly")
    // public static MONTHLY_VIEW: CodeceptJS.Locator = locate(".v-btn").withChild(".v-btn__content").withText("Monthly")
    // public static DAY_VIEW: CodeceptJS.Locator = locate(".v-btn").withChild(".v-btn__content").withText("24 Hours")
    private static MODEL_TABLE: string = "model-table"
    private static MODEL_ROW: string = "td";
    private static TABLE_HEADER: string = "th";
    public static FREETEXT_SEARCH: string = "model-search";
    // public static MODELS_TITLE: CodeceptJS.Locator = locate(".v-toolbar__title").withText("Models")

    // // Execution Results
    private static EXECUTIONS_TABLE: string = "execution-table"
    private static VIEW_LOGS: string = "open-logs"
    private static VIEW_PIPELINE: string = "open-pipeline"
    private static PIPELINE_DIALOGUE: string = "pipeline-dialogue"
    // public static VIEW_LOGS_MODEL_1: CodeceptJS.Locator = locate(".v-btn").withChild(".v-btn__content").withText("View Logs").at(1)
    // public static END_OF_LOGS: CodeceptJS.Locator = locate(".vjs-key").withText("message")
    // public static DOWNLOAD_OUTPUT_MODEL_1: CodeceptJS.Locator = locate(".v-btn").withChild(".v-btn__content").withText("Download Output").at(1)
    // public static VIEW_PIPELINE_MODEL_1: CodeceptJS.Locator = locate(".v-btn").withChild(".v-btn__content").withText("View Pipeline").at(1)
    // public static CLOSE_MODAL: CodeceptJS.Locator = locate(".v-btn").withChild(".v-btn__content").withText("Close")

    // Execution Results Pagination
    private static PREVIOUS_PAGE: string = ".mdi-chevron-left"
    private static ROWS_PER_PAGE_SELECTOR: string = ".mdi-menu-down"
    private static NEXT_PAGE: string = ".mdi-chevron-right"

    // Model Data
    public static MODEL_1_NAME: string = ApiMocks.ADMIN_DASHBOARD_MODELS[0]["model_name"]
    private static MODEL_2_NAME: string = ApiMocks.ADMIN_DASHBOARD_MODELS[1]["model_name"]

    //Execution logs modal
    private static EXECUTION_LOGS: string = "execution-logs"

    public toggleModelRowWithName(modelName: string) {
        cy.get(AdminDashboardPage.MODEL_ROW).contains(modelName).click();
    }

    public showLogsForExecution(number: number) {
        cy.dataCy(AdminDashboardPage.EXECUTIONS_TABLE).within(() => {
            cy.dataCy(AdminDashboardPage.VIEW_LOGS).eq(number).click();
        })
    }

    public showPipelineForExecution(number: number) {
        cy.dataCy(AdminDashboardPage.EXECUTIONS_TABLE).within(() => {
            cy.dataCy(AdminDashboardPage.VIEW_PIPELINE).eq(number).click();
        })
    }

    public assertPipelineContainsModel(modelName: string){
        cy.dataCy(AdminDashboardPage.PIPELINE_DIALOGUE).should("contain.text", modelName);
    }

    public sortModelTable(column: ModelTableColumn) {
        cy.get(AdminDashboardPage.TABLE_HEADER).contains(column).click();
    }

    public assertModelEntryContainsText(number: number, text: string) {
        cy.dataCy(AdminDashboardPage.MODEL_TABLE).within(($table => {
            cy.get("tr").eq(number).should("contain.text", text);
        }));
    }

    public assertExecutionLogs(text: string){
        cy.dataCy(AdminDashboardPage.EXECUTION_LOGS).should("contain.text", text);
    }

    public searchDashboard(text: string) {
        if (text !== "") {
            cy.dataCy(AdminDashboardPage.FREETEXT_SEARCH).clear().type(text);
        } else {
            cy.dataCy(AdminDashboardPage.FREETEXT_SEARCH).clear();
        }
    }

    public assertTableContainsModel(modelName: string) {
        cy.dataCy(AdminDashboardPage.MODEL_TABLE).get("table").should("contain.text", modelName)
    }

    public async initPage() {
        cy.intercept("/models", ApiMocks.ADMIN_DASHBOARD_MODELS).as("All models");
        cy.intercept("/queues/input", ApiMocks.INPUT_QUEUE_STATS).as("Input queue stats");
        cy.intercept("/queues/output", ApiMocks.OUTPUT_QUEUE_STATS).as("Output queue stats");
        cy.intercept("/execution_stats?days=1", ApiMocks.ADMIN_DASH_AGG_EXECUTION_STATS_DAY).as("Today's execution stats");
        cy.intercept("/execution_stats?days=7", ApiMocks.ADMIN_DASH_AGG_EXECUTION_STATS_WEEK).as("This week's execution stats");
        cy.intercept(`/execution_stats?days=1000&model_id=${ApiMocks.ADMIN_DASHBOARD_MODELS[0]["model_name"]}%2F1.0.0`, ApiMocks.ADMIN_DASH_EXECUTION_STATS_MODEL_1).as("Model1Stats");
        cy.intercept(`/execution_stats?days=1000&model_id=${ApiMocks.ADMIN_DASHBOARD_MODELS[1]["model_name"]}%2F1.0.0`, ApiMocks.ADMIN_DASH_EXECUTION_STATS_MODEL_2).as("Model2Stats");
        cy.intercept(`/execution_stats?days=1000&model_id=${ApiMocks.ADMIN_DASHBOARD_MODELS[2]["model_name"]}%2F1.0.0`, ApiMocks.ADMIN_DASH_EXECUTION_STATS_MODEL_3).as("Model3Stats");
        cy.intercept(`/execution_stats?days=1000&model_id=${ApiMocks.ADMIN_DASHBOARD_MODELS[3]["model_name"]}%2F1.0.0`, ApiMocks.ADMIN_DASH_EXECUTION_STATS_MODEL_4).as("Model4Stats");
        cy.intercept(`/execution_stats?days=1&model_id=${ApiMocks.ADMIN_DASHBOARD_MODELS[0]["model_name"]}%2F1.0.0`, ApiMocks.ADMIN_DASH_EXECUTION_STATS_MODEL_1).as("Model1Status");
        cy.intercept(`/execution_stats?days=1&model_id=${ApiMocks.ADMIN_DASHBOARD_MODELS[1]["model_name"]}%2F1.0.0`, ApiMocks.ADMIN_DASH_EXECUTION_STATS_MODEL_2).as("Model2Status");
        cy.intercept(`/execution_stats?days=1&model_id=${ApiMocks.ADMIN_DASHBOARD_MODELS[2]["model_name"]}%2F1.0.0`, ApiMocks.ADMIN_DASH_EXECUTION_STATS_MODEL_3).as("Model3Status");
        cy.intercept(`/execution_stats?days=1&model_id=${ApiMocks.ADMIN_DASHBOARD_MODELS[3]["model_name"]}%2F1.0.0`, ApiMocks.ADMIN_DASH_EXECUTION_STATS_MODEL_4).as("Model4Status");
        cy.intercept(`/execution_stats?days=7*`, ApiMocks.ADMIN_DASH_EXECUTION_STATS_MODEL_4).as("General stats week");
        cy.intercept(`/execution_stats?days=30*`, ApiMocks.ADMIN_DASH_EXECUTION_STATS_MODEL_3).as("General stats month");
        cy.intercept(`/executions?*`, ApiMocks.ADMIN_DASH_EXECUTION_RESULTS_MODEL_1).as("Heamorrhage-brush executions");
        cy.intercept(`/pipeline/*`, ApiMocks.ADMIN_DASH_PIPELINES_MODEL_1).as("Pipeline");
        cy.intercept(`/logs/*`, ApiMocks.EXECUTION_LOGS).as("Execution logs");
        cy.intercept(`/file`, ApiMocks.OUTPUT_FILE);
        cy.visit('/#/admin-dashboard');
        cy.wait(['@Model1Stats', '@Model2Stats', '@Model3Stats', '@Model4Stats'])
        Cypress.on("uncaught:exception", (err, runnable) => {
            //TODO: Remove this once uncaught exceptions have been removed
            return false;
        });
    }
}