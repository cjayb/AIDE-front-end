import TaskList from "./task-list.vue";

describe("<Tasks />", () => {
    it("renders the page with search and radio buttons visible", () => {
        cy.intercept(
            "/clinical-review?pageNumber=1&pageSize=10&patientId=&patientName=&applicationName=",
            {
                data: [],
            },
        );

        cy.mount(TaskList);

        cy.dataCy("radio-buttons").should("be.visible");
        cy.dataCy("worklist-search").should("be.visible");
        cy.dataCy("pagination").should("be.visible");
    });
});
