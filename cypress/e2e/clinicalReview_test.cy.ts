import ClinicalReviewPage from "../pages/clinicalReview";

const reviewPage = new ClinicalReviewPage();

describe("Clinical review page", () => {
    beforeEach(() => {
        reviewPage.initPage();
    });

    it("Can view and filter the clinical review worklist tasks", () => {
        reviewPage.assertViewAndFilterTasks();
    });

    it("Can use pagination to view clinical review worklist tasks", () => {
        reviewPage.assertPaginationandViewTasks();
    });

    it("Can view series selector and DICOMs", () => {
        reviewPage.viewDicomsAndSeriesSelector();
    });

    it("Can view and pin Metadata", () => {
        reviewPage.viewMetadataAndPin();
    });

    it("Can view patient details in top panel", () => {
        reviewPage.assertPatientDetails();
    });

    it("Page refresh occurs without errors", () => {
        reviewPage.assertPageRefresh();
    });
});
