/// <reference types="cypress" />
import { ExecutionData } from "../data/execution";
import { RejectReason } from "../data/rejectReason";
import ClinicalReviewPage from "../pages/clinicalReview";
import { nodeTerminal, a11yConfig } from "utils/a11y_util";
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
})