/// <reference types="cypress" />


import { TaskData } from "../data/issues";
import { LogData } from "../data/logs";
import { ModelSummaryData } from "../data/models";
import { ModelDetailsData } from "../data/graph";
import { ExecStatistics } from "../data/statistics";
import { nodeTerminal, a11yConfig } from "utils/a11y_util";
import AdminPayloadDashboardPage from "pages/adminPayloadDashboard";
import AdminHealthDashboardPage from "../pages/adminHealthDashboard";
import { PayloadData } from "data/payloadTable";

const adminHealthPage = new AdminHealthDashboardPage();
const adminPayloadPage = new AdminPayloadDashboardPage();

describe(`Admin health - Overview section`, () => {
    beforeEach(() => {
        cy.injectAxe();
    });
    it(`when I pass in data with failed models,
    I can see the correct data and highlight around the model failure tile`, () => {
        cy.checkA11y(null, a11yConfig, nodeTerminal, true);
        adminHealthPage.initPage();
        adminHealthPage.assertCorrectHighlightAroundTile(ExecStatistics.FAILED_MODELS_DATA);
    });
    it(`when I pass in data with no failed models,
        I can see the correct data and highlight around the model failure tile`, () => {
        cy.checkA11y(null, a11yConfig, nodeTerminal, true);
        adminHealthPage.initPageWithNoFailedModels();
        adminHealthPage.assertCorrectHighlightAroundTile(ExecStatistics.NO_FAILED_MODELS_DATA);
    });
    it(`I can see the correct data returned from the API for the overview section`, () => {
        cy.checkA11y(null, a11yConfig, nodeTerminal, true);
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
        [`Test model 2`, TaskData.TASK_DATA_2, `model name`],
        [`Dr Joseph Batts`, TaskData.TASK_DATA_3, `patient name`],
        [`111235999`, TaskData.TASK_DATA_4, `patient ID`],
        [`31`, TaskData.TASK_DATA_5, `execution data/time`],
    ];
    tuple2.forEach(($type) => {
        const [search_text, task_data, test_name] = $type;
        it(`Using the search field I can search for a specific ${test_name}`, () => {
            adminHealthPage.searchIssuesTable(search_text as string);
            adminHealthPage.assertCorrectTaskReturned(task_data as TaskData);
        });
    });
    it(`I can view a task's execution logs`, () => {
        adminHealthPage.assertLogsDisplayed(TaskData.TASK_DATA_1, LogData.LOG_DATA_1);
    });
    it(`I am able to remove individual issues by clicking the dismiss button on each task`, () => {
        adminHealthPage.assertTaskCanBeDismissed(TaskData.TASK_DATA_1);
    });
    it(`I am able to dismiss all selected issues by clicking the 'Dismiss selected' button`, () => {
        adminHealthPage.selectAllIssues();
        adminHealthPage.selectDismissSelectedButton();
        adminHealthPage.selectCancelValidation();
        adminHealthPage.selectDismissSelectedButton();
        adminHealthPage.selectOKValidation();
        adminHealthPage.assertNoIssues();
    });
    it(`I cannot click the 'Dismiss selected' button if no issues have been selected`, () => {
        adminHealthPage.AssertDismissButtonUnclickable();
    });
});

describe(`Admin health - Graph section`, () => {
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
        const [model_data, model_array_order, test_name] = $type;
        it(`I can view the ${test_name} model from the dropdown`, () => {
            adminHealthPage.assertModelsVisible(model_data as ModelSummaryData, model_array_order as number);
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
            adminHealthPage.assertModelDataDisplayed(modelDetails_data as ModelDetailsData, model_array_order as number);
        });
    });
    // it.only(`When I first access the admin page the default date selected
    // on the graph starts
    //  7 days ago and ends today`, () => {
    //     adminHealthPage.assertDatesCorrect(ModelDetailsData.MODEL_DETAILS_BANANA, 1)
    // })
});

describe(`Admin health - API errors`, () => {
    const text = "Something unexpected went wrong retrieving executions!"

    it(`Error is displayed in the UI when the API returns no overview data`, () => {
        adminHealthPage.initPageOverviewApiErrors();
        adminHealthPage.assertLatestErrorContainsMessage(text);
    });
    it(`Error is displayed in the UI when the API returns no task data`, () => {
        adminHealthPage.initPageIssuesApiErrors();
        adminHealthPage.assertLatestErrorContainsMessage(text);
    });
    it(`Error is displayed in the UI when the API returns no Model data`, () => {
        adminHealthPage.initPageModelsApiErrors();
        adminHealthPage.assertLatestErrorContainsMessage(text);
    });
    it(`Error is displayed in the UI when the API returns no Model statistics data`, () => {
        adminHealthPage.initPageModelStatisticsApiErrors();
        adminHealthPage.assertLatestErrorContainsMessage(text);
    });
});

describe(`Admin Payload - Table`, () => {
    beforeEach(() => {
        adminPayloadPage.initPagePayload();
        cy.injectAxe();
    });
    const tuple = [
        [PayloadData.PAYLOAD_DATA_1, `Payload 1`],
        [PayloadData.PAYLOAD_DATA_2, `Payload 2`],
        [PayloadData.PAYLOAD_DATA_3, `Payload 3`],
        [PayloadData.PAYLOAD_DATA_4, `Payload 4`],
        [PayloadData.PAYLOAD_DATA_5, `Payload 5`]
    ];
    tuple.forEach(($type) => {
        const [payload_data, test_name] = $type;
        it(`I can view the data returned by the API for ${test_name} in the Payload table`, () => {
            adminPayloadPage.assertTableDataCorrect(payload_data as PayloadData);
        });
    });
    const tuple2 = [
        [`1`, PayloadData.PAYLOAD_DATA_1, `Payload ID`],
        [`Louiza Van-Der-Varintaford`, PayloadData.PAYLOAD_DATA_2, `patient name`],
        [`423 323 2235`, PayloadData.PAYLOAD_DATA_3, `patient ID`],
        [`2022-05-26 08:05 AM`, PayloadData.PAYLOAD_DATA_5, `execution data/time`],
    ];
    tuple2.forEach(($type) => {
        const [search_text, payload_data, test_name] = $type;
        it(`Using the search field I can search for a specific ${test_name}`, () => {
            adminPayloadPage.searchIssuesTable(search_text as string);
            adminPayloadPage.assertCorrectTaskReturned(payload_data as PayloadData);
        });
    });
});

describe.skip(`Admin Payload - Tree`, () => {
    const tuple = [
        [PayloadData.PAYLOAD_DATA_1, `Payload 1`],
        [PayloadData.PAYLOAD_DATA_2, `Payload 2`],
        [PayloadData.PAYLOAD_DATA_3, `Payload 3`],
        [PayloadData.PAYLOAD_DATA_4, `Payload 4`],
        [PayloadData.PAYLOAD_DATA_5, `Payload 5`]
    ];
    tuple.forEach(($type) => {
        const [payload_data, test_name] = $type;
        it(`Return ${test_name} to manually check tree`, () => {
            adminPayloadPage.initPagePayload();
            adminPayloadPage.expandAndViewPayload(payload_data as PayloadData);
        })
    });
})
