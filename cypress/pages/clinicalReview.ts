import ApiMocks from "../fixtures/mockIndex";
import { AbstractPage } from "./abstractPage";
import moment from "moment";
import { RejectReason } from "../data/clinical-review/rejectReason";
import { ClinicalReviewTaskData } from "../data/clinical-review/listOfTasks";
import { filterObject } from "utils/data_util";
import { formatDateAndTimeOfString } from "../../src/utils/date-utilities";
import { PagedClinicalReviewList } from "../../src/models/ClinicalReview/ClinicalReviewTask";

const allTasks = ClinicalReviewTaskData.LIST_OF_ALL_TASKS;
const searchPatientIdTaskData =
    ClinicalReviewTaskData.SEARCH_PATIENT_ID.data[0].clinical_review_message;
const searchPatientNameTaskData =
    ClinicalReviewTaskData.SEARCH_PATIENT_ID.data[0].clinical_review_message;
const searchApplicationNameTaskData =
    ClinicalReviewTaskData.SEARCH_PATIENT_ID.data[0].clinical_review_message;

const nextPage = "[aria-label='Next page']";
const previousPage = "[aria-label='Previous page']";
const pageTen = "[aria-label='Goto Page 10']";
const pageNine = "[aria-label='Goto Page 9']";

export default class ClinicalReviewPage extends AbstractPage {
    //Clinical review worklist
    public static PATIENT_NAME_VIEWER = "patient-name";
    public static PATIENT_DOB_VIEWER = "patient-dob";
    public static PATIENT_ID_VIEWER = "patient-id";
    public static PATIENT_SEX_VIEWER = "patient-sex";
    public static STUDY_DATE_VIEWER = "study-date";
    //private static WORKLIST_ITEM = "worklist-item";
    public static ACCEPT_BUTTON = "accept-btn";
    public static REJECT_BUTTON = "reject-btn";

    //Custom Dicom viewer
    private imageRenderCount = 0;
    public static SERIES_SELECTOR = "series-selector";
    public static SERIES = "dicom-series";
    public static MODALITY_LENGTH = "modality-length";
    public static SERIES_DESCRIPTION = "series-description";
    public static DICOM_METADATA = "dicom-metadata";
    public static DICOM_VIEWPORT = "dicom-viewport";
    public static PDF_VIEWPORT = "pdf-viewport";
    public static SELECTED_IMAGE = "#dicomImage";
    public static METADATA_SERIES = "metadata-series";
    public static PINNED_METADATA = "pinned-metadata";
    public static LENGTH_TOOL = "length-tool";
    public static METADATA_PIN_BUTTON = "pin-metadata";

    //Clinical decision modal
    private static ACCEPT_MODAL = "modal-accept-btn";
    private static REJECT_MODAL = "modal-reject-btn";
    private static REJECT_REASON_SELECT = ".v-select__selections";
    private static REJECT_REASONS = ".v-list-item";
    private static DESCRIPTION = "modal-description";
    private static CHECKBOX = ".v-input--selection-controls__ripple";

    //Pagination
    public static PAGINATION = "pagination";

    public initPage() {
        cy.intercept(
            "GET",
            "https://localhost:8000/clinical-review?pageNumber=1&pageSize=10&patientId=&patientName=&applicationName=",
            ApiMocks.CLINICAL_REVIEW_TASKS,
        ).as("All executions for review");
        cy.visit("clinical-review");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        this.imageRenderCount = 0;
    }

    public assertViewAndFilterTasks() {
        this.assertTaskSelected(ClinicalReviewTaskData.LIST_OF_ALL_TASKS, 0);
        this.assertTaskDetails(ClinicalReviewTaskData.LIST_OF_ALL_TASKS, 0);
        this.searchPatientId();
        this.searchPatientName();
        this.searchApplicationName();
    }

    public assertPaginationandViewTasks() {
        this.changePage(nextPage, 2);
        this.assertTaskDetails(ClinicalReviewTaskData.PAGINATION, 0);
        this.changePage(previousPage, 1);
        this.assertTaskDetails(ClinicalReviewTaskData.PAGINATION, 0);
        this.changePage(pageTen, 10);
        this.assertTaskDetails(ClinicalReviewTaskData.PAGINATION, 0);
        this.changePage(pageNine, 9);
        this.assertTaskDetails(ClinicalReviewTaskData.PAGINATION, 0);
    }

    public changePage(page: string, pageNumber: number) {
        cy.intercept(
            "GET",
            `/clinical-review?pageNumber=${pageNumber}&pageSize=${allTasks.pageSize}&patientId=&patientName=&applicationName=`,
            ApiMocks.CLINICAL_REVIEW_PAGINATION,
        ).as("pagination");
        cy.get(page).click();
        cy.wait("@pagination");
        cy.wait(100);
    }

    public assertTaskSelected(task: PagedClinicalReviewList, index: number) {
        cy.dataCy(task.data[index].clinical_review_message.patient_metadata.patient_id).should(
            "have.attr",
            "aria-selected",
            "true",
        );
    }

    public searchPatientId() {
        cy.intercept(
            "GET",
            `/clinical-review?pageNumber=1&pageSize=10&patientId=${searchPatientIdTaskData.patient_metadata.patient_id}&patientName=&applicationName=`,
            ApiMocks.CLINICAL_REVIEW_SEARCH_PATIENT_ID,
        ).as("patient-id");
        cy.dataCy("patient-id-radiobtn").click({ force: true }).should("not.have.text");
        cy.dataCy("worklist-search").type(searchPatientIdTaskData.patient_metadata.patient_id);
        cy.wait("@patient-id");
        this.assertTaskDetails(ClinicalReviewTaskData.SEARCH_PATIENT_ID, 0);
    }

    public searchPatientName() {
        cy.intercept(
            "GET",
            `/clinical-review?pageNumber=1&pageSize=10&patientId=&patientName=${searchPatientNameTaskData.patient_metadata.patient_name}&applicationName=`,
            ApiMocks.CLINICAL_REVIEW_SEARCH_PATIENT_NAME,
        ).as("patient-name");
        cy.dataCy("patient-name-radiobtn").click({ force: true }).should("not.have.text");
        cy.dataCy("worklist-search")
            .clear({ force: true })
            .type(searchPatientNameTaskData.patient_metadata.patient_name);
        cy.wait("@patient-name");
        this.assertTaskDetails(ClinicalReviewTaskData.SEARCH_PATIENT_NAME, 0);
    }

    public searchApplicationName() {
        cy.intercept(
            "GET",
            `/clinical-review?pageNumber=1&pageSize=10&patientId=&patientName=&applicationName=${searchApplicationNameTaskData.application_metadata.application_name}`,
            ApiMocks.CLINICAL_REVIEW_SEARCH_APPLICATION_NAME,
        ).as("application-name");
        cy.dataCy("application-name-radiobtn").click({ force: true }).should("not.have.text");
        cy.dataCy("worklist-search")
            .clear({ force: true })
            .type(searchApplicationNameTaskData.application_metadata.application_name);
        cy.wait("@application-name");
        this.assertTaskDetails(ClinicalReviewTaskData.SEARCH_APPLICATION_NAME, 0);
    }

    public assertTaskDetails(task: PagedClinicalReviewList, index: number) {
        const taskdate = formatDateAndTimeOfString(task.data[index].received.toString(), false);
        cy.dataCy(task.data[index].clinical_review_message.patient_metadata.patient_id)
            .should(
                "contain",
                task.data[index].clinical_review_message.patient_metadata.patient_name,
            )
            .and("contain", task.data[index].clinical_review_message.patient_metadata.patient_id)
            .and("contain", task.data[index].clinical_review_message.patient_metadata.patient_Age)
            .and("contain", task.data[index].clinical_review_message.patient_metadata.patient_sex)
            .and(
                "contain",
                task.data[index].clinical_review_message.application_metadata.application_name,
            )
            .and(
                "contain",
                task.data[index].clinical_review_message.application_metadata.application_version,
            )
            .and(
                "contain",
                task.data[index].clinical_review_message.application_metadata.application_mode,
            )
            .and("contain", taskdate);
    }

    //Methods below from old tests

    public pinMetadata(metadataKey: string) {
        cy.dataCy(ClinicalReviewPage.METADATA_SERIES)
            .filter(`:contains("${metadataKey}")`)
            .within(() => {
                cy.dataCy(ClinicalReviewPage.METADATA_PIN_BUTTON).click();
            });
    }

    public assertMetadataValues(metadata: object, metadataLocator: string) {
        for (const [key, value] of Object.entries(metadata)) {
            cy.get(`[data-cy=${metadataLocator}] > :contains("${key}")`).should(
                "contain.text",
                value,
            );
        }
    }

    private waitForImageRender(): Cypress.Chainable<unknown> {
        return cy
            .get(ClinicalReviewPage.SELECTED_IMAGE, { timeout: 10000 })
            .then({ timeout: 10000 }, ($element) => {
                return new Cypress.Promise((resolve) => {
                    const onLoadEnd = () => {
                        $element[0].removeEventListener("cornerstoneimagerendered", onLoadEnd);
                        console.log("Render image fired");
                        this.imageRenderCount += 1;
                        resolve();
                    };
                    $element[0].addEventListener("cornerstoneimagerendered", onLoadEnd);
                });
            });
    }

    public waitForInitialViewerLoad(): ClinicalReviewPage {
        this.waitForImageRender().then(() => {
            expect(this.imageRenderCount).to.eq(
                1,
                "Wait for first instance cornerstoneimagerendered",
            );
        });
        return this;
    }

    /**
     * @param expectedImageLoads - number of instances of cornerstoneimagerendered expected
     * after scrolling (plus the initial 2 when the page loads)
     * @returns this
     */
    public waitForScrolledImageLoad(expectedImageLoads: number): ClinicalReviewPage {
        this.waitForImageRender().then(() => {
            expect(this.imageRenderCount).to.eq(
                expectedImageLoads,
                `Wait for ${expectedImageLoads} instances of cornerstoneimagerendered`,
            );
        });
        return this;
    }

    public formatDate(text: string): string {
        return moment(String(text)).format("DD/MM/YYYY");
    }

    public assertHeaderDetails(
        patientName: string,
        patientDob: string,
        patientId: string,
        patientSex: string,
        studyDate: string,
    ): ClinicalReviewPage {
        cy.dataCy(ClinicalReviewPage.PATIENT_NAME_VIEWER).should("contain.text", patientName);
        cy.dataCy(ClinicalReviewPage.PATIENT_DOB_VIEWER).should("contain.text", patientDob);
        cy.dataCy(ClinicalReviewPage.PATIENT_ID_VIEWER).should("contain.text", patientId);
        cy.dataCy(ClinicalReviewPage.PATIENT_SEX_VIEWER).should("contain.text", patientSex);
        cy.dataCy(ClinicalReviewPage.STUDY_DATE_VIEWER).should("contain.text", studyDate);

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

    public fillReviewModal(
        signed: boolean,
        reason?: RejectReason,
        description?: string,
    ): ClinicalReviewPage {
        if (reason) {
            cy.get(ClinicalReviewPage.REJECT_REASON_SELECT).click();
            cy.get(ClinicalReviewPage.REJECT_REASONS).contains(reason).click();
        }

        if (description) {
            cy.dataCy(ClinicalReviewPage.DESCRIPTION).type(description);
        }

        if (signed) {
            cy.get(ClinicalReviewPage.CHECKBOX).click();
        }
        return this;
    }

    public assertAcceptWorklistItem() {
        this.acceptRejects(true);
        cy.intercept("GET", "/executions?from=0*", ApiMocks.CLINICAL_REVIEW_REVIEWED);
        this.fillReviewModal(true, undefined, "This looks really good!")
            .acceptRejectModal(true)
            .worklistItemWithText(kellyName)
            .should("not.exist");
    }

    public assertRejectWorklistItem() {
        this.acceptRejects(false);
        cy.intercept("GET", "/executions?from=0*", ApiMocks.CLINICAL_REVIEW_REVIEWED);
        this.fillReviewModal(true, RejectReason.WRONG_DIAGNOSIS, "The diagnosis is wrong!")
            .acceptRejectModal(false)
            .worklistItemWithText(kellyName)
            .should("not.exist");
    }

    public assertDicomSeriesSelector() {
        this.waitForInitialViewerLoad();
        cy.get(".serieslist-header").then((el) => {
            expect(el[0].textContent).to.eq("Hide Series ");
        });
        cy.dataCy(ClinicalReviewPage.SERIES)
            .eq(0)
            .within(() => {
                cy.dataCy(ClinicalReviewPage.MODALITY_LENGTH).then((el) => {
                    expect(el[0].textContent).to.eq(
                        `${ExecutionData.REVIEW_KELLY_MALDONADO.event.origin.series[0]["Modality"]}(22)`,
                    );
                });
                cy.dataCy(ClinicalReviewPage.SERIES_DESCRIPTION).should(
                    "have.text",
                    ExecutionData.REVIEW_KELLY_MALDONADO.event.origin.series[0][
                        "SeriesDescription"
                    ],
                );
            });
    }

    public assertDicomMetadataView() {
        this.waitForInitialViewerLoad();
        cy.intercept(
            "GET",
            "https://demo.orthanc-server.com/instances/*/simplified-tags",
            ApiMocks.REMOTE_DICOM_METADATA,
        );
        this.assertMetadataValues(
            ApiMocks.REMOTE_DICOM_METADATA,
            ClinicalReviewPage.METADATA_SERIES,
        );
    }

    public assertDicomMetadataPinned() {
        this.waitForInitialViewerLoad();
        const metadataToPin = filterObject(
            ApiMocks.REMOTE_DICOM_METADATA,
            (k) => k === "PatientName" || k === "SeriesDescription" || k === "SeriesDate",
        );
        cy.wait(1000); // Re-render issue
        Object.keys(metadataToPin).forEach((k) => this.pinMetadata(k));
        this.assertMetadataValues(metadataToPin, ClinicalReviewPage.PINNED_METADATA);
    }

    public assertDicomViewportDisplay() {
        this.waitForInitialViewerLoad();
    }

    public assertDicomImagesScrolling() {
        this.waitForInitialViewerLoad();
        cy.dataCy(ClinicalReviewPage.DICOM_VIEWPORT).trigger("wheel", "center", { deltaY: 100 });
        this.waitForScrolledImageLoad(2);
    }

    public assertViewerMeasureTool() {
        this.waitForInitialViewerLoad();
        cy.dataCy(ClinicalReviewPage.LENGTH_TOOL).click();
        cy.get("canvas").click().trigger("mousemove", "top").click("top");
    }

    public assertExecutionsPagination() {
        this.worklistItemWithText(kellyName).should("exist");
        cy.get("[aria-label='Previous page']").should("be.disabled");
        cy.get("[aria-label='Next page']").should("be.enabled");
        this.selectNextPage();
        cy.get("[aria-label='Previous page']").should("be.enabled");
        cy.get("[aria-label='Next page']").should("be.disabled");
        this.worklistItemWithText(fionaName).should("exist");
        this.selectPreviousPage();
        this.worklistItemWithText(kellyName).should("exist");
    }

    public assertPageRefresh() {
        this.waitForInitialViewerLoad();
        cy.reload();
        cy.contains("Something unexpected went wrong").should("not.exist");
    }

    public assertNoTasks() {
        cy.visit("/#/clinical-review");
        cy.intercept("/executions*", { body: [], statusCode: 404 }).as("No executions");
        cy.dataCy(ClinicalReviewPage.ACCEPT_BUTTON).should("be.disabled");
        cy.dataCy(ClinicalReviewPage.REJECT_BUTTON).should("be.disabled");
    }
}
