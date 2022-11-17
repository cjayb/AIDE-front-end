import ClinicalReviewListItem from "./ClinicalReviewListItem.vue";

describe("<ClinicalReviewListItem />", () => {
    it("renders clinical review item with clinical review task data", () => {
        // see: https://test-utils.vuejs.org/guide/
        const task = {
            _id: "678",
            clinical_review_message: {
                task_id: "",
                reviewed_task_id: "cde",
                execution_id: "677",
                reviewed_execution_id: "abc",
                correlation_id: "123",
                workflow_name: "bobwf",
                patient_metadata: {
                    patient_name: "Joe Batt",
                    patient_id: "1299-123-232-3422",
                    patient_sex: "M",
                    patient_Dob: "10-10-2000",
                    patient_Age: "23",
                },
                files: [],
                reviewer_roles: ["admin", "clinician"],
                application_metadata: {
                    application_name: "stroke model",
                    application_version: "1.1",
                    application_mode: "CU",
                },
            },
            reviewed: false,
            received: new Date(),
        };
        cy.mount(ClinicalReviewListItem as any, {
            propsData: {
                patient_name: task.clinical_review_message.patient_metadata.patient_name,
                patient_id: task.clinical_review_message.patient_metadata.patient_id,
                patient_age: task.clinical_review_message.patient_metadata.patient_Age,
                patient_sex: task.clinical_review_message.patient_metadata.patient_sex,
                application_name:
                    task.clinical_review_message.application_metadata.application_name,
                application_version:
                    task.clinical_review_message.application_metadata.application_version,
                application_mode:
                    task.clinical_review_message.application_metadata.application_mode,
                received: task.received,
            },
        });

        cy.get("[data-cy=patient-name]").should(
            "contain.text",
            task.clinical_review_message.patient_metadata.patient_name,
        );
        cy.get("[data-cy=patient-id]").should(
            "contain.text",
            task.clinical_review_message.patient_metadata.patient_id,
        );
        cy.get("[data-cy=patient-age]").should(
            "contain.text",
            task.clinical_review_message.patient_metadata.patient_Age,
        );
        cy.get("[data-cy=patient-sex]").should(
            "contain.text",
            task.clinical_review_message.patient_metadata.patient_sex,
        );
        cy.get("[data-cy=application]").should(
            "contain.text",
            task.clinical_review_message.application_metadata.application_name,
            task.clinical_review_message.application_metadata.application_version,
        );
        cy.get("[data-cy=mode]").should(
            "contain.text",
            task.clinical_review_message.application_metadata.application_mode,
        );
        cy.get("[data-cy=received]").should("contain.text", task.received);
    });
});
