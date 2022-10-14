import ClinicalReviewPage from "../pages/clinicalReview";

const reviewPage = new ClinicalReviewPage();

describe("Clinical review page", () => {
    beforeEach(() => {
        reviewPage.initPage();
    });

    it("Can view and filter the clinical review worklist", () => {
        reviewPage.assertViewAndFilterWorklist();
    });

    it("Can view patient data fields", () => {
        reviewPage.assertPatientDataFields();
    });

    it("Can accept worklist item", () => {
        reviewPage.assertAcceptWorklistItem();
    });

    it("Can reject worklist item", () => {
        reviewPage.assertRejectWorklistItem();
    });

    it("Can view the dicom series selector'", () => {
        reviewPage.assertDicomSeriesSelector();
    });

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
    });

    it("Dicom Metadata can be pinned", () => {
        reviewPage.assertDicomMetadataPinned();
    });

    it("Dicom viewport displays correctly", () => {
        reviewPage.assertDicomViewportDisplay();
    });

    it("Can scroll through dicom images", () => {
        reviewPage.assertDicomImagesScrolling();
    });

    it("Can use the viewer measure tool", () => {
        reviewPage.assertViewerMeasureTool();
    });

    it("Should paginate executions for review", () => {
        reviewPage.assertExecutionsPagination();
    });

    it("Page refresh occurs without errors", () => {
        reviewPage.assertPageRefresh();
    });
});

describe("Scenarios without standard data setup", () => {
    beforeEach(() => {
        Cypress.on("uncaught:exception", () => {
            //TODO: Remove this once uncaught exceptions have been removed
            return false;
        });
    });
    it("Displays no tasks when there are no executions brought back from the API", () => {
        reviewPage.assertNoTasks();
    });
});
