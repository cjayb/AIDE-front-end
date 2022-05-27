/// <reference types="cypress" />

import { ExecStatistics } from "../data/executionStatistics";
import { TaskData } from "../data/tasks";
import { LogData } from "../data/logs";
import AdminDashboardPage from "../pages/adminDashboard2";
import { nodeTerminal, a11yConfig } from "utils/a11y_util";

const adminPage = new AdminDashboardPage();

describe(`Admin health - Overview section`, () => {
    beforeEach(() => {
        cy.injectAxe();
    });
    it(`when I pass in data with failed models,
    I can see the correct data and highlight around the model failure tile`, () => {
        cy.checkA11y(null, a11yConfig, nodeTerminal, true);
        adminPage.initPage();
        adminPage.assertOverviewModelDataCorrect(ExecStatistics.FAILED_MODELS_DATA);
        adminPage.assertCorrectHighlightAroundTile(ExecStatistics.FAILED_MODELS_DATA);
    });
    it(`when I pass in data with no failed models,
        I can see the correct data and highlight around the model failure tile`, () => {
        cy.checkA11y(null, a11yConfig, nodeTerminal, true);
        adminPage.initPageWithNoFailedModels();
        adminPage.assertOverviewModelDataCorrect(ExecStatistics.NO_FAILED_MODELS_DATA);
        adminPage.assertCorrectHighlightAroundTile(ExecStatistics.NO_FAILED_MODELS_DATA);
    });
});

describe(`Admin health - Issues table`, () => {
    beforeEach(() => {
        adminPage.initPage();
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
        it(`I can view ${test_name} with its correct data`, () => {
            adminPage.assertTableDataCorrect(task_data as TaskData);
        });
    });

    it(`I can tick the 'Select all' checkbox to select all tasks`, () => {
        adminPage.selectAllTasks();
        adminPage.assertCheckboxesSelected();
    });
    it(`I can un-tick the 'Select all' checkbox to unselect all tasks`, () => {
        adminPage.selectAllTasks();
        adminPage.unselectAllTasks();
        adminPage.assertCheckboxesUnselected();
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
        it(`Using the search field I can search for a task that contains a ${test_name}`, () => {
            adminPage.searchIssuesTable(search_text as string);
            adminPage.assertCorrectTaskReturned(task_data as TaskData);
        });
    });
    it(`I can view a task's execution logs`, () => {
        adminPage.assertLogsDisplayed(TaskData.TASK_DATA_1, LogData.LOG_DATA_1);
    });
    it(`I am able to remove individual tasks by clicking the dismiss button on each task`, () => {
        adminPage.assertTaskCanBeDismissed(TaskData.TASK_DATA_1);
    });
    it(`I am able to dismiss all selected tasks by clicking the 'Dismiss selected' button`, () => {
        adminPage.selectAllTasks();
        adminPage.selectDismissSelectedButton();
        adminPage.selectCancelValidation();
        adminPage.selectDismissSelectedButton();
        adminPage.selectOKValidation();
        adminPage.assertNoTasks();
    });
    it(`I cannot click the 'Dismiss selected' button if no tasks have been selected`, () => {
        adminPage.AssertDismissButtonUnclickable();
    });
});

// describe(`Admin health - Graph`, () => {
//     beforeEach(() => {
//         adminPage.initPage();
//         cy.injectAxe();
//     });
//     it(`I can view all the active models from the drop down`),
//         () => {
//             adminPage.assertModelsVisible();
//         };
// });

// describe(`Admin health - API error`, () => {
//     beforeEach(() => {
//         adminPage.initPage();
//         cy.injectAxe();
//     });
//     it(`Error is displayed in the UI when 400 is returned from the API`),
//         () => {
//             adminPage.assertModelsVisible();
//         };
// });
