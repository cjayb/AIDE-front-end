/// <reference types="cypress" />

import appStorePage from "../pages/appStore";
import { ApplicationData } from "../data/application";
import { nodeTerminal, a11yConfig } from "utils/a11y_util";
import scrollToBottom from "scroll-to-bottomjs";
import AppStorePage from "../pages/appStore";
import Order from "data/enums/order";

const appPage = new appStorePage();

describe("App Store Page", () => {
    beforeEach(() => {
        appPage.initPage();
        cy.injectAxe();
    });

    it("A user can access the app store via the button", () => {
        cy.checkA11y(null, a11yConfig, nodeTerminal, true);
        cy.visit("/#/clinical-review/");
        appPage.clickAppStoreButton().assertAppStorePageShows();
    });

    it("A Percy screenshot test for the application table", () => {
        cy.window().then((cyWindow) => scrollToBottom({ timing: 20, remoteWindow: cyWindow }));
        cy.percySnapshot("Application Table");
    });

    it("An app missing an image displays correctly", () => {
        appPage.assertApp(ApplicationData.MISSING_IMAGE_APP);
    });

    it("An app with a CE logo displays correctly", () => {
        appPage.assertApp(ApplicationData.CE_APP);
    });

    it("An app with a UKCA logo displays correctly", () => {
        appPage.assertApp(ApplicationData.UKCA_APP);
    });

    it("An app with a FDA logo displays correctly", () => {
        appPage.assertApp(ApplicationData.FDA_APP);
    });

    it("An app with specialties displays correctly", () => {
        appPage.assertApp(ApplicationData.SPECIALITY_APP);
    });

    it("A long short description is shortened with ellipses", () => {
        appPage.assertApp(ApplicationData.LONG_DESCRIPTION_APP);
    });

    it("A speciality filtered app displays correctly", () => {
        appPage.clickDropdown(AppStorePage.MEDICAL_SPECIALITY_FILTER, "unique");
        appPage.assertApp(ApplicationData.UNIQUE_SPECIALITY_APP);
        cy.dataCy(AppStorePage.APPLICATION_CARD).should("have.length", 1);
    });

    it("A sorted app list displays correctly", () => {
        appPage.assertAlphabeticalOrdering(Order.Ascending);
        appPage.assertAlphabeticalOrdering(Order.Descending);
    });

    it("A text searched app displays correctly", () => {
        const searchedApp = ApplicationData.UNIQUE_SPECIALITY_APP;
        cy.dataCy(AppStorePage.SEARCH_APPLICATION_REPOSITORY).type(searchedApp.name);
        appPage.assertApp(searchedApp);
        cy.dataCy(AppStorePage.APPLICATION_CARD).should("have.length", 1);
    });
});

describe("Error codes on app store page", () => {
    beforeEach(() => {
        cy.injectAxe();
        Cypress.on("uncaught:exception", (err, runnable) => {
            //TODO: Remove this once uncaught exceptions have been removed
            return false;
        });
    });
    it("A blank list of apps displays correctly", () => {
        cy.intercept("/app_store/api/application_summaries", {
            statusCode: 204,
            body: '{"count": 1, "next": "None", "previous": "None", "results": []}',
        }).as("twoHundredFour");
        cy.visit("/#/application-repository");
        cy.wait("@twoHundredFour");
        appPage.assertBlankAppList();
    });

    it("Application store page handles 400 error code gracefully", () => {
        cy.intercept("/app_store/api/application_summaries", { statusCode: 400 }).as("fourHundred");
        cy.visit("/#/application-repository");
        cy.wait("@fourHundred");
        appPage.assertLatestErrorContainsMessage(
            "Something unexpected went wrong retrieving application!",
        );
    });

    it("Application store page handles 403 error code gracefully", () => {
        cy.intercept("/app_store/api/application_summaries", { statusCode: 403 }).as("fourHundredThree");
        cy.visit("/#/application-repository");
        cy.wait("@fourHundredThree");
        appPage.assertLatestErrorContainsMessage(
            "Something unexpected went wrong retrieving application!",
        );
    });

    it("Application store page handles 500 error code gracefully", () => {
        cy.intercept("/app_store/api/application_summaries", { statusCode: 500 }).as("fiveHundred");
        cy.visit("/#/application-repository");
        cy.wait("@fiveHundred");
        appPage.assertLatestErrorContainsMessage(
            "Something unexpected went wrong retrieving application!",
        );
    });
});
