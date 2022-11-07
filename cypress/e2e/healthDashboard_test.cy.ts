import { TaskData } from "../data/health-dashboard/issues";
import { ModelSummaryData } from "../data/health-dashboard/models";
import { ModelDetailsData } from "../data/health-dashboard/graph";
import { ExecStatistics } from "../data/health-dashboard/statistics";
import AdminHealthDashboardPage from "../pages/healthDashboard";
import { AbstractPage } from "pages/abstractPage";

const adminHealthPage = new AdminHealthDashboardPage();
const abstractPage = new AbstractPage();

describe.skip(`Admin health - Overview section`, () => {
    it(`when I pass in data with failed models,
    I can see the correct data and highlight around the model failure tile`, () => {
        adminHealthPage.initPage();
        adminHealthPage.assertCorrectHighlightAroundTile(ExecStatistics.FAILED_MODELS_DATA);
    });
    it(`when I pass in data with no failed models,
    I can see the correct data and highlight around the model failure tile`, () => {
        adminHealthPage.initPageWithNoFailedModels();
        adminHealthPage.assertCorrectHighlightAroundTile(ExecStatistics.NO_FAILED_MODELS_DATA);
    });
    it(`I can see the correct data returned from the API for the overview section`, () => {
        adminHealthPage.initPage();
        adminHealthPage.assertOverviewModelDataCorrect(ExecStatistics.FAILED_MODELS_DATA);
    });
});

describe(`Admin health - Issues table section`, () => {
    beforeEach(() => {
        adminHealthPage.initPage();
        cy.injectAxe();
    });
    it(`I can view the task data in the issues table`, () => {
        adminHealthPage.assertTableDataCorrect(TaskData.TASK_DATA_1);
        adminHealthPage.assertTableDataCorrect(TaskData.TASK_DATA_2);
    });
    it(`I can select all and unselect all issues`, () => {
        adminHealthPage.selectAllIssues();
        adminHealthPage.assertCheckboxesSelected();
        adminHealthPage.unselectAllIssues();
        adminHealthPage.assertCheckboxesUnselected();
    });
    it(`I can view a task's execution logs`, () => {
        adminHealthPage.assertLogsDisplayed(TaskData.TASK_DATA_1);
    });
    it(`I am able to remove individual issues by clicking the dismiss button on each task`, () => {
        adminHealthPage.assertTaskCanBeDismissed(TaskData.TASK_DATA_1);
        abstractPage.assertToast(`You have successfully dismissed 1 task.`);
    });
    it.skip(`I am able to dismiss all selected issues by clicking the 'Dismiss selected' button`, () => {
        adminHealthPage.selectAllIssues();
        adminHealthPage.selectDismissSelectedButton();
        adminHealthPage.selectCancelValidation();
        adminHealthPage.selectDismissSelectedButton();
        adminHealthPage.selectOKValidation();
        adminHealthPage.assertNoIssues();
        abstractPage.assertToast(`You have successfully dismissed 5 tasks.`);
    });
    it(`I am unable to dismiss a task when there is an error`, () => {
        adminHealthPage.assertDismisalOfTaskFailure(TaskData.TASK_DATA_1);
        abstractPage.assertToast(`Something unexpected went wrong with your dismissal request!`);
    });

    it(`I cannot click the 'Dismiss selected' button if no issues have been selected`, () => {
        adminHealthPage.AssertDismissButtonUnclickable();
    });
});

describe.skip(`Admin health - Graph section`, () => {
    beforeEach(() => {
        adminHealthPage.initPage();
        cy.injectAxe();
    });
    const tuple = [
        [ModelSummaryData.MODEL_ASDA, 0, `Asda`],
        [ModelSummaryData.MODEL_BANANA, 1, `Banana`],
        [ModelSummaryData.MODEL_CRAYON, 2, `Crayon`],
    ];
    tuple.forEach(($type) => {
        const [model_data, test_name] = $type;
        it(`I can view the ${test_name} model from the dropdown`, () => {
            adminHealthPage.assertModelsVisible(model_data as ModelSummaryData);
        });
    });
    const tuple2 = [
        [ModelDetailsData.MODEL_DETAILS_ASDA, 0, `Asda`],
        [ModelDetailsData.MODEL_DETAILS_BANANA, 1, `Banana`],
        [ModelDetailsData.MODEL_DETAILS_CRAYON, 2, `Crayon`],
    ];
    tuple2.forEach(($type) => {
        const [modelDetails_data, model_array_order, test_name] = $type;
        it(`I can view the correct model statistics for the ${test_name} model`, () => {
            adminHealthPage.assertModelDataDisplayed(
                modelDetails_data as ModelDetailsData,
                model_array_order as number,
            );
        });
    });
});

describe(`Admin health - API errors`, () => {
    const text = "Something unexpected went wrong retrieving executions!";
    const dismissalText = "Something unexpected went wrong with your dismissal request!";
    [400, 404, 500].forEach((error_code) => {
        it.skip(`Toast displayed on an overview GET request when a ${error_code} status is returned`, () => {
            adminHealthPage.initPageOverviewApiErrors(error_code as number);
            adminHealthPage.assertLatestErrorContainsMessage(text);
        });
        it(`Toast displayed on an issues/tasks GET request when a ${error_code} status is returned`, () => {
            adminHealthPage.initPageIssuesApiErrors(error_code as number);
            adminHealthPage.assertLatestErrorContainsMessage(text);
        });
        it(`Toast displayed on a task dismissal request when a ${error_code} status is returned`, () => {
            adminHealthPage.initPage();
            adminHealthPage.assertDismisalOfTaskFailure(TaskData.TASK_DATA_1);
            abstractPage.assertToast(dismissalText);
        });
        it.skip(`Toast displayed on a models section GET request when a ${error_code} status is returned`, () => {
            adminHealthPage.initPageModelsApiErrors(error_code as number);
            adminHealthPage.assertLatestErrorContainsMessage(text);
        });
        it.skip(`Toast displayed on a model statistics GET request when a ${error_code} status is returned`, () => {
            adminHealthPage.initPageModelStatisticsApiErrors(error_code as number);
            adminHealthPage.assertLatestErrorContainsMessage(text);
        });
    });
});
