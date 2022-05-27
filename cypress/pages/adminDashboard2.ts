import ApiMocks from "../fixtures/mockIndex";
import { AbstractPage } from "./abstractPage";
import { IExecutionStatistics, IIssue, ILog} from "../../src/models/AdminStatistics/ExecutionStatistics";
import { ExecStatistics } from "data/statistics";
export default class AdminDashboardPage extends AbstractPage {
    //OVERVIEW
    static MODEL_FAILURES = `model-failures`;
    static MODEL_EXECUTIONS = `model-failures-executions`;
    static MODEL_EXECUTIONS2 = `model-executions`;
    static MODEL_NUMBERS = `model-numbers`;
    static FAILURES_HIGHLIGHT = `model-failures-card`;
    //ISSUES TABLE
    static TASK_ID = `task-id`;
    static STATUS = `status`;
    static MODEL_NAME = `model-name`;
    static PATIENT_NAME = `patient-name`;
    static PATIENT_ID = `patient-id`;
    static EXECUTION_DATE_TIME = `execution-date-time`;
    static VIEW_LOGS_BUTTON = `view-logs-button`;
    static LOG = "logs";
    static DISMISS_BUTTON = `dismiss-button`;
    static DISMISS_SELECTED = `dismiss-selected`;
    static TASK = `task`;
    static SELECT_ALL = `[aria-label=""] > .v-data-table__checkbox > .v-input--selection-controls__input > .v-input--selection-controls__ripple`;
    static CHECKBOX = `checkbox`;
    static VALIDATION_OK = `validation-ok`;
    static VALIDATION_CANCEL = `validation-cancel`;
    static SEARCH_ISSUES_TABLE = `search-issues-table`;
    //GRAPH
    static DROPDOWN = `dropdown`;

    public assertTableDataCorrect(task: IIssue): void {
        this.getTask(task.task_id).within(() => {
            const dateTime = this.formatTaskDate(task.execution_time);
            cy.dataCy(AdminDashboardPage.TASK_ID).should(`contain`, task.task_id);
            cy.dataCy(AdminDashboardPage.STATUS).should(`contain`, task.status);
            cy.dataCy(AdminDashboardPage.MODEL_NAME).should(`contain`, task.model_name);
            cy.dataCy(AdminDashboardPage.PATIENT_NAME).should(`contain`, task.patient_name);
            cy.dataCy(AdminDashboardPage.PATIENT_ID).should(`contain`, task.patient_id);
            cy.dataCy(AdminDashboardPage.EXECUTION_DATE_TIME).should(`contain`, dateTime);
        });
    }

    public formatTaskDate(task: string): string {
        const date = task.split("T")[0].replace(/(\d{4})(\d{2})(\d+)/, "$1-$2-$3");
        const hour = Number(task.split("T")[1].substring(0, 2));
        const suffix: string = hour >= 12 ? "PM" : "AM";
        const formattedHour = (hour % 12 || 12).toString();
        const minutes = task.split("T")[1].substring(4, 2).toString();
        task = date + " " + formattedHour + ":" + minutes + " " + suffix;
        return task;
    }

    public assertLogsDisplayed(task: IIssue, log: ILog): void {
        this.getTask(task.task_id).within(() => {
            cy.intercept(`/api/logs/${task.task_id}`, ApiMocks.ADMIN_DASHBOARD_EXECUTION_LOGS).as(
                `Logs`,
            );
            cy.dataCy(AdminDashboardPage.VIEW_LOGS_BUTTON).click();
            cy.wait([`@Logs`]);
            Cypress.on(`uncaught:exception`, (err, runnable) => {
                return false;
            });
        });
        this.assertExecutionLogs(ApiMocks.ADMIN_DASHBOARD_EXECUTION_LOGS[0].msg);
    }
    public assertExecutionLogs(text: string): void {
        cy.dataCy(AdminDashboardPage.LOG).should("contain.text", text);
    }

    public assertTaskCanBeDismissed(task: IIssue): void {
        cy.get(`tbody > :nth-child(${task.task_id})`).within(() => {
            cy.dataCy(AdminDashboardPage.DISMISS_BUTTON).click();
        });
        cy.dataCy(AdminDashboardPage.VALIDATION_OK).click({ multiple: true, force: true });
        cy.dataCy(AdminDashboardPage.TASK_ID).should(`not.exist`);
    }

    public assertOverviewModelDataCorrect(executionStatistics: IExecutionStatistics): void {
        cy.dataCy(AdminDashboardPage.MODEL_NUMBERS).should(
            `contain`,
            executionStatistics.deployed_models,
        );
        cy.dataCy(AdminDashboardPage.MODEL_EXECUTIONS).should(
            `contain`,
            executionStatistics.model_executions,
        );
        cy.dataCy(AdminDashboardPage.MODEL_EXECUTIONS2).should(
            `contain`,
            executionStatistics.model_executions,
        );
        cy.dataCy(AdminDashboardPage.MODEL_FAILURES).should(
            `contain`,
            executionStatistics.model_failures,
        );
    }

    public assertCorrectHighlightAroundTile(executionStatistics: ExecStatistics): void {
        if (executionStatistics.model_failures >= 1) {
            cy.dataCy(AdminDashboardPage.FAILURES_HIGHLIGHT)
                .should(`be.visible`)
                .should(`have.css`, `border`, `1px solid rgb(211, 47, 47)`);
        } else {
            cy.dataCy(AdminDashboardPage.FAILURES_HIGHLIGHT)
                .should(`be.visible`)
                .should(`have.css`, `border`, `1px solid rgb(255, 255, 255)`);
        }
    }

    public selectAllTasks(): void {
        cy.get(AdminDashboardPage.SELECT_ALL).click();
    }

    public selectDismissSelectedButton(): void {
        cy.dataCy(AdminDashboardPage.DISMISS_SELECTED).click();
    }

    public AssertDismissButtonUnclickable(): void {
        cy.dataCy(AdminDashboardPage.DISMISS_SELECTED).should(`be.disabled`);
    }

    public getTask(taskId: number): Cypress.Chainable<JQuery> {
        return cy.get(`tbody > :nth-child(${taskId})`);
    }

    public unselectAllTasks(): void {
        cy.get(AdminDashboardPage.SELECT_ALL).click();
    }

    public assertCheckboxesSelected(): void {
            cy.get(`.v-data-table__selected`).should(`exist`);;
    }

    public assertCheckboxesUnselected(): void {
            cy.get(`.v-data-table__selected`).should(`not.exist`);;
    }

    public assertNoTasks(): void {
        cy.dataCy(AdminDashboardPage.TASK_ID).should(`not.exist`);
    }

    public selectOKValidation(): void {
        cy.dataCy(AdminDashboardPage.VALIDATION_OK).click({ multiple: true, force: true });
    }

    public selectCancelValidation(): void {
        cy.dataCy(AdminDashboardPage.VALIDATION_CANCEL).click({ multiple: true, force: true });
    }

    public searchIssuesTable(text: string): void {
        if (text !== ``) {
            cy.dataCy(AdminDashboardPage.SEARCH_ISSUES_TABLE).clear().type(text);
        } else {
            cy.dataCy(AdminDashboardPage.SEARCH_ISSUES_TABLE).clear();
        }
    }

    public assertCorrectTaskReturned(task: IIssue): void {
        cy.dataCy(AdminDashboardPage.TASK)
            .should(`contain`, task.task_id)
            .should(`contain`, task.patient_name);
    }

    public assertModelsVisible(): void {
        cy.dataCy(AdminDashboardPage.DROPDOWN).click();
    }

    // public assertLatestErrorContainsMessage(text: string): void {
    //     cy.get("[class=v-toast__text]").should("have.text", text);
    // }

    public async initPageWithNoFailedModels() {
        cy.intercept(
            `/api/model-execution-stats?period=day`,
            ApiMocks.ADMIN_DASHBOARD_NO_FAILED_MODELS,
        ).as(`No models fail`);
        // cy.intercept(`/model-execution-stats?period=week`, ApiMocks.ADMIN_DASHBOARD_MODELS_NO_FAIL_WEEK).as(`No fails month`);
        // cy.intercept(`/model-execution-stats?period=month`, ApiMocks.ADMIN_DASHBOARD_MODELS_NO_FAIL_MONTH).as(`No fails year`);
        cy.visit(`/#/admin-health-dashboard`);
        cy.wait([`@No models fail`]);
        Cypress.on(`uncaught:exception`, (err, runnable) => {
            return false;
        });
    }

    public async initPage() {
        const taskId = `10`;
        // const year = Date.prototype.getFullYear();
        // const month = Date.prototype.getMonth();
        // const day = Date.prototype.getDate();
        // const dayLessSeven = day-7;
        // const today = `${year}${month}${day}`;
        // const aWeekAgo = `${year}${month}${dayLessSeven}`
        // const model_id = 1
        cy.intercept(
            `/api/model-execution-stats?period=day`,
            ApiMocks.ADMIN_DASHBOARD_FAILED_MODELS,
        ).as(`Model stats`);
        cy.intercept(`/api/tasks`, ApiMocks.ADMIN_DASHBOARD_TASKS).as(`Tasks`);
        //cy.intercept(`/logs/${taskId}`, ApiMocks.ADMIN_DASHBOARD_EXECUTION_LOGS).as(`Logs`);
        //cy.intercept(`/models`, ApiMocks.ADMIN_DASHBOARD_MODELS).as('Models');
        //cy.intercept(`/graph/${model_id}?start_date=${aWeekAgo}&end_date=${today}`, ApiMocks.ADMIN_DASHBOARD_GRAPH_ONE_DAY).as(`Model`);
        cy.visit(`/#/admin-health-dashboard`);
        cy.wait([`@Model stats`, `@Tasks`]);
        Cypress.on(`uncaught:exception`, (err, runnable) => {
            return false;
        });
    }

    public async initPageSingleTask() {
        cy.intercept(
            `/api/model-execution-stats?period=day`,
            ApiMocks.ADMIN_DASHBOARD_FAILED_MODELS,
        ).as(`Model stats`);
        cy.intercept(`/api/tasks`, ApiMocks.ADMIN_DASHBOARD_SINGLE_TASK).as(`Task`);
        cy.visit(`/#/admin-health-dashboard`);
        cy.wait([`@Model stats`, `@Task`]);
        Cypress.on(`uncaught:exception`, (err, runnable) => {
            return false;
        });
    }

    // public async initPageWithErrors() {
    //     // cy.intercept(`/api/model-execution-stats?period=day`, ApiMocks.ADMIN_DASHBOARD_FAILED_MODELS)
    //     // .as(`Model stats`);
    //     cy.intercept("/api/model-execution-stats?period=day", { statusCode: 400 }).as("Executions not found");
    //     cy.intercept(`/api/tasks`, ApiMocks.ADMIN_DASHBOARD_SINGLE_TASK)
    //     .as(`Task`);
    //     cy.visit(`/#/admin-health-dashboard`);
    //     cy.wait([`@Executions not found`, `@Task`]);
    //     //cy.intercept(`/logs/${taskId}`, ApiMocks.ADMIN_DASHBOARD_EXECUTION_LOGS).as(`Logs`);
    //     //cy.intercept(`/models`, ApiMocks.ADMIN_DASHBOARD_MODELS).as('Models');
    //     //cy.intercept(`/graph/${model_id}?start_date=${aWeekAgo}&end_date=${today}`, ApiMocks.ADMIN_DASHBOARD_GRAPH_ONE_DAY).as(`Model`);
    //     cy.visit(`/#/admin-health-dashboard`);
    //     cy.wait([`@Model stats`, `@Tasks`]);
    //     Cypress.on(`uncaught:exception`, (err, runnable) => {
    //         return false;
    //     })
    // }
}
