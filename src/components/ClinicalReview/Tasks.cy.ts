import { PagedClinicalReviewList } from "@/models/ClinicalReview/ClinicalReviewTask";
import Tasks from "./Tasks.vue";

describe("<Tasks />", () => {
    it("renders the page with search and radio buttons visible", () => {
        // see: https://test-utils.vuejs.org/guide/
        cy.mount(Tasks);

        cy.get("[data-cy=radio-buttons]").should("be.visible");
        cy.get("[data-cy=worklist-search]").should("be.visible");
    });
});
