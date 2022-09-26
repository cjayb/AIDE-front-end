import Workflows from "pages/workflows";
import { WorkflowData } from "data/workflows/workflows";

const workflowInitData = WorkflowData.WORKFLOWS_INIT;
const workflowPage = new Workflows();

describe("Display list of users", () => {
    beforeEach(() => {
        workflowPage.initPage();
        cy.injectAxe();
        cy.configureAxe({
            rules: [
                {
                    id: "nested-interactive",
                    enabled: false,
                },
                {
                    id: "page-has-heading-one",
                    enabled: false,
                },
                {
                    id: "aria-dialog-name",
                    enabled: false,
                },
            ],
        });
    });

    describe("Accessibility", () => {
        it("User page should have no accessibility violations", () => {
            cy.checkA11y();
        });
    });

    describe("All expected elements on the page are visible", () => {
        it("Each row has an edit button visible", () => {
            workflowPage.editButtonVisibleUsers();
        });
        it("Each row has a delete button visible", () => {
            workflowPage.deleteButtonVisibleUsers();
        });
        it("A create new workflow button is visible", () => {
            workflowPage.elementVisibleDataCy("add-workflow");
        });
    });

    describe("GET workflows", () => {
        it(`The users table is populated with the data returned from the API`, () => {
            workflowPage.assertTableDataCorrect(workflowInitData);
        });
    });

    describe("Pagination", () => {
        it("Pagination visible", () => {
            workflowPage.elementVisibleGet(".v-data-footer__select");
            workflowPage.elementVisibleGet(".v-data-footer__pagination");
            workflowPage.elementVisibleGet(".v-data-footer__icons-after");
        });
        it("Total number of workflows on pagination is displayed correctly", () => {
            workflowPage.assertTotalWorkflows(workflowInitData);
        });
        it("Next page button is enabled if total pages is more than 10", () => {
            workflowPage.checkNextPageButtonStatus(workflowInitData);
        });
        it("Selecting next page sends a request for the next page's workflows to the API", () => {
            workflowPage.paginationRequestUsers();
        });
        it("Users returned from API are displayed correctly", () => {
            workflowPage.paginationRequestUsers();
            workflowPage.assertTableDataCorrect(workflowInitData);
        });
    });

    describe("Delete existing user", () => {
        it("Selecting delete sends a delete request to the API", () => {
            workflowPage.clickDeleteButtonWorkflows(0);
            workflowPage.assertCorrectDeleteRequest(workflowInitData);
        });
        it("Delete response is displayed correctly", () => {
            workflowPage.clickDeleteButtonWorkflows(0);
            workflowPage.assertCorrectDeleteRequest(workflowInitData);
            workflowPage.assertTableDataCorrect(workflowInitData);
        });
    });

    // describe("Edit", () => {
    //     it.only("Selecting edit on a workflow sends a request for that workflow to the API", () => {
    //         workflowPage.clickEditButtonUsers(0);
    //         workflowPage.assertWorkflowEditRequest(workflowInitData, 0);
    //     });
    //     it("Selecting edit on a workflow, opens a new tab with a url ending in that workflow's id", () => {
    //         workflowPage.clickEditButtonUsers(0);
    //         workflowPage.assertUrl(workflowInitData);
    //     });
    //     it("Editing a workflow with incorrect json displays validation in the UI", () => {
    //         workflowPage.clickEditButtonUsers(0);
    //         workflowPage.assertJsonError();
    //     });
    // });
});

describe(" API errors", () => {
    const initError = "Something unexpected went wrong retrieving workflows";
    const deleteErrorMessage = "Something unexpected went wrong deleting the workflow";

    [400, 404, 500, 502].forEach((statusCode) => {
        it(`UI message displayed if a ${statusCode} error is returned on getting workflows`, () => {
            workflowPage.initPageError(statusCode);
            workflowPage.assertToast(initError);
        });
        it(`UI message displayed if a ${statusCode} error is returned on deleting existing workflow`, () => {
            workflowPage.initPage();
            workflowPage.clickDeleteButtonWorkflows(0);
            workflowPage.errorDeleteUser(workflowInitData, statusCode);
            workflowPage.assertToast(deleteErrorMessage);
        });
    });
});
