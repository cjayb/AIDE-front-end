import { Application } from "../../src/models/ApplicationResult";
import ApiMocks from "../fixtures/mockIndex";
import { AbstractPage } from "./abstractPage";
export default class AppStorePage extends AbstractPage {
    // Default Screen
    static APP_STORE_BUTTON = "app-store-button";
    static APPLICATION_CARD = "application-card";
    static APPLICATION_NAME = "application-name";
    static DEVELOPER_DETAILS = "developer-name";
    static VERSION = "version";
    static SHORT_DESCRIPTION = "short-description";
    static VIEW_APPLICATION_BUTTON = "view-application-button";
    static APPLICATION_IMAGE = "application-image";
    static SPECIALTY = "specialty";
    static CE_LOGO = "ce-logo";
    static UKCA_LOGO = "ukca-logo";
    static FDA_LOGO = "fda-logo";
    static NO_RESULTS_MESSAGE = "no-results-message";
    static APPLICATION_TABLE = "application-table";

    public clickAppStoreButton(): AppStorePage {
        cy.dataCy(AppStorePage.APP_STORE_BUTTON).click();
        return this;
    };

    public assertAppStorePageShows(): AppStorePage {
        cy.url().should('include', '/#/application-repository');
        cy.dataCy(AppStorePage.APPLICATION_NAME).should('be.visible');
        cy.dataCy(AppStorePage.DEVELOPER_DETAILS).should('be.visible');
        cy.dataCy(AppStorePage.VERSION).should('be.visible');
        cy.dataCy(AppStorePage.SHORT_DESCRIPTION).should('be.visible');
        cy.dataCy(AppStorePage.VIEW_APPLICATION_BUTTON).should('be.visible');
        cy.dataCy(AppStorePage.APPLICATION_IMAGE).should('be.visible');
        return this;
    };

    public assertCertificationLogoIsDisplayed(logo:string): Cypress.Chainable<Element> {
        switch(logo) {
            case "ce": {
                return cy.dataCy(AppStorePage.CE_LOGO).should("be.visible");
            }
            case "ukca": {
                return cy.dataCy(AppStorePage.UKCA_LOGO).should("be.visible");
            }
            case "fda": {
                return cy.dataCy(AppStorePage.FDA_LOGO).should("be.visible");
            }
        }
    }

    public assertSpecialtyIsDisplayed(specialty: string, index: number): AppStorePage {
        if (specialty != undefined) {
            cy.dataCy(AppStorePage.SPECIALTY).eq(index).should('have.text', specialty);
        }
        else {
            cy.log("No specialties were provided")
        }
        return this;
    }

    public assertApp(application: Application): AppStorePage {
        this.getApp(application.name).within(() => {
            cy.dataCy(AppStorePage.APPLICATION_NAME).should('contains.text', application.name);
            cy.dataCy(AppStorePage.DEVELOPER_DETAILS).should('have.text', application.developer_details);
            cy.dataCy(AppStorePage.VERSION).should('have.text', "Version:" + application.latest_version);
            cy.dataCy(AppStorePage.VIEW_APPLICATION_BUTTON).should('be.visible');
            cy.dataCy(AppStorePage.SHORT_DESCRIPTION).should('contains.text', application.short_description);
            cy.dataCy(AppStorePage.APPLICATION_IMAGE).should('be.visible');
            application.certification.certifications.forEach(element => {
                this.assertCertificationLogoIsDisplayed(element);
            }); 
            application.medical_specialties.forEach((element, index) => {
                this.assertSpecialtyIsDisplayed(element, index);
            });   
            if (application.short_description.length > 50) {
                cy.dataCy(AppStorePage.SHORT_DESCRIPTION)
                    .should('have.css', 'overflow', 'hidden')
                    .should('have.css', 'text-overflow', 'ellipsis');
            }
        })
        return this;
    };

    public getApp(applicationName: string): Cypress.Chainable<JQuery> {
        return cy.dataCy("application-card").filter(`:contains("${applicationName}")`)
    }

    public assertBlankAppList(): AppStorePage {
        cy.dataCy(AppStorePage.NO_RESULTS_MESSAGE).should('be.visible');
        return this;
    };

    public async initPage() {
        cy.intercept("/app_store/api/applications", ApiMocks.APP_STORE_ALL_PERMUTATIONS).as(
            "ApplicationList",
        );
        cy.visit("/#/application-repository");
        cy.wait(["@ApplicationList"]);
        Cypress.on("uncaught:exception", (err, runnable) => {
            //TODO: Remove this once uncaught exceptions have been removed
            return false;
        });
    }
}
