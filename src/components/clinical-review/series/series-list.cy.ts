import { ClinicalReviewSeries } from "@/models/ClinicalReview/ClinicalReviewTask";
import SeriesList from "./series-list.vue";

describe("<series-list />", () => {
    before(() => {
        window.FRONTEND_API_HOST = "http://localhost:8080";
    });

    it("renders series list", () => {
        cy.intercept("/clinical-review/dicom?key=CT000000.dcm", {
            fixture: "clinical-review/CT000000.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("ct");
        cy.intercept("/clinical-review/dicom?key=DO000000.dcm", {
            fixture: "clinical-review/DO000000.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("doc");

        const propsData = {
            showSeries: true,
            study: [
                {
                    series_id: "5910155b-3c21-4438-b00a-27754596dd28",
                    modality: "CT",
                    files: ["CT000000.dcm"],
                },
                {
                    series_id: "7d6563ea-852c-4962-a820-637c681f47f1",
                    modality: "DOC",
                    files: ["DO000000.dcm"],
                },
            ] as ClinicalReviewSeries[],
        };

        cy.mount(SeriesList, { propsData });
        cy.wait("@ct");
        cy.wait("@doc");

        cy.dataCy("series-list").should("be.visible");
        cy.dataCy("series-item").should("have.length", 2);
    });

    it("panel hidden when showSeries is false", () => {
        const propsData = {
            showSeries: false,
            study: [],
        };

        cy.mount(SeriesList, { propsData });
        cy.dataCy("series-list").should("not.be.visible");
    });
});
