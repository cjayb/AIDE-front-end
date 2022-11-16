import RoleModal from "./RoleModal.vue";

describe("<RoleModal />", () => {
    it("renders the modal with no role", () => {
        cy.mount(RoleModal, { propsData: { role: {} } });
        cy.get("[data-cy=role-modal-title]").should("contain.text", "Add");
        cy.get("[data-cy=role-modal-save]").should("be.disabled");
    });

    it("renders modal with existing role", () => {
        // see: https://test-utils.vuejs.org/guide/
        const role = { id: "some-id", name: "Some role" };
        cy.mount(RoleModal, { propsData: { role } });

        cy.get("[data-cy=role-modal-title]").should("contain.text", "Edit");
        cy.get("[data-cy=role-modal-save]").should("be.enabled");
    });

    it("renders validation message when name is deleted", () => {
        // see: https://test-utils.vuejs.org/guide/
        const role = { id: "some-id", name: "Some role" };
        cy.mount(RoleModal, { propsData: { role } });

        cy.get("[data-cy=role-modal-title]").should("contain.text", "Edit");
        cy.get("[data-cy=role-modal-save]").should("be.enabled");

        cy.get("[data-cy=role-name]").clear();
        cy.get("[data-cy=role-modal-save]").should("be.disabled");
    });
});
