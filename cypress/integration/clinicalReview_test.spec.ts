/// <reference types="cypress" />
import { ExecutionData } from "../data/execution";
import { RejectReason } from "../data/rejectReason";
import ClinicalReviewPage from "../pages/clinicalReview";
const reviewPage = new ClinicalReviewPage();
const dianeName = ExecutionData.REVIEW_DIANE_ANDERSON.event.origin.series[0]["PatientName"];
const kellyName = ExecutionData.REVIEW_KELLY_MALDONADO.event.origin.series[0]["PatientName"];
const leoneName = ExecutionData.REVIEW_LEONE_GOODPASTURE.event.origin.series[0]["PatientName"];

describe("Clinical review page", () => {
    beforeEach(() => {
        reviewPage.initPage();
    })

    it("Can view and filter the clinical review worklist", () => {
        reviewPage.searchWorklist("de");
        reviewPage.worklistItemWithText(dianeName).click()
            .should("contain.text", dianeName);

        reviewPage.clearWorklistSearch();
        reviewPage.searchWorklist("Kel")
        reviewPage.worklistItemWithText(kellyName).click()
            .should("contain.text", kellyName);
    })

    it("Can view fields in the Orthanc viewer window", () => {
        const patientDob: string = reviewPage.formatDob(ExecutionData.REVIEW_LEONE_GOODPASTURE.event.origin.series[0]["PatientBirthDate"]);
        const patientId = ExecutionData.REVIEW_LEONE_GOODPASTURE.event.origin.series[0]["PatientID"];
        const patientSex = ExecutionData.REVIEW_LEONE_GOODPASTURE.event.origin.series[0]["PatientSex"];
        reviewPage.searchWorklist("leo");
        reviewPage.worklistItemWithText(leoneName).click();
        reviewPage.assertViewerDetails(leoneName, patientDob, patientId, patientSex);
    })


    it("Can accept worklist item", () => {
        reviewPage.acceptReject(true);
        reviewPage.fillReviewModal(true, undefined, "This looks really good!");
        reviewPage.acceptRejectModal(true);
        reviewPage.worklistItemWithText(kellyName)
            .should("not.exist");
    })

    it("Can reject worklist item", () => {
        reviewPage.acceptReject(false);
        reviewPage.fillReviewModal(true, RejectReason.WRONG_DIAGNOSIS, "The diagnosis is wrong!");
        reviewPage.acceptRejectModal(false);
        reviewPage.worklistItemWithText(kellyName)
            .should("not.exist");
    })
})