/// <reference types="cypress" />

import { Model } from "../../src/models/Model";
import { ExecutionData } from "../data/execution";
import { ModelData } from "../data/model";
import { ModelTableColumn } from "../data/modelTableColumn";
import ApiMocks from "../fixtures/mockIndex";
import AdminDashboardPage from "../pages/adminDashboard";
import { ExecutionStatData } from "../data/executionStat";
import { nodeTerminal, a11yConfig } from "utils/a11y_util";

const adminPage = new AdminDashboardPage();
const noMatchingRecords = "No matching records found"

describe("Admin dashboard page", () => {
    beforeEach(() => {
        adminPage.initPage();
        cy.injectAxe()
        // TODO: Once weekly and monthly filters are available, add tests for them here
    })

    it("On the admin page I can free text search to change model view", () => {
        cy.checkA11y(null, a11yConfig, nodeTerminal, true);
        adminPage.searchDashboard("ch")
            .assertTableContainsModel(ModelData.CH_MODEL_1.model_name)
            .assertTableContainsModel(ModelData.CH_MODEL_2.model_name)
            .searchDashboard("3000")
            .assertTableContainsModel(ModelData.HAEMORRHAGE_STROKE.model_name)
            .searchDashboard("xyz")
            .assertTableContainsModel(noMatchingRecords);
    })

    it("On the admin page I can sort the model entries", () => {
        adminPage.sortModelTable(ModelTableColumn.EXECUTIONS)
            .sortModelTable(ModelTableColumn.EXECUTIONS)
            .assertModelEntryContainsText(1, "4002")
            .searchDashboard("3000")
            .assertTableContainsModel(ModelData.HAEMORRHAGE_STROKE.model_name)
            .searchDashboard("")
            .sortModelTable(ModelTableColumn.FAILURES)
            .assertModelEntryContainsText(1, "36");
    });

    it("On the admin page I can view a specific model's execution details", () => {
        //Model row data
        adminPage.assertModelRow(3, ModelData.HAEMORRHAGE_BRUSH, ExecutionStatData.MODEL_1_STATS);

        //Execution row data
        adminPage.toggleModelRowWithName(ModelData.HAEMORRHAGE_BRUSH.model_name);
        cy.dataCy("execution-table").find("table").should("not.contain.text", "Loading... Please wait");
        adminPage.assertExecutionRow(1, ExecutionData.FIRST_EXECUTION_MODEL_1);
        cy.checkA11y(null, a11yConfig, nodeTerminal, true);
    });

    it("On the admin page I can view the execution log", () => {
        adminPage.toggleModelRowWithName(ModelData.HAEMORRHAGE_BRUSH.model_name)
            .showLogsForExecution(2)
            .assertExecutionLogs(ApiMocks.EXECUTION_LOGS[0].msg);
        cy.checkA11y(null, a11yConfig, nodeTerminal, true);
    });

    it("On the admin page I can view the execution pipeline", () => {
        adminPage.toggleModelRowWithName(ModelData.HAEMORRHAGE_BRUSH.model_name)
            .showPipelineForExecution(2)
            .assertPipelineContainsModel(new ModelData(<Model>ApiMocks.ADMIN_DASH_PIPELINES_MODEL_1[0].model).model_name);
        cy.checkA11y(null, a11yConfig, nodeTerminal, true);
    });


    it("A failing API call produces an error in the UI", () => {
        cy.intercept("/executions?*", { statusCode: 400 }).as("Executions not found");
        adminPage.toggleModelRowWithName(ModelData.HAEMORRHAGE_BRUSH.model_name);
        cy.wait("@Executions not found")
        adminPage.assertLatestErrorContainsMessage("Something unexpected went wrong retrieving executions!");
    })
})
