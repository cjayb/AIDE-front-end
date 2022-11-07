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
    const tuple = [
        [TaskData.TASK_DATA_1, `Task 1`],
        [TaskData.TASK_DATA_2, `Task 2`],
        [TaskData.TASK_DATA_3, `Task 3`],
        [TaskData.TASK_DATA_4, `Task 4`],
        [TaskData.TASK_DATA_5, `Task 5`],
    ];
    tuple.forEach(($type) => {
        const [task_data, test_name] = $type;
        it(`I can view the data returned by the API for ${test_name} in the Issues table`, () => {
            adminHealthPage.assertTableDataCorrect(task_data as TaskData);
        });
    });

    it(`I can tick the 'Select all' checkbox to select all issues`, () => {
        adminHealthPage.selectAllIssues();
        adminHealthPage.assertCheckboxesSelected();
    });
    it(`I can un-tick the 'Select all' checkbox to unselect all issues`, () => {
        adminHealthPage.selectAllIssues();
        adminHealthPage.unselectAllIssues();
        adminHealthPage.assertCheckboxesUnselected();
    });

    const tuple2 = [
        [`1`, TaskData.TASK_DATA_1, `task ID`],
        [`041293d0-ab97-4ea1-b967-42ec62f26111`, TaskData.TASK_DATA_1, `payload ID`],
        [`Test model 2`, TaskData.TASK_DATA_2, `model name`],
        [`Dr Joseph Batts`, TaskData.TASK_DATA_3, `patient name`],
        [`111235999`, TaskData.TASK_DATA_4, `patient ID`],
        [`31`, TaskData.TASK_DATA_5, `execution data/time`],
    ];
    tuple2.forEach(($type) => {
        const [search_text, task_data, test_name] = $type;
        it.skip(`Using the search field I can search for a specific ${test_name}`, () => {
            adminHealthPage.searchIssuesTable(search_text as string);
            adminHealthPage.assertCorrectTaskReturned(task_data as TaskData);
        });
    });
    it.skip(`I can view a task's execution logs`, () => {
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
    it(`I am unable to dismiss a task when there is a error`, () => {
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

describe.skip(`Admin health - API errors`, () => {
    const text = "Something unexpected went wrong retrieving executions!";
    const tuple = [
        [400, "400"],
        [404, "404"],
        [500, "500"],
        [502, "502"],
        [301, "301"],
    ];
    tuple.forEach(($type) => {
        const [error_code, title] = $type;
        it(`Error is displayed during an overview section request when the API returns a ${title} error code`, () => {
            adminHealthPage.initPageOverviewApiErrors(error_code as number);
            adminHealthPage.assertLatestErrorContainsMessage(text);
        });
        it(`Error is displayed during a tasks section request when the API returns a ${title} error code`, () => {
            adminHealthPage.initPageIssuesApiErrors(error_code as number);
            adminHealthPage.assertLatestErrorContainsMessage(text);
        });
        it(`Error is displayed during a models section request when the API returns a ${title} error code`, () => {
            adminHealthPage.initPageModelsApiErrors(error_code as number);
            adminHealthPage.assertLatestErrorContainsMessage(text);
        });
        it(`Error is displayed during a model statistics request when the API returns a ${title} error code`, () => {
            adminHealthPage.initPageModelStatisticsApiErrors(error_code as number);
            adminHealthPage.assertLatestErrorContainsMessage(text);
        });
        it(`Error is displayed during a task dismisal when the API returns a ${title} error code`, () => {
            adminHealthPage.initPageModelsApiErrors(error_code as number);
            adminHealthPage.assertLatestErrorContainsMessage(text);
        });
    });
});
