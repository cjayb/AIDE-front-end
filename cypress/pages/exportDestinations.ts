import ApiMocks from "fixtures/mockIndex";
import { AbstractPage } from "./abstractPage";
import { DestinationData } from "data/dicom-configuration/destinations";
import { IExportDestination } from "../../src/models/export-destinations/ExportDestination";

export default class Destinations extends AbstractPage {
    public initPage() {
        cy.intercept("/destinations", ApiMocks.DESTINATIONS_EXAMPLE).as("destinations");
        cy.visit("/admin-export-configuration");
        cy.wait(["@destinations"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public modalButtons(scenario: string) {
        switch (scenario) {
            case "add-cancel":
                cy.intercept("POST", "/destinations", ApiMocks.DESTINATION_ADD);
                cy.intercept("GET", "/destinations", ApiMocks.DESTINATIONS_ADDED);
                this.clickDataCy(`destination-create-cancel`);
                break;
            case "add-save":
                cy.intercept("POST", "/destinations", ApiMocks.DESTINATION_ADD);
                cy.intercept("GET", "/destinations", ApiMocks.DESTINATIONS_ADDED).as("get");
                this.clickDataCy(`destination-create-save`);
                cy.wait("@get");
                break;
            case "edit-cancel":
                cy.intercept("PUT", "/destinations/USEAST", ApiMocks.DESTINATION_ADD);
                cy.intercept("GET", "/destinations", ApiMocks.DESTINATIONS_ADDED);
                this.clickDataCy("destination-create-cancel");
                break;
            case "edit-save":
                cy.intercept("PUT", "/destinations/USEAST", ApiMocks.DESTINATION_ADD).as("put");
                cy.intercept("GET", "/destinations", ApiMocks.DESTINATIONS_ADDED).as("get");
                this.clickDataCy(`destination-edit-continue`);
                cy.wait(["@put", "@get"]);
                break;
            case "delete-save":
                cy.intercept("DELETE", `/destinations/USEAST`, {
                    statusCode: 200,
                }).as("Delete");
                cy.intercept("GET", "/destinations", ApiMocks.DESTINATIONS_ADDED).as("Get");
                this.clickDataCy("destination-delete-continue");
                Cypress.on("uncaught:exception", () => {
                    return false;
                });
                cy.wait(["@Delete", "@Get"]);
                break;
            case "delete-cancel":
                cy.intercept("DELETE", `/destinations/USEAST`, {
                    statusCode: 200,
                });
                cy.intercept("GET", "/destinations", ApiMocks.DESTINATIONS_ADDED);
                this.clickDataCy("destination-delete-cancel");
                Cypress.on("uncaught:exception", () => {
                    return false;
                });
                break;
            default:
                throw "This scenario has not been implemented. Please review";
        }
    }

    public deleteDestinationAPIRequest(destination: DestinationData, statusCode: number) {
        cy.intercept("DELETE", `/destinations/${destination.name}`, {
            statusCode: statusCode,
        }).as("Delete");
        cy.intercept("GET", "/destinations", ApiMocks.DESTINATIONS_ADDED);
        this.clickDataCy("destination-delete-continue");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Delete"]);
    }

    public initPageError(statuscode: number) {
        cy.intercept("/destinations", { statusCode: statuscode }).as("destinations");
        cy.visit("/admin-export-configuration");
        cy.wait(["@destinations"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
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

    public assertTableCorrect(destination: IExportDestination) {
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

    public elementVisibleDataCy(tag: string) {
        cy.wait(500);
        cy.dataCy(tag).should("be.visible");
    }

    public elementDisabled(tag: string) {
        cy.dataCy(tag).should("be.disabled");
    }

    public containsText(tag: string, text: string) {
        cy.wait(500);
        cy.get(tag).should("contain.text", text);
    }
}
