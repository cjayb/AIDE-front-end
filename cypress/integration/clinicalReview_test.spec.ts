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
        reviewPage.searchWorklist("de")
            .worklistItemWithText(dianeName).click()
            .should("contain.text", dianeName);

        cy.checkA11y(null, a11yConfig, nodeTerminal, true);

        reviewPage.clearWorklistSearch()
            .searchWorklist("Kel")
            .worklistItemWithText(kellyName).click()
                .should("contain.text", kellyName);
    })


    it("Can view patient data fields", () => {
        const patientDob: string = reviewPage.formatDate(ExecutionData.REVIEW_LEONE_GOODPASTURE.event.origin.series[0]["PatientBirthDate"]);
        const patientId = ExecutionData.REVIEW_LEONE_GOODPASTURE.event.origin.series[0]["PatientID"];
        const patientSex = ExecutionData.REVIEW_LEONE_GOODPASTURE.event.origin.series[0]["PatientSex"];
        const studyDate = reviewPage.formatDate(ExecutionData.REVIEW_LEONE_GOODPASTURE.event.origin.series[0]["StudyDate"])
        reviewPage.searchWorklist("leo")
            .worklistItemWithText(leoneName).click();
        reviewPage.assertHeaderDetails(leoneName, patientDob, patientId, patientSex, studyDate);
        cy.checkA11y(null, a11yConfig, nodeTerminal, true);
    })


    it("Can accept worklist item", () => {
        reviewPage.acceptRejects(true);
        cy.intercept('GET', "/executions?from=0*", ApiMocks.CLINICAL_REVIEW_REVIEWED);
        cy.checkA11y(null, a11yConfig, nodeTerminal, true);
        reviewPage.fillReviewModal(true, undefined, "This looks really good!")
            .acceptRejectModal(true)
            .worklistItemWithText(kellyName)
                .should("not.exist");
    })


    it("Can reject worklist item", () => {
        reviewPage.acceptRejects(false);
        cy.intercept('GET', "/executions?from=0*", ApiMocks.CLINICAL_REVIEW_REVIEWED);
        cy.checkA11y(null, a11yConfig, nodeTerminal, true);
        reviewPage.fillReviewModal(true, RejectReason.WRONG_DIAGNOSIS, "The diagnosis is wrong!")
            .acceptRejectModal(false)
            .worklistItemWithText(kellyName)
                .should("not.exist");
    })


    it("Can view the dicom series selector'", () => {
        reviewPage.waitForInitialViewerLoad()
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
        reviewPage.waitForInitialViewerLoad()
        cy.intercept('GET', "https://demo.orthanc-server.com/instances/*/simplified-tags", ApiMocks.REMOTE_DICOM_METADATA)
        reviewPage.assertMetadataValues(ApiMocks.REMOTE_DICOM_METADATA, ClinicalReviewPage.METADATA_SERIES)
    })


    it("Dicom Metadata can be pinned", () => {
        reviewPage.waitForInitialViewerLoad()
        let metadataToPin = filterObject(ApiMocks.REMOTE_DICOM_METADATA, k => k === "PatientName" || k === "SeriesDescription" || k === "SeriesDate");
        cy.wait(1000) // Re-render issue
        Object.keys(metadataToPin).forEach(k => reviewPage.pinMetadata(k));
        reviewPage.assertMetadataValues(metadataToPin, ClinicalReviewPage.PINNED_METADATA)
    })


    it("Dicom viewport displays correctly", () => {
        reviewPage.waitForInitialViewerLoad()
        cy.checkA11y(null, a11yConfig, nodeTerminal, true);
        cy.get(ClinicalReviewPage.SELECTED_IMAGE).percySnapshotElement("Dicom-viewport")
    })


    it("Can scroll through dicom images", () => {
        reviewPage.waitForInitialViewerLoad()
        cy.dataCy(ClinicalReviewPage.DICOM_VIEWPORT).trigger("wheel", "center", { deltaY: 100 })
        reviewPage.waitForScrolledImageLoad(2)
        cy.get(ClinicalReviewPage.SELECTED_IMAGE).percySnapshotElement("Scrolled-dicom")
    })


    it("Can use the viewer measure tool", () => {
        reviewPage.waitForInitialViewerLoad()
        cy.dataCy(ClinicalReviewPage.LENGTH_TOOL).click()
        cy.get("canvas").click().trigger("mousemove", "top").click("top")
        cy.dataCy(ClinicalReviewPage.DICOM_VIEWPORT).percySnapshotElement("Measure-tool")
    })


    it("Should paginate executions for review", () => {
        reviewPage.worklistItemWithText(kellyName)
            .should("exist")
        cy.get("[aria-label='Previous page']").should("be.disabled")
        cy.get("[aria-label='Next page']").should("be.enabled")
        reviewPage.selectNextPage();
        cy.get("[aria-label='Previous page']").should("be.enabled")
        cy.get("[aria-label='Next page']").should("be.disabled")
        reviewPage.worklistItemWithText(fionaName)
            .should("exist")
        reviewPage.selectPreviousPage();
        reviewPage.worklistItemWithText(kellyName)
            .should("exist")
    })

    it("Page refresh occurs without errors", () => {
        reviewPage.waitForInitialViewerLoad();
        cy.reload();
        cy.contains("Something unexpected went wrong").should("not.exist");
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
        cy.visit("/#/clinical-review")
        cy.intercept("/executions*", { body: [], statusCode: 404 }).as("No executions")
        cy.dataCy(ClinicalReviewPage.ACCEPT_BUTTON).should("be.disabled")
        cy.dataCy(ClinicalReviewPage.REJECT_BUTTON).should("be.disabled")
    })
})
