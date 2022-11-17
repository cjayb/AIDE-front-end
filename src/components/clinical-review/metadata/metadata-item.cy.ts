import MetadataItem from "./metadata-item.vue";

describe("<metadata-item />", () => {
    it("renders with name and value", () => {
        cy.mount(MetadataItem, { propsData: { name: "Metadata Name", value: "Metadata Value" } });

        cy.dataCy("metadata-name").should("contain.text", "Metadata Name");
        cy.dataCy("metadata-value").should("contain.text", "Metadata Value");
        cy.dataCy("metadata-item").should("not.have.class", "outlined");
    });

    it("renders with name, value and pinned", () => {
        cy.mount(MetadataItem, {
            propsData: { name: "Metadata Name", value: "Metadata Value", pinned: true },
        });

        cy.dataCy("metadata-name").should("contain.text", "Metadata Name");
        cy.dataCy("metadata-value").should("contain.text", "Metadata Value");
        cy.dataCy("metadata-item").should("have.class", "outlined");
    });
});
