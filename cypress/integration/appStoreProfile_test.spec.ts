/// <reference types="cypress" />

import AppProfilePage from "pages/appProfilePage";
import { AppProfileData } from "data/appProfile";
import ApiMocks from "fixtures/mockIndex";
import scrollToBottom from "scroll-to-bottomjs";

const appProfilePage = new AppProfilePage();

describe("App profile page version 1 ", () => {
    beforeEach(() => {
        appProfilePage.initPage();
        cy.injectAxe();
    });

    it("displays application version 1 details correctly", () => {
        return appProfilePage.assertAppDetails(AppProfileData.APPLICATION_DETAILS1);
    });

    it("asserts version is selected and displayed", () => {
        appProfilePage.assertVersion(AppProfileData.APPLICATION_DETAILS1);
    });

    it("asserts system requirements are displayed correctly", () => {
        appProfilePage.assertSystemRequirements(AppProfileData.APPLICATION_DETAILS1);
    });

    it.only("A Percy screenshot test for the application profile page1", () => {
        cy.percySnapshot("Application Profile Page1");
        cy.dataCy(AppProfilePage.DETAIL_SUB_MODULE).percySnapshotElement(
            "Application Profile details",
        );
    });
});
describe("application page with version 2", () => {
    const application_id = "54b43bb7-8f93-450a-9e9d-2f72b3d90d61";
    const application_version_id = "66d62991-f1f2-4027-a6fa-03e3bb9c4833";
    beforeEach(() => {
        cy.injectAxe();
        cy.intercept(
            `/app_store/api/applications/${application_id}?application_version_id=${application_version_id}`,
            ApiMocks.APP_PROFILE_PAGE2,
        ).as("appProfile");
        cy.visit(
            `/#/application-repository/${application_id}?application_version_id=${application_version_id}`,
        );
        cy.wait("@appProfile");
        Cypress.on("uncaught:exception", (err, runnable) => {
            //TODO: Remove this once uncaught exceptions have been removed
            return false;
        });
    });
    it("displays application details with different sets of data", () => {
        appProfilePage.assertAppDetails(AppProfileData.APPLICATION_DETAILS2);
    });

    it("asserts version is selected and displayed", () => {
        appProfilePage.assertVersion(AppProfileData.APPLICATION_DETAILS2);
    });

    it("asserts system requirements are displayed correctly", () => {
        appProfilePage.assertSystemRequirements(AppProfileData.APPLICATION_DETAILS2);
    });

    it("A Percy screenshot test for the application profile page2", () => {
        cy.window().then((cyWindow) => scrollToBottom({ timing: 20, remoteWindow: cyWindow }));
        cy.percySnapshot("Application Profile Page2");
    });
});
describe("Error codes on app store profile page", () => {
    const application_id = "9e5d4728-e73d-4ef1-ac56-69f682453316";
    const application_version_id = "667fc4a4-b568-4e3a-b46f-cd06773c9239";
    beforeEach(() => {
        cy.injectAxe();
        Cypress.on("uncaught:exception", (err, runnable) => {
            //TODO: Remove this once uncaught exceptions have been removed
            return false;
        });
    });
    it("Application not found and gives 404 status code", () => {
        cy.intercept(
            `/app_store/api/applications/${application_id}?application_version_id=${application_version_id}`,
            { statusCode: 404 },
        ).as("fourHundredFour");
        cy.visit(
            `/#/application-repository/${application_id}?application_version_id=${application_version_id}`,
        );
        cy.wait("@fourHundredFour");
        appProfilePage.assertLatestErrorContainsMessage(
            "Something unexpected went wrong retrieving application!",
        );
    });

    it("500 error code is handling gratefully", () => {
        cy.intercept(
            `/app_store/api/applications/${application_id}?application_version_id=${application_version_id}`,
            { statusCode: 500 },
        ).as("fiveHundred");
        cy.visit(
            `/#/application-repository/${application_id}?application_version_id=${application_version_id}`,
        );
        cy.wait("@fiveHundred");
        appProfilePage.assertLatestErrorContainsMessage(
            "Something unexpected went wrong retrieving application!",
        );
    });
    it("Application profile page handles 400 error code", () => {
        cy.intercept(
            `/app_store/api/applications/${application_id}?application_version_id=${application_version_id}`,
            { statusCode: 400 },
        ).as("fourHundred");
        cy.visit(
            `/#/application-repository/${application_id}?application_version_id=${application_version_id}`,
        );
        cy.wait("@fourHundred");
        appProfilePage.assertLatestErrorContainsMessage(
            "Something unexpected went wrong retrieving application!",
        );
    });

    it("Application profile page handles 403 error code", () => {
        cy.intercept(
            `/app_store/api/applications/${application_id}?application_version_id=${application_version_id}`,
            { statusCode: 403 },
        ).as("fourHundredThree");
        cy.visit(
            `/#/application-repository/${application_id}?application_version_id=${application_version_id}`,
        );
        cy.wait("@fourHundredThree");
        appProfilePage.assertLatestErrorContainsMessage(
            "Something unexpected went wrong retrieving application!",
        );
    });
});
