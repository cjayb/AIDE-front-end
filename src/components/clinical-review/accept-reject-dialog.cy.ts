import AcceptRejectDialog from "./accept-reject-dialog.vue";

describe("<accept-reject-dialog />", () => {
    it("renders accept modal", () => {
        cy.mount(AcceptRejectDialog, {
            propsData: {
                open: true,
                reject: false,
                applicationName: "AMAZING AI",
            },
        });

        cy.dataCy("accept-reject-modal-title").should("contain.text", "Accept");
        cy.dataCy("accept-reject-modal-title").should("contain.text", "AMAZING AI");
    });

    it("renders reject modal", () => {
        cy.mount(AcceptRejectDialog, {
            propsData: {
                open: true,
                reject: true,
                applicationName: "AMAZING AI",
            },
        });

        cy.dataCy("accept-reject-modal-title").should("contain.text", "Reject");
        cy.dataCy("accept-reject-modal-title").should("contain.text", "AMAZING AI");
        cy.dataCy("reject-reason").should("be.enabled");
    });
});
