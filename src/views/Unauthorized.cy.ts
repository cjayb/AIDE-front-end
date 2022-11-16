import Unauthorized from "./Unauthorized.vue";

describe("<Unauthorized />", () => {
    it("renders", () => {
        // see: https://test-utils.vuejs.org/guide/
        cy.mount(Unauthorized);
    });
});
