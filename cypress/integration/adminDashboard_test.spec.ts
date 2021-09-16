/// <reference types="cypress" />

import { Model } from "../../src/models/Model";
import { ModelData } from "../data/model";
import { ModelTableColumn } from "../data/modelTableColumn";
import ApiMocks from "../fixtures/mockIndex";
import AdminDashboardPage from "../pages/adminDashboard";

const adminPage = new AdminDashboardPage();
const noMatchingRecords = "No matching records found"

describe("Admin dashboard page", () => {
    beforeEach(() => {
        adminPage.initPage();
        // TODO: Once weekly and monthly filters are available, add tests for them here
    })

    it("On the admin page I can free text search to change model view", () => {
        adminPage.searchDashboard("ch")
        adminPage.assertTableContainsModel(ModelData.CH_MODEL_1.model_name);
        adminPage.assertTableContainsModel(ModelData.CH_MODEL_2.model_name);
        adminPage.searchDashboard("3000");
        adminPage.assertTableContainsModel(ModelData.HAEMORRHAGE_STROKE.model_name);
        adminPage.searchDashboard("xyz");
        adminPage.assertTableContainsModel(noMatchingRecords);
    })


    it("On the admin page I can sort the model entries", () => {
        adminPage.sortModelTable(ModelTableColumn.EXECUTIONS);
        adminPage.sortModelTable(ModelTableColumn.EXECUTIONS);
        adminPage.assertModelEntryContainsText(1, "1000");
        adminPage.searchDashboard("3000");
        adminPage.assertTableContainsModel(ModelData.HAEMORRHAGE_STROKE.model_name);
        adminPage.searchDashboard("");
        adminPage.sortModelTable(ModelTableColumn.FAILURES);
        adminPage.assertModelEntryContainsText(1, "36")
    });

    it("On the admin page I can view a specific model's details", () => {
        adminPage.toggleModelRowWithName(ModelData.HAEMORRHAGE_BRUSH.model_name);
        // TODO: Check fields in execution row
    });

    it("On the admin page I can view the execution log", () => {
        adminPage.toggleModelRowWithName(ModelData.HAEMORRHAGE_BRUSH.model_name);
        adminPage.showLogsForExecution(2);
        adminPage.assertExecutionLogs(ApiMocks.EXECUTION_LOGS[0].msg)
    });

    it("On the admin page I can view the execution pipeline", () => {
        adminPage.toggleModelRowWithName(ModelData.HAEMORRHAGE_BRUSH.model_name);
        adminPage.showPipelineForExecution(2);
        adminPage.assertPipelineContainsModel(new ModelData(<Model>ApiMocks.ADMIN_DASH_PIPELINES_MODEL_1[0].model).model_name);
    });


    it("A failing API call produces an error in the UI", () => {
        cy.intercept("/executions?*", { statusCode: 404 }).as("Executions not found");
        //Wait for other error messages to disappear from the DOM
        cy.get('[class=v-toast__text]').should("not.exist");
        adminPage.toggleModelRowWithName(ModelData.HAEMORRHAGE_BRUSH.model_name);
        cy.wait("@Executions not found")
        adminPage.assertLatestErrorContainsMessage("Something unexpected went wrong retrieving executions!");
    })
})
