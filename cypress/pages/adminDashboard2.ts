import ApiMocks from "../fixtures/mockIndex";
import { AbstractPage } from "./abstractPage";
import { IExecutionStatistics } from "../../src/models/AdminStatistics/ExecutionStatistics";
// import { Task } from "../../src/models/Application/AdminStatistics/Task";
import { contains } from "cypress/types/jquery";
export default class AdminDashboardPage extends AbstractPage {

    static MODEL_FAILURES = "model-failures";
    static MODEL_EXECUTIONS = "model-failures-executions";
    static MODEL_EXECUTIONS2 = "model-executions";
    static MODEL_NUMBERS = "model-numbers";
    static FAILURES_HIGHLIGHT = "model-failures-card";

    // public assertTableDataCorrect(tasks: Task): void {

    // }

    public assertLogsDisplayed(): void {

    }

    public assertOverviewModelDataCorrect(executionStatistics: IExecutionStatistics): void {
        cy.dataCy(AdminDashboardPage.MODEL_NUMBERS).should(
            "contain",
            executionStatistics.deployed_models,
        );
        cy.dataCy(AdminDashboardPage.MODEL_EXECUTIONS).should(
            "contain",
            executionStatistics.model_executions,
        );
        cy.dataCy(AdminDashboardPage.MODEL_EXECUTIONS2).should(
            "contain",
            executionStatistics.model_executions,
        );
        cy.dataCy(AdminDashboardPage.MODEL_FAILURES).should(
            "contain",
            executionStatistics.model_failures,
        );
    }

    public assertCorrectHighlightAroundModelsFailureTile(
        executionStatistics: IExecutionStatistics,
    ): void {
        if (executionStatistics.model_failures >= 1) {
            cy.dataCy(AdminDashboardPage.FAILURES_HIGHLIGHT)
                .should("be.visible")
                .should("have.css", "border", "1px solid rgb(211, 47, 47)");
        } else {
            cy.dataCy(AdminDashboardPage.FAILURES_HIGHLIGHT)
                .should("be.visible")
                .should("have.css", "border", "1px solid rgb(255, 255, 255)");
        }
    }

    public async initPageWithoutModelFail() {
        cy.intercept(
            `/api/model-execution-stats?period=day`,
            ApiMocks.ADMIN_DASHBOARD_NO_FAILED_MODELS,
        ).as("No models fail");
        // cy.intercept("/model-execution-stats?period=week", ApiMocks.ADMIN_DASHBOARD_MODELS_NO_FAIL_WEEK).as("No fails month");
        // cy.intercept("/model-execution-stats?period=month", ApiMocks.ADMIN_DASHBOARD_MODELS_NO_FAIL_MONTH).as("No fails year");
        cy.visit(`/#/admin-health-dashboard`);
        cy.wait(["@No models fail"]);
        Cypress.on("uncaught:exception", (err, runnable) => {
            return false;
        });
    }

    public async initPage() {
        const taskId = "10"
        cy.intercept(`/api/model-execution-stats?period=day`, ApiMocks.ADMIN_DASHBOARD_FAILED_MODELS).as("Model stats");
        // cy.intercept(`/tasks`, ApiMocks.ADMIN_DASHBOARD_ISSUES).as("Tasks");
        //Add id depending on which task is clicked
        // cy.intercept(`/logs/${taskId}`, ApiMocks.ADMIN_DASHBOARD_EXECUTION_LOGS).as("Logs")
        // cy.intercept("/model-execution-stats?period=week", ApiMocks.ADMIN_DASHBOARD_MODELS_FAIL_WEEK).as("Fail week");
        // cy.intercept("/model-execution-stats?period=month", ApiMocks.ADMIN_DASHBOARD_MODELS_FAIL_MONTH).as("Fail month");
        cy.visit(`/#/admin-health-dashboard`);
        // cy.wait(["@Model stats", "@Tasks", "@Logs"]);
        Cypress.on("uncaught:exception", (err, runnable) => {
            return false;
        });
    }
}

