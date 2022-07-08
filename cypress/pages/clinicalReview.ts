import ApiMocks from "../fixtures/mockIndex";
import { AbstractPage } from "./abstractPage";
import moment from "moment";
import { RejectReason } from "../data/rejectReason";
import { ExecutionData } from "../data/execution";
import { nodeTerminal, a11yConfig } from "utils/a11y_util";
import { filterObject } from "utils/data_util";

const dianeName = ExecutionData.REVIEW_DIANE_ANDERSON.event.origin.series[0]["PatientName"];
const kellyName = ExecutionData.REVIEW_KELLY_MALDONADO.event.origin.series[0]["PatientName"];
const leoneName = ExecutionData.REVIEW_LEONE_GOODPASTURE.event.origin.series[0]["PatientName"];
const fionaName = "Fiona";

export default class ClinicalReviewPage extends AbstractPage {
    //Clinical review worklist
    private static FREETEXT_SEARCH: string = 'worklist-search';
    public static PATIENT_NAME_VIEWER: string = 'patient-name';
    public static PATIENT_DOB_VIEWER: string = 'patient-dob';
    public static PATIENT_ID_VIEWER: string = 'patient-id'
    public static PATIENT_SEX_VIEWER: string = 'patient-sex'
    public static STUDY_DATE_VIEWER: string = 'study-date'
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
    public static PINNED_METADATA: string = "pinned-metadata";
    public static LENGTH_TOOL: string = "length-tool";
    public static METADATA_PIN_BUTTON: string = "pin-metadata";

    //Clinical decision modal
    private static ACCEPT_MODAL: string = "modal-accept-btn";
    private static REJECT_MODAL: string = "modal-reject-btn";
    private static REJECT_REASON_SELECT: string = ".v-select__selections";
    private static REJECT_REASONS: string = ".v-list-item";
    private static DESCRIPTION: string = "modal-description";
    private static CHECKBOX: string = ".v-input--selection-controls__ripple";

    

    //Pagination
    public static PAGINATION: string = "pagination";

    public initPage() {
        cy.intercept('GET', '/executions?approved=false', ApiMocks.CLINICAL_REVIEW_ALL_EXECUTIONS).as("All executions for review");
        cy.intercept('GET', '/executions?from=0*', ApiMocks.CLINICAL_REVIEW_PAGE_1).as("Executions for review page 1");
        cy.intercept('GET', '/executions?from=10*', ApiMocks.CLINICAL_REVIEW_PAGE_2).as("Executions for review page 2");
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
            cy.dataCy(ClinicalReviewPage.METADATA_PIN_BUTTON).click()
        })
    }

    public assertMetadataValues(metadata: object, metadataLocator: string) {
        for (const [key, value] of Object.entries(metadata)) {
            cy.get(`[data-cy=${metadataLocator}] > :contains("${key}")`).should("contain.text", value)
        }
    }

    private waitForImageRender(): Cypress.Chainable<unknown> {
        return cy.get(ClinicalReviewPage.SELECTED_IMAGE, {timeout: 10000 }).then({ timeout: 10000 }, ($element) => {
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
            expect(this.imageRenderCount).to.eq(1, "Wait for first instance cornerstoneimagerendered")
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

    public formatDate(text: string): string {
        return moment(String(text)).format("DD/MM/YYYY");
    }

    public assertHeaderDetails(patientName: string, patientDob: string, patientId: string, patientSex: string, studyDate: string): ClinicalReviewPage {
        cy.dataCy(ClinicalReviewPage.PATIENT_NAME_VIEWER)
            .should("contain.text", patientName);
        cy.dataCy(ClinicalReviewPage.PATIENT_DOB_VIEWER)
            .should("contain.text", patientDob);
        cy.dataCy(ClinicalReviewPage.PATIENT_ID_VIEWER)
            .should("contain.text", patientId);
        cy.dataCy(ClinicalReviewPage.PATIENT_SEX_VIEWER)
            .should("contain.text", patientSex);
        cy.dataCy(ClinicalReviewPage.STUDY_DATE_VIEWER)
            .should("contain.text", studyDate);

        return this;
    }

    public acceptRejects(decision: boolean): ClinicalReviewPage {
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

    public selectNextPage() {
        cy.get("[aria-label='Next page']").click();
        return this;
    }

    public selectPreviousPage() {
        cy.get("[aria-label='Previous page']").click();
        return this;
    }


    public assertViewAndFilterWorklist() {
        this.searchWorklist("de")
            .worklistItemWithText(dianeName).click()
            .should("contain.text", dianeName);

        cy.checkA11y(null, a11yConfig, nodeTerminal, true);

        this.clearWorklistSearch()
            .searchWorklist("Kel")
            .worklistItemWithText(kellyName).click()
                .should("contain.text", kellyName);
    }


    public assertPatientDataFields() {
        const patientDob: string = this.formatDate(ExecutionData.REVIEW_LEONE_GOODPASTURE.event.origin.series[0]["PatientBirthDate"]);
        const patientId = ExecutionData.REVIEW_LEONE_GOODPASTURE.event.origin.series[0]["PatientID"];
        const patientSex = ExecutionData.REVIEW_LEONE_GOODPASTURE.event.origin.series[0]["PatientSex"];
        const studyDate = this.formatDate(ExecutionData.REVIEW_LEONE_GOODPASTURE.event.origin.series[0]["StudyDate"])
        this.searchWorklist("leo")
            .worklistItemWithText(leoneName).click();
        this.assertHeaderDetails(leoneName, patientDob, patientId, patientSex, studyDate);
        cy.checkA11y(null, a11yConfig, nodeTerminal, true);
    }

    public assertAcceptWorklistItem() {
        this.acceptRejects(true);
        cy.intercept('GET', "/executions?from=0*", ApiMocks.CLINICAL_REVIEW_REVIEWED);
        cy.checkA11y(null, a11yConfig, nodeTerminal, true);
        this.fillReviewModal(true, undefined, "This looks really good!")
            .acceptRejectModal(true)
            .worklistItemWithText(kellyName)
                .should("not.exist");
    }

    public assertRejectWorklistItem() {
        this.acceptRejects(false);
        cy.intercept('GET', "/executions?from=0*", ApiMocks.CLINICAL_REVIEW_REVIEWED);
        cy.checkA11y(null, a11yConfig, nodeTerminal, true);
        this.fillReviewModal(true, RejectReason.WRONG_DIAGNOSIS, "The diagnosis is wrong!")
            .acceptRejectModal(false)
            .worklistItemWithText(kellyName)
                .should("not.exist");
    }

    public assertDicomSeriesSelector() {
        this.waitForInitialViewerLoad()
        cy.dataCy(ClinicalReviewPage.SERIES_SELECTOR).percySnapshotElement("Series-selector")
        cy.get(".serieslist-header").then((el) => {
            expect(el[0].textContent).to.eq("Hide Series ")
        })
        cy.dataCy(ClinicalReviewPage.SERIES).eq(0).within(() => {
            cy.dataCy(ClinicalReviewPage.MODALITY_LENGTH).then((el) => {
                expect(el[0].textContent).to.eq(`${ExecutionData.REVIEW_KELLY_MALDONADO.event.origin.series[0]["Modality"]}(22)`)
            })
            cy.dataCy(ClinicalReviewPage.SERIES_DESCRIPTION)
                .should("have.text", ExecutionData.REVIEW_KELLY_MALDONADO.event.origin.series[0]["SeriesDescription"])
        })
    }

    public assertDicomMetadataView() {
        this.waitForInitialViewerLoad()
        cy.intercept('GET', "https://demo.orthanc-server.com/instances/*/simplified-tags", ApiMocks.REMOTE_DICOM_METADATA)
        this.assertMetadataValues(ApiMocks.REMOTE_DICOM_METADATA, ClinicalReviewPage.METADATA_SERIES)
    }

    public assertDicomMetadataPinned() {
        this.waitForInitialViewerLoad()
        let metadataToPin = filterObject(ApiMocks.REMOTE_DICOM_METADATA, k => k === "PatientName" || k === "SeriesDescription" || k === "SeriesDate");
        cy.wait(1000) // Re-render issue
        Object.keys(metadataToPin).forEach(k => this.pinMetadata(k));
        this.assertMetadataValues(metadataToPin, ClinicalReviewPage.PINNED_METADATA)
    }

    public assertDicomViewportDisplay(){
        this.waitForInitialViewerLoad()
        cy.checkA11y(null, a11yConfig, nodeTerminal, true);
        cy.get(ClinicalReviewPage.SELECTED_IMAGE).percySnapshotElement("Dicom-viewport")
    }

    public assertDicomImagesScrolling() {
        this.waitForInitialViewerLoad()
        cy.dataCy(ClinicalReviewPage.DICOM_VIEWPORT).trigger("wheel", "center", { deltaY: 100 })
        this.waitForScrolledImageLoad(2)
        cy.get(ClinicalReviewPage.SELECTED_IMAGE).percySnapshotElement("Scrolled-dicom")
    }

    public assertViewerMeasureTool() {
        this.waitForInitialViewerLoad()
        cy.dataCy(ClinicalReviewPage.LENGTH_TOOL).click()
        cy.get("canvas").click().trigger("mousemove", "top").click("top")
        cy.dataCy(ClinicalReviewPage.DICOM_VIEWPORT).percySnapshotElement("Measure-tool")
    }

    public assertExecutionsPagination() {
        this.worklistItemWithText(kellyName)
            .should("exist")
        cy.get("[aria-label='Previous page']").should("be.disabled")
        cy.get("[aria-label='Next page']").should("be.enabled")
        this.selectNextPage();
        cy.get("[aria-label='Previous page']").should("be.enabled")
        cy.get("[aria-label='Next page']").should("be.disabled")
        this.worklistItemWithText(fionaName)
            .should("exist")
            this.selectPreviousPage();
            this.worklistItemWithText(kellyName)
            .should("exist")
    }

    public assertPageRefresh() {
        this.waitForInitialViewerLoad();
        cy.reload();
        cy.contains("Something unexpected went wrong").should("not.exist");
    }

    public assertNoTasks() {
        cy.visit("/#/clinical-review")
        cy.intercept("/executions*", { body: [], statusCode: 404 }).as("No executions")
        cy.dataCy(ClinicalReviewPage.ACCEPT_BUTTON).should("be.disabled")
        cy.dataCy(ClinicalReviewPage.REJECT_BUTTON).should("be.disabled")
    }
}