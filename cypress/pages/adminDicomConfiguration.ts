import ApiMocks from "fixtures/mockIndex";
import { AbstractPage } from "./abstractPage";
import { DestinationData } from "data/dicom-configuration/destinations";
import { IExportDestination } from "../../src/models/export-destinations/ExportDestination";

export default class Destinations extends AbstractPage {
    public initPage() {
        cy.intercept("/destinations", ApiMocks.DESTINATIONS_EXAMPLE).as("destinations");
        cy.visit("/#/admin-export-configuration");
        cy.wait(["@destinations"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public initPageErrors(code: number) {
        cy.intercept("/destinations", { statusCode: code }).as("error");
        cy.visit("/#/admin-export-configuration");
        cy.wait(["@error"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public initPageError(statuscode: number) {
        cy.intercept("/destinations", { statusCode: statuscode }).as("destinations");
        cy.visit("/#/admin-export-configuration");
        cy.wait(["@destinations"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public deleteDestinationAPIRequest(destination: DestinationData, statusCode: number) {
        cy.intercept("DELETE", `/destinations/${destination.name}`, {
            statusCode: statusCode,
        }).as("Delete");
        this.clickDataCy("destination-delete-continue");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Delete"]);
    }

    public editDestinationAPIRequest(destination: DestinationData, statusCode: number) {
        cy.intercept("PUT", `/destinations/${destination.name}`, {
            statusCode: statusCode,
        }).as("Put");
        this.clickDataCy("destination-edit-continue");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Put"]);
    }

    public addDestinationAPIRequest(statusCode: number) {
        cy.intercept("POST", `/destinations`, {
            statusCode: statusCode,
        }).as("Post");
        this.clickDataCy("destination-create-save");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Post"]);
    }

    public editButtonVisibleDestinations() {
        [0, 1].forEach((row) => {
            cy.dataCy(`destination-action-edit-${row}`).should("be.visible");
        });
    }

    public deleteButtonVisibleDestinations() {
        [0, 1].forEach((row) => {
            cy.dataCy(`destination-action-delete-${row}`).should("be.visible");
        });
    }

    public echoButtonVisibleDestinations() {
        [0, 1].forEach((row) => {
            cy.dataCy(`destination-action-echo-${row}`).should("be.visible");
        });
    }

    public createDestinationsButtonVisible() {
        cy.dataCy("add-dicom-configuration-button").should("be.visible");
    }

    public assertTableDataCorrect(destination: IExportDestination) {
        cy.dataCy(`destination-name-0`).should(`contain`, destination.name);
        cy.dataCy(`destination-port-0`).should(`contain`, destination.port);
        cy.dataCy(`destination-ae-title-0`).should(`contain`, destination.aeTitle);
        cy.dataCy(`destination-ip-0`).should(`contain`, destination.hostIp);
    }

    public enterAddDestinationDetails(newDestinationData: IExportDestination) {
        this.clickDataCy("destination-name");
        cy.dataCy("destination-name").type(newDestinationData.name);
        this.clickDataCy("destination-ae-title");
        cy.dataCy("destination-ae-title").type(newDestinationData.aeTitle);
        this.clickDataCy("destination-ip-address");
        cy.dataCy("destination-ip-address").type(newDestinationData.hostIp);
        this.clickDataCy("destination-port");
        cy.dataCy("destination-port").type(newDestinationData.port.toString());
        this.clickAway();
    }

    public enterEditDestinationDetails(newDestinationData: IExportDestination) {
        this.clickDataCy("destination-ae-title");
        cy.dataCy("destination-ae-title").clear().type(newDestinationData.aeTitle);
        this.clickDataCy("destination-ip-address");
        cy.dataCy("destination-ip-address").clear().type(newDestinationData.hostIp);
        this.clickDataCy("destination-port");
        cy.dataCy("destination-port").clear().type(newDestinationData.port.toString());
        this.clickAway();
    }

    public saveDisabledUnlessAllFIeldsEntered(newDestinationData: IExportDestination) {
        cy.dataCy("destination-name").type(newDestinationData.name);
        this.assertAddDICOMConfigurationButton("disabled");
        cy.dataCy("destination-ae-title").type(newDestinationData.aeTitle);
        this.assertAddDICOMConfigurationButton("disabled");
        cy.dataCy("destination-ip-address").type(newDestinationData.hostIp);
        this.assertAddDICOMConfigurationButton("disabled");
        cy.dataCy("destination-port").type(newDestinationData.port.toString());
        this.assertAddDICOMConfigurationButton("enabled");
    }

    public assertAddedDestinationDetailsCorrect(newDestination: IExportDestination) {
        cy.intercept("POST", "/destinations", newDestination).as("Post");
        cy.intercept("GET", "/destinations", newDestination).as("Get");
        this.clickDataCy("destination-create-save");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Post", "@Get"]);
        this.assertTableDataCorrect(newDestination);
    }

    public assertDestinationNotSaved(destination: IExportDestination) {
        cy.dataCy(`destination-name-0`).should(`contain`, destination.name);
        cy.dataCy(`destination-port-0`).should(`contain`, destination.port);
        cy.dataCy(`destination-ae-title-0`).should(`contain`, destination.aeTitle);
        cy.dataCy(`destination-ip-0`).should(`contain`, destination.hostIp);
    }

    public assertAddDICOMConfigurationButton(status: string) {
        switch (status) {
            case "enabled":
                cy.dataCy("destination-create-save").should("be.enabled");
                break;
            case "disabled":
                cy.dataCy("destination-create-save").should("be.disabled");
                break;
            default:
                throw "This scenario has not been implemented. Please review";
        }
    }

    public echoStatusDisplayedWithValue(element: string, statusCode: number, echoStatus: string) {
        cy.intercept("GET", "/destinations/echo/*", { statusCode: statusCode }).as(
            "destinations-echo",
        );
        this.clickDataCy("destination-action-echo-0");
        cy.wait(["@destinations-echo"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.dataCy(element).should("contain.text", echoStatus);
    }

    public requiredFieldsValidationDestinations(field: string) {
        this.clickDataCy(field);
        cy.dataCy(field).clear();
        this.clickAway();
        this.assertRequiredText();
    }

    public noSpacesOrSpecialCharactersValidation(field) {
        this.clickDataCy(field);
        cy.dataCy(field).type("_");
        this.assertNoSpacesOrSpecialCharactersText();
    }

    public assertRequiredText() {
        cy.get(".v-messages__message").should("contain.text", "Required");
    }

    public assertNoSpacesOrSpecialCharactersText() {
        cy.get(".v-messages__message").should(
            "contain.text",
            "No spaces or special characters allowed",
        );
    }

    public clickAway() {
        cy.get(".v-card__title").click({ force: true });
        cy.wait(50);
    }

    public elementVisibleGet(tag: string) {
        cy.wait(500);
        cy.get(tag).should("be.visible");
    }

    public elementNotVisibleDataCy(tag: string) {
        cy.wait(500);
        cy.dataCy(tag).should("not.be.visible");
    }

    public elementVisibleDataCy(tag: string) {
        cy.wait(500);
        cy.dataCy(tag).should("be.visible");
    }

    public elementNotVisibleGet(tag: string) {
        cy.get(tag).should("not.be.visible");
    }

    public elementDisabled(tag: string) {
        cy.dataCy(tag).should("be.disabled");
    }

    public containsText(tag: string, text: string) {
        cy.wait(500);
        cy.get(tag).should("contain.text", text);
    }
}
