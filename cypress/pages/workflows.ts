import ApiMocks from "fixtures/mockIndex";
import { AbstractPage } from "./abstractPage";
import { WorkflowData } from "data/workflows/workflows";

const nextPage = ".v-data-footer__icons-after > .v-btn > .v-btn__content > .v-icon";

export default class Workflows extends AbstractPage {
    public initPage() {
        cy.intercept("/workflows?pageNumber=1&pageSize=10", ApiMocks.WORKFLOWS).as("workflows");
        cy.visit("/#/workflows");
        cy.wait(["@workflows"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public initPageError(statuscode: number) {
        cy.intercept("/workflows?pageNumber=1&pageSize=10", { statusCode: statuscode }).as(
            "workflows",
        );
        cy.visit("/#/workflows");
        cy.wait(["@workflows"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public paginationRequestUsers() {
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

    public errorDeleteUser(workflow: WorkflowData, statusCode: number) {
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

    public editButtonVisibleUsers() {
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((row) => {
            cy.dataCy(`workflow-table-row-actions-${row}`).within(() => {
                cy.dataCy("workflow-edit").should("be.visible");
            });
        });
    }

    public deleteButtonVisibleUsers() {
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
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((row) => {
            cy.dataCy(`workflow-table-row-name-${row}`).should(`contain`, workflow.data[row].name);
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

    public assertUrl(workflow: WorkflowData) {
        cy.url().should("include", `workflow-editor/${workflow.data[0].workflow_id}`);
    }

    public assertJsonError() {
        cy.get(".cm-content").clear().type("{ {");
        cy.get(".jse-message").should("be.visible");
        cy.get(".cm-content").clear().type("[]").type("{backspace}");
        cy.get(".jse-message").should("be.visible");
        cy.get(".cm-content").clear().type("{").type("{rightArrow}").type("{");
        cy.get(".jse-message").should("be.visible");
    }

    public assertWorkflowEditRequest(workflow: WorkflowData, index: number) {
        cy.intercept(`/workflows/${workflow.data[0].workflow_id}`, ApiMocks.WORKFLOW_EXAMPLE).as(
            "workflows",
        );
        cy.dataCy(`workflow-table-row-actions-${index}`).within(() => {
            cy.dataCy("workflow-edit").click();
        });
        cy.wait(["@workflows"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }
}