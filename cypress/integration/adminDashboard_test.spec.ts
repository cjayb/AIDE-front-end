/// <reference types="cypress" />

import { ModelTableColumn } from "../data/modelTableColumn";
import ApiMocks from "../fixtures/mockIndex";
import AdminDashboardPage from "../pages/adminDashboard";

const adminPage = new AdminDashboardPage();
const chModel1 = "ch_test_model_1";
const chModel2 = "ch_test_model_2";
const haemorrhageStroke = "Haemorrhage-Stroke";
const noMatchingRecords = "No matching records found"

describe("Admin dashboard page", () => {
    beforeEach(() => {
        adminPage.initPage();
        // TODO: Once weekly and monthly filters are available, add tests for them here
    })

    it("On the admin page I can free text search to change model view", () => {
        adminPage.searchDashboard("ch")
        adminPage.assertTableContainsModel(chModel1);
        adminPage.assertTableContainsModel(chModel2);
        adminPage.searchDashboard("3000");
        adminPage.assertTableContainsModel(haemorrhageStroke);
        adminPage.searchDashboard("xyz");
        adminPage.assertTableContainsModel(noMatchingRecords);
    })


    it("On the admin page I can sort the model entries", () => {
        adminPage.sortModelTable(ModelTableColumn.EXECUTIONS);
        adminPage.sortModelTable(ModelTableColumn.EXECUTIONS);
        adminPage.assertModelEntryContainsText(1, "1000");
        adminPage.searchDashboard("3000");
        adminPage.assertTableContainsModel(haemorrhageStroke);
        adminPage.searchDashboard("");
        adminPage.sortModelTable(ModelTableColumn.FAILURES);
        adminPage.assertModelEntryContainsText(1, "36")
    });

    it("On the admin page I can view a specific model's details", () => {
        adminPage.toggleModelRowWithName(AdminDashboardPage.MODEL_1_NAME);
        // TODO: Check fields in execution row
    });

    it("On the admin page I can view the execution log", () => {
        adminPage.toggleModelRowWithName(AdminDashboardPage.MODEL_1_NAME);
        adminPage.showLogsForExecution(2);
        adminPage.assertExecutionLogs(ApiMocks.EXECUTION_LOGS[0].msg)
    });

    it("On the admin page I can view the execution pipeline", () => {
        adminPage.toggleModelRowWithName(AdminDashboardPage.MODEL_1_NAME);
        adminPage.showPipelineForExecution(2);
        adminPage.assertPipelineContainsModel(ApiMocks.ADMIN_DASH_PIPELINES_MODEL_1[0].model.model_name)
    });
})
