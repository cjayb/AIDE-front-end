import { ApplicationData } from "data/application";
import { AppProfileData } from "data/appProfile";
import { ApplicationDetail } from "../../src/models/ApplicationResult";
import ApiMocks from "../fixtures/mockIndex";
import { AbstractPage } from "./abstractPage";
import scrollToBottom from "scroll-to-bottomjs";

export default class AppProfilePage extends AbstractPage {
    // Default Screen
    static APPLICATION_ID = "v-breadcrumbs__item";
    static APPLICATION_NAME = "name";
    static VERSION = "version-selector";
    static VERSIONS = "versions";
    static APPLICATION_VERSION_ID = "version-id";
    static IMAGE = "application-image";
    static SHORT_DESCRIPTION = "short-description";
    static INTENDED_USE = "intended-use";
    static LONG_DESCRIPTION = "model-details";
    static MEDICAL_SPECIALTIES = "speciality";
    static LOGO = ["ce-logo", "fda-logo", "ukca-logo"];
    static CE_CERTIFICATION = "ce-title";
    static FDA_CERTIFICATION = "fda-title";
    static UKCA_CERTIFICATION = "ukca-title";
    static CERTIFICATION_DETAILS = "certification-details";
    static GPU_MEMORY = "min-gpu-memory-value";
    static NUMBER_OF_CORES = "min-cpu-cores-value";
    static DISK_SPACE = "min-disk-space-value";
    static RAM = "min-ram-mb-value";
    static INPUT_TYPES = "input-types-value";
    static OUTPUT_TYPES = "output-types-value";
    static DEVELOPER_DETAILS = "developer-details";
    static DEVELOPERS = "developers";
    static FILES = "file-card";
    static FILE_LABEL = "file-label";
    static FILE_IMAGE = "file-image";
    static CREATED_AT = "created-at";
    static UPDATED_AT = "updated-at";
    static SPECIFICATIONS = "specification-table";
    static SPECIALTY = "specialty";
    static GOTO_VERSION = "goto-version";
    static HISTORY_VERSION = "history-version";
    static VERSION_DATE = "version-date";
    static DETAIL_SUB_MODULE = "detail-sub-module";

    public assertAppDetails(application_detail: ApplicationDetail): AppProfilePage {
        cy.dataCy(AppProfilePage.APPLICATION_NAME)
            .should("exist")
            .should("contains.text", application_detail.name);
        cy.dataCy(AppProfilePage.IMAGE).should("exist");
        cy.dataCy(AppProfilePage.INTENDED_USE)
            .should("exist")
            .should("contains.text", application_detail.intended_use);
        this.assertCertificationsAreDisplayed(application_detail.certification.certifications);
        cy.dataCy(AppProfilePage.SHORT_DESCRIPTION)
            .should("exist")
            .should("contains.text", application_detail.short_description);
        cy.dataCy(AppProfilePage.LONG_DESCRIPTION)
            .should("exist")
            .should("contains.text", application_detail.long_description);
        cy.dataCy(AppProfilePage.DEVELOPERS)
            .should("exist")
            .should("contains.text", application_detail.developers);
        cy.dataCy(AppProfilePage.DEVELOPER_DETAILS)
            .should("exist")
            .should("contains.text", application_detail.developer_details);

        this.assertSpecialityIsDisplayed(application_detail.medical_specialties);
        this.assertFilesAreDisplayed(application_detail.files);
        this.assertSystemRequirements2(application_detail.specification.input_types);
        this.assertSystemRequirements2(application_detail.specification.output_types);
        this.assertVersions(application_detail.versions);
    }
    public assertVersion(application_detail: ApplicationDetail): AppProfilePage {
        this.clickDropdown("version-selector", "12");
        cy.get(".v-select__selections").should("have.text", application_detail.version);
        return this;
    }
    public assertSystemRequirements(application_detail: ApplicationDetail): AppProfilePage {
        cy.dataCy(AppProfilePage.GPU_MEMORY).should(
            "have.text",
            application_detail.specification.min_gpu_memory + " GB",
        );
        cy.dataCy(AppProfilePage.NUMBER_OF_CORES).should(
            "have.text",
            application_detail.specification.min_cpu_cores,
        );
        cy.dataCy(AppProfilePage.DISK_SPACE).should(
            "have.text",
            application_detail.specification.min_disk_space,
        );
        cy.dataCy(AppProfilePage.RAM).should(
            "have.text",
            application_detail.specification.min_ram_mb,
        );
        return this;
    }
    public assertSystemRequirements2(specifications: Array<string>): void {
        if (specifications != null) {
            specifications.forEach((specification) => {
                switch (specification) {
                    case "input_types": {
                        return cy
                            .dataCy(AppProfilePage.INPUT_TYPES)
                            .should("be.visible")
                            .contains("data");
                    }
                    case "output_types": {
                        return cy
                            .dataCy(AppProfilePage.OUTPUT_TYPES)
                            .should("be.visible")
                            .contains("data");
                    }
                }
            });
        } else {
            cy.log("No specifications were provided");
        }
    }

    public assertVersions(versions: Array<string>): void {
        if (versions != null) {
            versions.forEach((version) => {
                const dateTime = new Date(version["created_at"]);
                const dateTimeString =
                    dateTime.getDate() +
                    "/" +
                    (dateTime.getMonth() + "1") +
                    "/" +
                    dateTime.getFullYear() +
                    " " +
                    dateTime.getHours() +
                    ":" +
                    dateTime.getMinutes();
                cy.dataCy(AppProfilePage.GOTO_VERSION).should("exist");
                cy.dataCy(AppProfilePage.HISTORY_VERSION).should("contain", version["version"]);
                cy.dataCy(AppProfilePage.VERSION_DATE).should("contain", dateTimeString);
            });
        } else {
            cy.log("No versions were provided");
        }
    }

    private assertSpecialityIsDisplayed(specialties: Array<string>): AppProfilePage {
        if (specialties != []) {
            specialties.forEach((specialty) => {
                cy.dataCy(AppProfilePage.SPECIALTY).should("contain", specialty);
            });
        } else {
            cy.log("No specialties were provided");
        }
        return this;
    }

    public assertFilesAreDisplayed(files: Array<string>): void {
        if (files != null) {
            files.forEach((file) => {
                switch (file) {
                    case "file-label": {
                        return cy.dataCy(AppProfilePage.FILE_LABEL).should("be.visible");
                    }
                    case "file-image": {
                        return cy.dataCy(AppProfilePage.FILE_IMAGE).should("be.visible");
                    }
                }
            });
        } else {
            cy.log("No files were provided");
        }
    }
    public assertCertificationsAreDisplayed(logos: Array<string>): void {
        if (logos != null) {
            logos.forEach((logo) => {
                switch (logo) {
                    case "ce": {
                        return cy.dataCy(AppProfilePage.CE_CERTIFICATION).should("exist");
                    }
                    case "ukca": {
                        return cy.dataCy(AppProfilePage.UKCA_CERTIFICATION).should("exist");
                    }
                    case "fda": {
                        return cy.dataCy(AppProfilePage.FDA_CERTIFICATION).should("exist");
                    }
                }
            });
        } else {
            cy.log("No Logos were provided");
        }
    }

    public async initPage() {
        const application_id = "4cf54533-c2d6-474b-b32a-c1c4dc257eff";
        const application_version_id = "fda51e65-946d-4e65-a791-e92f2a1350da";
        cy.intercept(
            `/app_store/api/applications/${application_id}?application_version_id=${application_version_id}`,
            ApiMocks.APP_PROFILE_PAGE1,
        ).as("AppProfilePage");
        cy.visit(
            `/#/application-repository/${application_id}?application_version_id=${application_version_id}`,
        );
        cy.wait(["@AppProfilePage"]);
        Cypress.on("uncaught:exception", (err, runnable) => {
            //TODO: Remove this once uncaught exceptions have been removed
            return false;
        });
    }
}
