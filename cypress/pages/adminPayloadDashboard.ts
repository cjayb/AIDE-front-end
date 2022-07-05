import ApiMocks from "../fixtures/mockIndex";
import { IPayload } from "../../src/models/Admin/IPayload";

export default class AdminPayloadDashboardPage {
    //PAYLOADS TABLE
    static PAYLOAD_ID = `payload-id`;
    static PAYLOAD_RECEIVED = `payload-received`;
    static PATIENT_NAME_PAYLOAD = `patient-name-payload`;
    static PATIENT_ID_PAYLOAD = `patient-id-payload`;
    static PAYLOAD = `payload`;
    static SEARCH_PAYLOADS_TABLE = `search-payloads-table`;
    static EXPAND_PAYLOAD = `expand-payload`;

    public assertCorrectTaskReturned(payload: IPayload): void {
        cy.dataCy(AdminPayloadDashboardPage.PAYLOAD)
            .should(`contain`, payload.payload_id)
            .should(`contain`, payload.patient_name);
    }

    public searchIssuesTable(text: string): void {
        if (text !== ``) {
            cy.dataCy(AdminPayloadDashboardPage.SEARCH_PAYLOADS_TABLE).clear().type(text);
        } else {
            cy.dataCy(AdminPayloadDashboardPage.SEARCH_PAYLOADS_TABLE).clear();
        }
    }

    public assertTableDataCorrect(payload: IPayload): void {
        this.getTask(payload.payload_id).within(() => {
            const dateTime = this.formatTaskDate(payload.payload_received);
            cy.dataCy(AdminPayloadDashboardPage.PAYLOAD_ID).should(`contain`, payload.payload_id);
            cy.dataCy(AdminPayloadDashboardPage.PATIENT_NAME_PAYLOAD).should(
                `contain`,
                payload.patient_name,
            );
            cy.dataCy(AdminPayloadDashboardPage.PATIENT_ID_PAYLOAD).should(
                `contain`,
                payload.patient_id,
            );
            cy.dataCy(AdminPayloadDashboardPage.PAYLOAD_RECEIVED).should(`contain`, dateTime);
        });
    }

    public formatTaskDate(payload: string): string {
        const date = payload.split("T")[0].replace(/(\d{4})(\d{2})(\d+)/, "$1-$2-$3");
        const hour = Number(payload.split("T")[1].substring(0, 2));
        const minutes = payload.split("T")[1].substring(4, 2).toString();
        payload = date + " " + (Number(hour) < 10 ? "0" + hour : hour) + ":" + minutes;
        return payload;
    }

    public getTask(payloadId: number): Cypress.Chainable<JQuery> {
        return cy.get(`tbody > :nth-child(${payloadId})`);
    }

    public expandAndViewPayload(payload: IPayload): void {
        const payload_id = payload.payload_id
        cy.intercept(`/api/payloads/${payload_id}/executions`, ApiMocks.ADMIN_DASHBOARD_PAYLOAD_EXECUTIONS).as(`executions`)
        this.getTask(payload_id).within(() => {
            cy.dataCy(AdminPayloadDashboardPage.EXPAND_PAYLOAD);
        });
        cy.wait([`@executions`]);
        Cypress.on(`uncaught:exception`, (err, runnable) => {
            return false;
        });
    }

    public async initPagePayload() {
        cy.intercept(`/api/payloads`, ApiMocks.ADMIN_DASHBOARD_PAYLOAD_TABLE).as(`payloadTable`);
        cy.visit(`/#/admin-payload-dashboard`);
        cy.wait([`@payloadTable`]);
        Cypress.on(`uncaught:exception`, (err, runnable) => {
            return false;
        });
    }
}
