import SeriesItem from "./series-item.vue";

describe("<series-item />", () => {
    before(() => {
        window.FRONTEND_API_HOST = "http://localhost:8080";
    });

    it("renders modality and slice count correctly", () => {
        cy.intercept("/clinical-review/dicom?key=CT000000.dcm", {
            fixture: "clinical-review/CT000000.dcm,null",
            headers: {
                "content-type": "application/dicom",
            },
        }).as("ct");

        const propsData = {
            series: {
                series_uid: "5910155b-3c21-4438-b00a-27754596dd28",
                modality: "CT",
                files: ["CT000000.dcm"],
            },
        };

        cy.mount(SeriesItem, { propsData });
        cy.wait("@ct");

        cy.dataCy("series-title").should("contain.text", "CT (1)");
    });
});
