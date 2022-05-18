/// <reference types="cypress" />

import { ExecStatistics } from "data/ExecutionStatistics";
// import { TaskData } from "data/tasks"
import AdminDashboardPage from "../pages/adminDashboard2";
import { nodeTerminal, a11yConfig } from "utils/a11y_util";

const adminPage = new AdminDashboardPage();
const noMatchingRecords = "No matching records found"

describe.only("Admin health - Overview", () => {
    beforeEach(() => {
        cy.injectAxe()
    })

    it("Tiles in overview appear correctly when failed models reported", () => {
        cy.checkA11y(null, a11yConfig, nodeTerminal, true);
        adminPage.initPage();
        adminPage.assertOverviewModelDataCorrect(ExecStatistics.FAILED_MODELS_DATA);
        adminPage.assertCorrectHighlightAroundModelsFailureTile(ExecStatistics.FAILED_MODELS_DATA);
    })

    it("Tiles in overview appear correctly when no failed models reported", () => {
        cy.checkA11y(null, a11yConfig, nodeTerminal, true);
        adminPage.initPageWithoutModelFail();
        adminPage.assertOverviewModelDataCorrect(ExecStatistics.NO_FAILED_MODELS_DATA);
        adminPage.assertCorrectHighlightAroundModelsFailureTile(ExecStatistics.NO_FAILED_MODELS_DATA);
    })
})

//     describe("Admin health - Issues", () => {
//         beforeEach(() => {
//             adminPage.initPage();
//             cy.injectAxe()
//         })
//     it("Data in issues table appears correctly", () => {
//         cy.checkA11y(null, a11yConfig, nodeTerminal, true);
//         adminPage.assertTableDataCorrect(TaskData.TASK_DATA);
//     })

//     it("Task logs are displayed", () => {
//         cy.checkA11y(null, a11yConfig, nodeTerminal, true);
//         adminPage.assertLogsDisplayed();
//     })
// })


