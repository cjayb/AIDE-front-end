/// <reference types="cypress" />

import appStorePage from "../pages/appStore";
import { ApplicationData } from "../data/app-store/application";
import { nodeTerminal, a11yConfig } from "utils/a11y_util";
import AppStorePage from "../pages/appStore";
import Order from "data/enums/order";

const appPage = new appStorePage();

describe("App Store Page", () => {
    beforeEach(() => {
        appPage.initPage();
    });

    it("A user can access the app store via the button", () => {
        appPage.clickAppStoreButton().assertAppStorePageShows();
    });

    it("A user can access the app detailed view via the button", () => {
        cy.dataCy(AppStorePage.VIEW_APPLICATION_BUTTON).first().click();
        cy.url().should("include", "/#/application-repository/");
        cy.url().should("include", "?application_version_id=");
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

    //Bug raised - AIDE 1182
    // it("A speciality filtered app displays correctly", () => {
    //     appPage.clickDropdown(AppStorePage.MEDICAL_SPECIALITY_FILTER, "Surgery");
    //     appPage.assertApp(ApplicationData.UNIQUE_SPECIALITY_APP);
    //     cy.dataCy(AppStorePage.APPLICATION_CARD).should("have.length", 1);
    // });

    it("A sorted app list displays correctly", () => {
        appPage.assertAlphabeticalOrdering(Order.Ascending);
        appPage.assertAlphabeticalOrdering(Order.Descending);
    });

    it("A text searched app displays correctly", () => {
        appPage.assertTextSearchedApp(
            ApplicationData.UNIQUE_SPECIALITY_APP.name,
            ApplicationData.UNIQUE_SPECIALITY_APP,
        );
    });
});

describe("Error handling on app store page", () => {
    const data = [
        [400, "400"],
        [403, "403"],
        [500, "500"],
    ];
    beforeEach(() => {
        cy.injectAxe();
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    });
    data.forEach(($type) => {
        const [statusCode, test_name] = $type;
        it(`Application store page handles ${test_name} error code gracefully`, () => {
            appPage.assertErrorCodeHandling(statusCode);
        });
    });

    it("A blank list of apps displays correctly", () => {
        appPage.assertBlankAppList();
    });
});
