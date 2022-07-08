/// <reference types="cypress" />
import { ExecutionData } from "../data/execution";
import { RejectReason } from "../data/rejectReason";
import ClinicalReviewPage from "../pages/clinicalReview";
import { nodeTerminal, a11yConfig } from "utils/a11y_util";
import ApiMocks from "fixtures/mockIndex";
import { filterObject } from "utils/data_util";
const reviewPage = new ClinicalReviewPage();
const dianeName = ExecutionData.REVIEW_DIANE_ANDERSON.event.origin.series[0]["PatientName"];
const kellyName = ExecutionData.REVIEW_KELLY_MALDONADO.event.origin.series[0]["PatientName"];
const leoneName = ExecutionData.REVIEW_LEONE_GOODPASTURE.event.origin.series[0]["PatientName"];
const fionaName = "Fiona";

describe("Clinical review page", () => {
    beforeEach(() => {
        reviewPage.initPage();
        cy.injectAxe();
    })


    it("Can view and filter the clinical review worklist", () => {
        reviewPage.assertViewAndFilterWorklist();
    })


    it("Can view patient data fields", () => {
        reviewPage.assertPatientDataFields();
    })


    it("Can accept worklist item", () => {
        reviewPage.assertAcceptWorklistItem();
    })


    it("Can reject worklist item", () => {
        reviewPage.assertRejectWorklistItem();
    })


    it("Can view the dicom series selector'", () => {
        reviewPage.assertDicomSeriesSelector();
    })

//Bug raised: 1192
    // it("Can change dicom series selected", () => {
    //     reviewPage.waitForInitialViewerLoad()
    //     cy.dataCy(ClinicalReviewPage.SERIES).eq(1).click().within(() => {
    //         cy.dataCy(ClinicalReviewPage.MODALITY_LENGTH).then((el) => {
    //             expect(el[0].textContent).to.satisfy(function (string) {
    //                 return string === "MR(22)" || string === "MR(100)"
    //             })
    //         })
    //         cy.dataCy(ClinicalReviewPage.SERIES_DESCRIPTION)
    //             .should("have.text", "T1/3D/FFE/C")
    //     })
    // })


    it("Dicom Metadata can be viewed", () => {
        reviewPage.assertDicomMetadataView();
    })


    it("Dicom Metadata can be pinned", () => {
        reviewPage.assertDicomMetadataPinned();
    })


    it("Dicom viewport displays correctly", () => {
        reviewPage.assertDicomViewportDisplay();
    })


    it("Can scroll through dicom images", () => {
        reviewPage.assertDicomImagesScrolling();
    })


    it("Can use the viewer measure tool", () => {
        reviewPage.assertViewerMeasureTool();
    })


    it("Should paginate executions for review", () => {
        reviewPage.assertExecutionsPagination();
    })

    it("Page refresh occurs without errors", () => {
        reviewPage.assertPageRefresh();
    });
})

describe("Scenarios without standard data setup", () => {
    beforeEach(() => {
        Cypress.on("uncaught:exception", (err, runnable) => {
            //TODO: Remove this once uncaught exceptions have been removed
            return false;
        });
    })
    it("Displays no tasks when there are no executions brought back from the API", () => {
        reviewPage.assertNoTasks();
    })
})