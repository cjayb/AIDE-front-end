import Workflows from "pages/workflows";
import { WorkflowData } from "data/workflows/workflows";
import { WorkflowExampleData } from "data/workflows/workflowJson";

const workflowInitData = WorkflowData.WORKFLOWS_INIT;
const workflowPage = new Workflows();
const workflowEmpty = WorkflowExampleData.WORKFLOW_EMPTY;

describe("Display list of users", () => {
    beforeEach(() => {
        workflowPage.initPage();
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

    describe("Edit", () => {
        it("Selecting edit on a workflow, opens a new page with a url ending in that workflow's id", () => {
            workflowPage.workflowEditRequest();
            workflowPage.assertEditUrl(workflowInitData);
        });
        it("Selecting edit on a workflow sends a request for that workflow to the API", () => {
            workflowPage.workflowEditRequest();
        });
        it("The workflow returned from the API is displayed correctly in the editor", () => {
            workflowPage.workflowEditRequestEmpty();
            workflowPage.workflowDisplayedCorrectly();
        });
        it("Editing a workflow with incorrect json displays validation in the UI", () => {
            workflowPage.workflowEditRequest();
            workflowPage.assertJsonError();
        });
        it("When validation is triggered, save button is disabled", () => {
            workflowPage.workflowEditRequest();
            workflowPage.triggerJsonValidation();
            workflowPage.assertSaveStatus("disabled");
        });
        it("When validation is removed, save button is enabled", () => {
            workflowPage.workflowEditRequest();
            workflowPage.triggerJsonValidation();
            workflowPage.clearJson();
            workflowPage.assertSaveStatus("enabled");
        });
        it("Selecting save and then cancel on the modal keeps you on the editor page", () => {
            workflowPage.workflowEditRequest();
            workflowPage.clickDataCy("save-workflow-changes");
            workflowPage.clickDataCy("workflow-edit-confirm-cancel");
            workflowPage.assertEditUrl(workflowInitData);
        });
        it("Selecting cancel and then cancel on the modal keeps you on the editor page", () => {
            workflowPage.workflowEditRequest();
            workflowPage.clickDataCy("discard-workflow-changes");
            workflowPage.clickDataCy("workflow-discard-confirm-cancel");
            workflowPage.assertEditUrl(workflowInitData);
        });
        it("Selecting cancel and then confirm on the modal returns you to the workflow tables page", () => {
            workflowPage.workflowEditRequest();
            workflowPage.clickDataCy("discard-workflow-changes");
            workflowPage.clickDataCy("workflow-discard-confirm-ok");
            workflowPage.assertWorkflowsUrl();
        });
        it("Saving an edited workflow sends a PUT request to the API", () => {
            workflowPage.workflowEditRequest();
            workflowPage.clickDataCy("save-workflow-changes");
            workflowPage.assertPut();
        });
        it("Saving a workflow minimises the confirmation modal", () => {
            workflowPage.workflowEditRequest();
            workflowPage.clickDataCy("save-workflow-changes");
            workflowPage.assertPut();
        });
        it("If an 400 statusCode error is returned from the API, the error text is displayed at the top of the page", () => {
            workflowPage.workflowEditRequest();
            workflowPage.clickDataCy("save-workflow-changes");
            workflowPage.returnEditError();
            workflowPage.errorsDisplayed();
        });
        it("If a 400 status code is returned from the API, no toast should be displayed", () => {
            workflowPage.workflowEditRequest();
            workflowPage.clickDataCy("save-workflow-changes");
            workflowPage.returnEditError();
            workflowPage.assertNoToast();
        });
        it("A successful response takes you back to the workflow table page", () => {
            workflowPage.workflowEditRequest();
            workflowPage.clickDataCy("save-workflow-changes");
            workflowPage.returnSuccess();
            workflowPage.assertWorkflowsUrl();
        });
        it("A successful response displays a toast on the workflow table page letting the user know the edit was successful", () => {
            const successToast = "Workflow updated successfully";
            workflowPage.workflowEditRequest();
            workflowPage.clickDataCy("save-workflow-changes");
            workflowPage.returnSuccess();
            workflowPage.assertToast(successToast);
        });
    });

    describe("Add", () => {
        it("Selecting add on the workflow table page takes me to the 'Add a workflow' page", () => {
            workflowPage.clickDataCy("add-workflow");
            workflowPage.assertAddUrl();
        });
        it("Workflow editor is empty", () => {
            workflowPage.clickDataCy("add-workflow");
            workflowPage.assertNoText();
        });
        it("Adding incorrect json displays validation in the UI", () => {
            workflowPage.clickDataCy("add-workflow");
            workflowPage.assertJsonError();
        });
        it("When validation is triggered, save button is disabled", () => {
            workflowPage.clickDataCy("add-workflow");
            workflowPage.triggerJsonValidation();
            workflowPage.assertSaveStatus("disabled");
        });
        it("When validation is removed, save button is enabled", () => {
            workflowPage.clickDataCy("add-workflow");
            workflowPage.triggerJsonValidation();
            workflowPage.clearJson();
            workflowPage.assertSaveStatus("enabled");
        });
        it("Selecting save and then cancel on the modal keeps you on the editor page", () => {
            workflowPage.clickDataCy("add-workflow");
            workflowPage.clickDataCy("save-workflow-changes");
            workflowPage.clickDataCy("workflow-edit-confirm-cancel");
            workflowPage.assertAddUrl();
        });
        it("Selecting cancel and then cancel on the modal keeps you on the editor page", () => {
            workflowPage.clickDataCy("add-workflow");
            workflowPage.clickDataCy("discard-workflow-changes");
            workflowPage.clickDataCy("workflow-discard-confirm-cancel");
            workflowPage.assertAddUrl();
        });
        it("Selecting cancel and then confirm on the modal returns you to the workflow tables page", () => {
            workflowPage.clickDataCy("add-workflow");
            workflowPage.clickDataCy("discard-workflow-changes");
            workflowPage.clickDataCy("workflow-discard-confirm-ok");
            workflowPage.assertWorkflowsUrl();
        });
        it("Saving an added workflow sends a POST request to the API", () => {
            workflowPage.clickDataCy("add-workflow");
            workflowPage.clickDataCy("save-workflow-changes");
            workflowPage.assertPost();
        });
        it("If an error is returned from the API, the error text is displayed at the top of the page", () => {
            workflowPage.clickDataCy("add-workflow");
            workflowPage.clickDataCy("save-workflow-changes");
            workflowPage.returnAddError();
            workflowPage.errorsDisplayed();
        });
        it("If a 400 status code is returned from the API, no toast should be displayed", () => {
            workflowPage.clickDataCy("add-workflow");
            workflowPage.clickDataCy("save-workflow-changes");
            workflowPage.returnAddError();
            workflowPage.assertNoToast();
        });
        it("A successful response takes you back to the workflow table page", () => {
            workflowPage.clickDataCy("add-workflow");
            workflowPage.clickDataCy("save-workflow-changes");
            workflowPage.assertPost();
            workflowPage.assertWorkflowsUrl();
        });
        it("A successful response displays a toast on the workflow table page letting the user know the edit was successful", () => {
            const successToast = "Workflow created successfully";
            workflowPage.clickDataCy("add-workflow");
            workflowPage.clickDataCy("save-workflow-changes");
            workflowPage.assertPost();
            workflowPage.assertToast(successToast);
        });
    });
});

describe(" API errors", () => {
    const initError = "Something unexpected went wrong retrieving workflows";
    const deleteErrorMessage = "Something unexpected went wrong deleting the workflow";
    const getErrorMessage = "Something unexpected went wrong retrieving workflows";
    const putErrorMessage = "Something unexpected went wrong updating the workflow";
    const postErrorMessage = "Something unexpected went wrong creating the workflow";

    [400, 404, 500, 502].forEach((statusCode) => {
        it(`Toast displayed if a ${statusCode} error is returned on getting workflows`, () => {
            workflowPage.initPageError(statusCode);
            workflowPage.assertToast(initError);
        });
        it(`Toast displayed if a ${statusCode} error is returned on deleting existing workflow`, () => {
            workflowPage.initPage();
            workflowPage.clickDeleteButtonWorkflows(0);
            workflowPage.errorDeleteUser(workflowInitData, statusCode);
            workflowPage.assertToast(deleteErrorMessage);
        });
        it(`Toast displayed if a ${statusCode} error is returned on getting existing workflow`, () => {
            workflowPage.initPage();
            workflowPage.workflowEditRequestError(statusCode);
            workflowPage.assertToast(getErrorMessage);
        });
    });
    [404, 500, 502].forEach((statusCode) => {
        it(`Toast displayed if a ${statusCode} error is returned on editing a workflow`, () => {
            workflowPage.initPage();
            workflowPage.workflowEditRequest();
            workflowPage.clickDataCy("save-workflow-changes");
            workflowPage.returnEditToastError(workflowEmpty, statusCode);
            workflowPage.assertToast(putErrorMessage);
        });
        it(`UI message displayed if a ${statusCode} error is returned on adding a workflow`, () => {
            workflowPage.initPage();
            workflowPage.clickDataCy("add-workflow");
            workflowPage.clickDataCy("save-workflow-changes");
            workflowPage.returnErrorPost(statusCode);
            workflowPage.assertToast(postErrorMessage);
        });
    });
});
