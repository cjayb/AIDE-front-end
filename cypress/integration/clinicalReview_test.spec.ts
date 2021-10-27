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


    it("Can view fields in the Orthanc viewer window", () => {
        const patientDob: string = reviewPage.formatDob(ExecutionData.REVIEW_LEONE_GOODPASTURE.event.origin.series[0]["PatientBirthDate"]);
        const patientId = ExecutionData.REVIEW_LEONE_GOODPASTURE.event.origin.series[0]["PatientID"];
        const patientSex = ExecutionData.REVIEW_LEONE_GOODPASTURE.event.origin.series[0]["PatientSex"];
        reviewPage.searchWorklist("leo")
            .worklistItemWithText(leoneName).click();
        reviewPage.assertViewerDetails(leoneName, patientDob, patientId, patientSex);
        cy.checkA11y(null, a11yConfig, nodeTerminal, true);
    })


    it("Can accept worklist item", () => {
        reviewPage.acceptReject(true);
        cy.checkA11y(null, a11yConfig, nodeTerminal, true);
        reviewPage.fillReviewModal(true, undefined, "This looks really good!")
            .acceptRejectModal(true)
            .worklistItemWithText(kellyName)
                .should("not.exist");
    })


    it("Can reject worklist item", () => {
        reviewPage.acceptReject(false);
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
            expect(el[0].textContent).to.eq("Series ")
        })
        cy.dataCy(ClinicalReviewPage.SERIES).eq(0).within(() => {
            cy.dataCy(ClinicalReviewPage.MODALITY_LENGTH).then((el) => {
                expect(el[0].textContent).to.eq(`${ExecutionData.REVIEW_KELLY_MALDONADO.event.origin.series[0]["Modality"]} (22)`)
            })
            cy.dataCy(ClinicalReviewPage.SERIES_DESCRIPTION)
                .should("have.text", ExecutionData.REVIEW_KELLY_MALDONADO.event.origin.series[0]["SeriesDescription"])
        })
    })


    it("Can change dicom series selected", () => {
        reviewPage.waitForInitialViewerLoad()
        cy.dataCy(ClinicalReviewPage.SERIES).eq(1).click().within(() => {
            cy.dataCy(ClinicalReviewPage.MODALITY_LENGTH).then((el) => {
                expect(el[0].textContent).to.eq(`MR (100)`)
            })
            cy.dataCy(ClinicalReviewPage.SERIES_DESCRIPTION)
                .should("have.text", "T1/3D/FFE/C")
        })
    })


    it("Dicom Metadata can be viewed", () => {
        reviewPage.waitForInitialViewerLoad()
        cy.intercept('GET', "https://demo.orthanc-server.com/instances/*/simplified-tags", ApiMocks.REMOTE_DICOM_METADATA)
        reviewPage.assertMetadataValues(ApiMocks.REMOTE_DICOM_METADATA, ClinicalReviewPage.METADATA_SERIES)
    })


    it("Dicom Metadata can be pinned", () => {
        reviewPage.waitForInitialViewerLoad()
        let metadataToPin = filterObject(ApiMocks.REMOTE_DICOM_METADATA, k => k === "PatientName" || k === "SeriesDescription" || k === "SeriesDate");
        Object.keys(metadataToPin).forEach(k => reviewPage.pinMetadata(k));
        reviewPage.assertMetadataValues(metadataToPin, ClinicalReviewPage.PINNED_METADATA)
    })


    it("Dicom viewport displays correctly", () => {
        reviewPage.waitForInitialViewerLoad()
        cy.get(ClinicalReviewPage.SELECTED_IMAGE).percySnapshotElement("Dicom-viewport")
    })


    it("Can scroll through dicom images", () => {
        reviewPage.waitForInitialViewerLoad()
        cy.dataCy(ClinicalReviewPage.DICOM_VIEWPORT).trigger("wheel", "center", { deltaY: 100 })
        reviewPage.waitForScrolledImageLoad(2)
        cy.get(ClinicalReviewPage.SELECTED_IMAGE).percySnapshotElement("Scrolled-dicom")
    })
})