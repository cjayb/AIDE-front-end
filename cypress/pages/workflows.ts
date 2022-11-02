import ApiMocks from "fixtures/mockIndex";
import { AbstractPage } from "./abstractPage";
import { WorkflowData } from "data/workflows/workflows";
import { WorkflowExampleData } from "data/workflows/workflowJson";

const nextPage = ".v-data-footer__icons-after > .v-btn > .v-btn__content > .v-icon";
const errorOne =
    "Failed to validate workflow: 'router_1kjgdksgdkasgdkhasgdkhasgdhasgdjhs' is not a valid Workflow Name (source: Workflow).";
const errorTwo = "Found Task(s) without any task destinations to it: export-task-mr";
const errorThree = "Task: argo-task-mr has task destination: export-task that could not be found.";
const ErrorFour = "ERROR: Task destination export-task not found.";

export default class Workflows extends AbstractPage {
    public initPage() {
        cy.intercept("/workflows?pageNumber=1&pageSize=10", ApiMocks.WORKFLOWS).as("workflows");
        cy.visit("/workflows");
        cy.wait(["@workflows"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public initPageError(statuscode: number) {
        cy.intercept("/workflows?pageNumber=1&pageSize=10", { statusCode: statuscode }).as(
            "workflows",
        );
        cy.visit("/workflows");
        cy.wait(["@workflows"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public paginationRequestWorkflows() {
        cy.intercept("GET", `/workflows?pageNumber=2&pageSize=10`, ApiMocks.WORKFLOWS).as(
            "nextPage",
        );
        this.clickGet(nextPage);
        cy.wait(["@nextPage"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public assertCorrectDeleteRequest(workflow: WorkflowData) {
        cy.intercept("DELETE", `/workflows/${workflow.data[0].workflow_id}`, ApiMocks.WORKFLOWS).as(
            "Delete",
        );
        cy.intercept("GET", "/workflows?pageNumber=1&pageSize=10", ApiMocks.WORKFLOWS).as("Get");
        this.clickDataCy("workflow-delete-ok");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Delete", "@Get"]);
    }

    public errorDeleteWorkflow(workflow: WorkflowData, statusCode: number) {
        cy.intercept("DELETE", `/workflows/${workflow.data[0].workflow_id}`, {
            statusCode: statusCode,
        }).as("Delete");
        cy.intercept("GET", "/workflows?pageNumber=1&pageSize=10", ApiMocks.WORKFLOWS).as("Get");
        this.clickDataCy("workflow-delete-ok");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Delete"]);
    }

    public editButtonVisible() {
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((row) => {
            cy.dataCy(`workflow-table-row-actions-${row}`).within(() => {
                cy.dataCy("workflow-edit").should("be.visible");
            });
        });
    }

    public deleteButtonVisible() {
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((row) => {
            cy.dataCy(`workflow-table-row-actions-${row}`).within(() => {
                cy.dataCy("workflow-delete").should("be.visible");
            });
        });
    }

    public elementVisibleDataCy(tag: string) {
        cy.wait(500);
        cy.dataCy(tag).should("be.visible");
    }

    public assertTableDataCorrect(workflow: WorkflowData) {
        [0, 1, 2, 3, 4, 5].forEach((row) => {
            cy.dataCy(`workflow-table-row-name-${row}`).should(`contain`, workflow.data[row].name);
            cy.dataCy(`workflow-table-row-aetitle-${row}`).should(
                `contain`,
                workflow.data[row].ae_title,
            );
            workflow.data[row].data_origins.forEach((data_origin) => {
                cy.dataCy(`workflow-table-row-data-${row}`).should(`contain`, data_origin);
            });
            cy.dataCy(`workflow-table-row-version-${row}`).should(
                `contain`,
                workflow.data[row].version,
            );
            cy.dataCy(`workflow-table-row-description-${row}`).should(
                `contain`,
                workflow.data[row].description,
            );
        });
    }

    public elementVisibleGet(tag: string) {
        cy.get(tag).should("be.visible");
    }

    public assertTotalWorkflows(workflow: WorkflowData) {
        cy.get(".v-data-footer__pagination").should("contain", workflow.totalRecords);
    }

    public checkNextPageButtonStatus(workflow: WorkflowData) {
        if (workflow.totalRecords > 10) {
            cy.get(".v-data-footer__icons-after > .v-btn").should("be.enabled");
        } else if (workflow.totalRecords <= 10) {
            cy.get(".v-data-footer__icons-after > .v-btn").should("be.disabled");
        }
    }

    public clickDeleteButtonWorkflows(index: number) {
        cy.dataCy(`workflow-table-row-actions-${index}`).within(() => {
            cy.dataCy("workflow-delete").click();
        });
    }

    public clickEditButtonUsers(index: number) {
        cy.dataCy(`workflow-table-row-actions-${index}`).within(() => {
            cy.dataCy("workflow-edit").click();
        });
    }

    public assertEditUrl(workflow: WorkflowData) {
        cy.url().should("include", `workflow-editor/${workflow.data[0].workflow_id}`);
    }

    public assertAddUrl() {
        cy.url().should("include", `workflow-editor`);
    }

    public assertJsonError() {
        cy.get(".cm-content").clear().type("{ {");
        cy.get(".jse-message").should("be.visible");
        cy.get(".cm-content").clear().type("[]").type("{backspace}");
        cy.get(".jse-message").should("be.visible");
        cy.get(".cm-content").clear().type("{").type("{rightArrow}").type("{");
        cy.get(".jse-message").should("be.visible");
    }

    public triggerJsonValidation() {
        cy.get(".cm-content").clear().type("{ {");
    }

    public clearJson() {
        cy.get(".cm-content").clear();
    }

    public assertSaveStatus(status: string) {
        switch (status) {
            case "enabled":
                cy.dataCy("save-workflow-changes").should("be.enabled");
                break;
            case "disabled":
                cy.dataCy("save-workflow-changes").should("be.disabled");
                break;
            default:
                throw "This scenario has not been implemented. Please review";
        }
    }

    public workflowEditRequest() {
        cy.intercept(`/workflows/12345-abcde`, ApiMocks.WORKFLOW_EMPTY).as("workflows");
        cy.dataCy(`workflow-table-row-actions-0`).within(() => {
            cy.dataCy("workflow-edit").click();
        });
        cy.wait(["@workflows"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public workflowEditRequestError(statusCode) {
        cy.intercept(`/workflows/12345-abcde`, { statusCode: statusCode }).as("workflows");
        cy.dataCy(`workflow-table-row-actions-0`).within(() => {
            cy.dataCy("workflow-edit").click();
        });
        cy.wait(["@workflows"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public workflowEditRequestEmpty() {
        cy.intercept(`/workflows/12345-abcde`, ApiMocks.WORKFLOW_EMPTY).as("workflows");
        cy.dataCy(`workflow-table-row-actions-0`).within(() => {
            cy.dataCy("workflow-edit").click();
        });
        cy.wait(["@workflows"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public workflowDisplayedCorrectly() {
        cy.wait(500);
        cy.get(".cm-content").should("contain", "router_1");
    }

    public assertNoModal() {
        cy.get("modal").should("not.exist");
    }

    public editWorkflow() {
        cy.get(".cm-content").clear().wait(500).type("{{}}").wait(500);
    }

    public assertPut() {
        cy.intercept("PUT", `/workflows/12345-abcde`).as("put");
        this.clickDataCy("workflow-edit-confirm-ok");
        cy.wait(["@put"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public assertPost() {
        cy.intercept("POST", `/workflows`, { statusCode: 200 }).as("post");
        this.clickDataCy("workflow-edit-confirm-ok");
        cy.wait(["@post"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public returnErrorPost(statusCode: number) {
        cy.intercept("POST", `/workflows`, { statusCode: statusCode }).as("post");
        this.clickDataCy("workflow-edit-confirm-ok");
        cy.wait(["@post"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public returnEditError() {
        cy.intercept("PUT", `/workflows/12345-abcde`, {
            statusCode: 400,
            body: ApiMocks.WORKFLOW_ERRORS,
        }).as("error");
        this.clickDataCy("workflow-edit-confirm-ok");
        cy.wait(["@error"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public returnEditToastError(workflow: WorkflowExampleData, statusCode: number) {
        cy.intercept("PUT", `/workflows/12345-abcde`, {
            statusCode: statusCode,
        }).as("error");
        this.clickDataCy("workflow-edit-confirm-ok");
        cy.wait(["@error"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public returnAddError() {
        cy.intercept("POST", `/workflows`, { statusCode: 400, body: ApiMocks.WORKFLOW_ERRORS }).as(
            "post",
        );
        this.clickDataCy("workflow-edit-confirm-ok");
        cy.wait(["@post"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorsDisplayed() {
        cy.dataCy("error-container").should("contain", errorOne);
        cy.dataCy("error-container").should("contain", errorTwo);
        cy.dataCy("error-container").should("contain", errorThree);
        cy.dataCy("error-container").should("contain", ErrorFour);
    }

    public returnSuccess() {
        cy.intercept("PUT", `/workflows/12345-abcde`, {
            statusCode: 200,
        }).as("success");
        this.clickDataCy("workflow-edit-confirm-ok");
        cy.wait(["@success"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public assertWorkflowsUrl() {
        cy.url().should("eql", "http://localhost:8080/workflows");
    }

    public assertNoText() {
        cy.get(".cm-content").should("contain", "{}");
    }
}
