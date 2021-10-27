import ApiMocks from "../fixtures/mockIndex";
import { AbstractPage } from "./abstractPage";
import moment from "moment";
import { RejectReason } from "../data/rejectReason";

export default class ClinicalReviewPage extends AbstractPage {
    //Clinical review worklist
    private static FREETEXT_SEARCH: string = 'worklist-search';
    public static PATIENT_NAME_VIEWER: string = 'patient-name';
    public static PATIENT_DOB_VIEWER: string = 'patient-dob';
    public static PATIENT_ID_VIEWER: string = 'patient-id'
    public static PATIENT_SEX_VIEWER: string = 'patient-sex'
    private static CLEAR_FREETEXT_SEARCH: string = ".v-input__icon--clear";
    private static WORKLIST_ITEM: string = "worklist-item";
    public static ACCEPT_BUTTON: string = "accept-btn";
    public static REJECT_BUTTON: string = "reject-btn";

    //Custom Dicom viewer
    private imageRenderCount: number = 0;
    public static SERIES_SELECTOR: string = "series-selector";
    public static SERIES: string = "dicom-series";
    public static MODALITY_LENGTH: string = "modality-length";
    public static SERIES_DESCRIPTION: string = "series-description";
    public static DICOM_METADATA: string = "dicom-metadata";
    public static DICOM_VIEWPORT: string = "dicom-viewport";
    public static PDF_VIEWPORT: string = "pdf-viewport";
    public static SELECTED_IMAGE: string = "#dicomImage"
    public static METADATA_SERIES: string = "metadata-series";
    public static PINNED_METADATA: string = "pinned-metadata"

    //Clinical decision modal
    private static ACCEPT_MODAL: string = "modal-accept-btn";
    private static REJECT_MODAL: string = "modal-reject-btn";
    private static REJECT_REASON_SELECT: string = ".v-select__selections";
    private static REJECT_REASONS: string = ".v-list-item";
    private static DESCRIPTION: string = "modal-description";
    private static CHECKBOX: string = ".v-input--selection-controls__ripple";

    public initPage() {
        cy.intercept('GET', '/executions?*', ApiMocks.CLINICAL_REVIEW).as("Executions for review");
        cy.intercept('POST', '/executions/*/approvals?*', ApiMocks.CLINICAL_REVIEW_RESPONSE).as("Review response");
        cy.visit("#/clinical-review");
        Cypress.on("uncaught:exception", (err, runnable) => {
            //TODO: Remove this once uncaught exceptions have been removed
            return false;
        });
        this.imageRenderCount = 0;
    }

    public pinMetadata(metadataKey: string) {
        cy.dataCy(ClinicalReviewPage.METADATA_SERIES).filter(`:contains("${metadataKey}")`).within(($el) => {
            cy.get("button").click()
        })
    }

    public assertMetadataValues(metadata: object, metadataLocator: string) {
        for (const [key, value] of Object.entries(metadata)) {
            cy.get(`[data-cy=${metadataLocator}] > :contains("${key}")`).should("contain.text", value)
        }
    }

    private waitForImageRender(): Cypress.Chainable<unknown> {
        return cy.get(ClinicalReviewPage.SELECTED_IMAGE).then(($element) => {
            return new Cypress.Promise(resolve => {
                const onLoadEnd = () => {
                    $element[0].removeEventListener("cornerstoneimagerendered", onLoadEnd)
                    console.log("Render image fired")
                    this.imageRenderCount += 1
                    resolve()
                }
                $element[0].addEventListener("cornerstoneimagerendered", onLoadEnd)
            })
        })
    }

    public waitForInitialViewerLoad(): ClinicalReviewPage {
        this.waitForImageRender().then(() => {
            expect(this.imageRenderCount).to.eq(1, "Wait for two instances of cornerstoneimagerendered")
        })
        return this;
    }

    /**
     * @param expectedImageLoads - number of instances of cornerstoneimagerendered expected 
     * after scrolling (plus the initial 2 when the page loads)
     * @returns this
     */
    public waitForScrolledImageLoad(expectedImageLoads: number): ClinicalReviewPage {
        this.waitForImageRender().then(() => {
            expect(this.imageRenderCount).to.eq(expectedImageLoads, `Wait for ${expectedImageLoads} instances of cornerstoneimagerendered`)
        })
        return this;
    }

    public searchWorklist(text: string): ClinicalReviewPage {
        cy.dataCy(ClinicalReviewPage.FREETEXT_SEARCH).type(text);
        return this;
    }

    public clearWorklistSearch(): ClinicalReviewPage {
        cy.get(ClinicalReviewPage.CLEAR_FREETEXT_SEARCH).click();
        return this;
    }

    public worklistItemWithText(text: string): Cypress.Chainable<Element> {
        return cy.dataCy(ClinicalReviewPage.WORKLIST_ITEM).contains(text);
    }

    public formatDob(text: string): string {
        return moment(String(text)).format("DD/MM/YYYY");
    }

    public assertViewerDetails(patientName: string, patientDob: string, patientId: string, patientSex: string): ClinicalReviewPage {
        cy.dataCy(ClinicalReviewPage.PATIENT_NAME_VIEWER)
            .should("contain.text", patientName);
        cy.dataCy(ClinicalReviewPage.PATIENT_DOB_VIEWER)
            .should("contain.text", patientDob);
        cy.dataCy(ClinicalReviewPage.PATIENT_ID_VIEWER)
            .should("contain.text", patientId);
        cy.dataCy(ClinicalReviewPage.PATIENT_SEX_VIEWER)
            .should("contain.text", patientSex);

        return this;
    }

    public acceptReject(decision: boolean): ClinicalReviewPage {
        if (decision) {
            cy.dataCy(ClinicalReviewPage.ACCEPT_BUTTON).click();
        } else {
            cy.dataCy(ClinicalReviewPage.REJECT_BUTTON).click();
        }

        return this;
    }

    public acceptRejectModal(decision: boolean): ClinicalReviewPage {
        if (decision) {
            cy.dataCy(ClinicalReviewPage.ACCEPT_MODAL).click();
        } else {
            cy.dataCy(ClinicalReviewPage.REJECT_MODAL).click();
        }

        return this;
    }

    public fillReviewModal(signed: boolean, reason?: RejectReason, description?: string): ClinicalReviewPage {
        if (!!reason) {
            cy.get(ClinicalReviewPage.REJECT_REASON_SELECT).click();
            cy.get(ClinicalReviewPage.REJECT_REASONS).contains(reason).click();
        }

        if (!!description) {
            cy.dataCy(ClinicalReviewPage.DESCRIPTION).type(description);
        }

        if (signed) {
            cy.get(ClinicalReviewPage.CHECKBOX).click();
        }
        return this;
    }
}