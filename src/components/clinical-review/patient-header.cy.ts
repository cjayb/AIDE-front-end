import { PatientMetadata } from "@/models/ClinicalReview/ClinicalReviewTask";
import { formatDate, formatDateTime } from "@/utils/date-utilities";
import PatientHeader from "./patient-header.vue";

describe("<patient-header />", () => {
    it("renders patient information", () => {
        const patientMetadata: PatientMetadata = {
            patient_name: "Joe Bloggs",
            patient_age: "20",
            patient_dob: "2002-01-01",
            patient_id: "some-patient-id",
            patient_sex: "M",
        };

        const propsData = {
            patientMetadata,
            studyDate: "2022-11-11T11:11:11",
        };

        cy.mount(PatientHeader, { propsData });

        cy.dataCy("patient-name").should("contain.text", patientMetadata.patient_name);
        cy.dataCy("patient-age").should("contain.text", patientMetadata.patient_age);
        cy.dataCy("patient-dob").should("contain.text", formatDate(patientMetadata.patient_dob));
        cy.dataCy("patient-id").should("contain.text", patientMetadata.patient_id);
        cy.dataCy("patient-sex").should("contain.text", patientMetadata.patient_sex);
        cy.dataCy("study-date").should("contain.text", formatDateTime(propsData.studyDate));

        cy.dataCy("accept-task").should("be.enabled");
        cy.dataCy("reject-task").should("be.enabled");
    });
});
