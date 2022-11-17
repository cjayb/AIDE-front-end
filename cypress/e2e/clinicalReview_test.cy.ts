import ClinicalReviewPage from "../pages/clinicalReview";

const reviewPage = new ClinicalReviewPage();

describe("Clinical review page", () => {
    beforeEach(() => {
        reviewPage.initPage();
    });

    it("Can view and filter the clinical review worklist tasks", () => {
        reviewPage.assertViewAndFilterTasks();
    });

    it("Can use pagination to view clinical review tasks", () => {
        reviewPage.assertPaginationandViewTasks();
    });

    it.skip("Can accept worklist item", () => {
        reviewPage.assertAcceptWorklistItem();
    });

    it.skip("Can reject worklist item", () => {
        reviewPage.assertRejectWorklistItem();
    });

    it.skip("Can view the dicom series selector'", () => {
        reviewPage.assertDicomSeriesSelector();
    });

    it.skip("Can change dicom series selected", () => {
        reviewPage.waitForInitialViewerLoad();
        cy.dataCy(ClinicalReviewPage.SERIES)
            .eq(1)
            .click()
            .within(() => {
                cy.dataCy(ClinicalReviewPage.MODALITY_LENGTH).then((el) => {
                    expect(el[0].textContent).to.satisfy(function (string) {
                        return string === "MR(22)" || string === "MR(100)";
                    });
                });
                cy.dataCy(ClinicalReviewPage.SERIES_DESCRIPTION).should("have.text", "T1/3D/FFE/C");
            });
    });

    it.skip("Dicom Metadata can be viewed", () => {
        reviewPage.assertDicomMetadataView();
    });

    it.skip("Dicom Metadata can be pinned", () => {
        reviewPage.assertDicomMetadataPinned();
    });

    it.skip("Dicom viewport displays correctly", () => {
        reviewPage.assertDicomViewportDisplay();
    });

    it.skip("Can scroll through dicom images", () => {
        reviewPage.assertDicomImagesScrolling();
    });

    it.skip("Can use the viewer measure tool", () => {
        reviewPage.assertViewerMeasureTool();
    });

    it.skip("Should paginate executions for review", () => {
        reviewPage.assertExecutionsPagination();
    });

    it.skip("Page refresh occurs without errors", () => {
        reviewPage.assertPageRefresh();
    });
});

describe.skip("Scenarios without standard data setup", () => {
    beforeEach(() => {
        Cypress.on("uncaught:exception", () => {
            //TODO: Remove this once uncaught exceptions have been removed
            return false;
        });
    });
    it.skip("Displays no tasks when there are no executions brought back from the API", () => {
        reviewPage.assertNoTasks();
    });
});
