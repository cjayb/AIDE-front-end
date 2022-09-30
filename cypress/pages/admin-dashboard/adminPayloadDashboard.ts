import ApiMocks from "../../fixtures/mockIndex";
import { IPayload } from "../../../src/models/Admin/IPayload";
import { IIssue } from "../../../src/models/Admin/IIssue";
import { ExecutionTreeRoot } from "../../../src/utils/workflow-instance-mapper";
import { formatDateString } from "../../../src/utils/date-utilities";

export default class AdminPayloadDashboardPage {
    //PAYLOADS TABLE
    static PAYLOAD_ID = `payload-id`;
    static PAYLOAD_RECEIVED = `payload-received`;
    static PATIENT_NAME_PAYLOAD = `patient-name-payload`;
    static PATIENT_ID_PAYLOAD = `patient-id-payload`;
    static PAYLOAD = `payload`;
    static SEARCH_PAYLOADS_TABLE = `search-payloads-table`;
    static ZOOM_IN = "zoom-in";
    static ZOOM_OUT = "zoom-out";
    static RESET = "reset";
    static VIEW_LOGS_BUTTON = "view-node-logs";
    static LOGS = "logs";

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

    public getTask(payloadId: number): Cypress.Chainable<JQuery> {
        return cy.get(`tbody > :nth-child(${payloadId})`);
    }

    public expandAndViewTree(payload: IPayload): void {
        const payload_id = payload.payload_id;
        cy.intercept(
            `/payloads/${payload_id}/executions`,
            ApiMocks.ADMIN_DASHBOARD_PAYLOAD_EXECUTIONS,
        ).as(`executions`);
        cy.get(`tbody > :nth-child(${payload_id}) > :nth-child(1)`).should(`exist`).click();
        cy.wait([`@executions`]);
        cy.intercept(`/executions/*/tasks/*/artifacts`, {});
        Cypress.on(`uncaught:exception`, () => {
            return false;
        });
    }

    public async initPagePayload() {
        cy.intercept(`/payloads`, ApiMocks.ADMIN_DASHBOARD_PAYLOAD_TABLE).as(`payloadTable`);
        cy.visit(`/#/admin-payload-dashboard`);
        cy.wait([`@payloadTable`]);
        Cypress.on(`uncaught:exception`, () => {
            return false;
        });
    }

    public assertModelNameCorrect(payload: ExecutionTreeRoot): void {
        const tuple: string[][] = [];

        payload.children.forEach((c) => {
            tuple.push([`"name ${c.name}"`, c.name]);

            c.children.forEach((gc) => {
                tuple.push([`"name ${gc.name}"`, gc.name]);
            });
        });

        tuple.forEach(($type) => {
            const [name, dateTime] = $type;
            cy.dataCy(name).should("contain", formatDateString(dateTime));
        });

        tuple.forEach(($type) => {
            const [Model_number, model_name] = $type;
            cy.dataCy(Model_number).should("contain", model_name);
        });
    }

    public assertModelNameMatchesPopover(payload: ExecutionTreeRoot): void {
        const tuple: string[][] = [];

        payload.children.forEach((c) => {
            c.children.forEach((gc) => {
                tuple.push([`"date ${gc.name}"`, gc.name]);
            });
        });
        tuple.forEach(($type) => {
            const [node, model_name] = $type;
            cy.dataCy(node).click();
            cy.dataCy("selected-node-name").should("contain", model_name);
        });
    }

    public assertModelColourMatchesPopover(payload: ExecutionTreeRoot): void {
        const statusBg = (status: string) => {
            switch (status) {
                case "Succeeded":
                case "succeeded":
                    return "light-green lighten-4";

                case "Failed":
                case "failed":
                    return "red lighten-4";

                default:
                    return "orange lighten-4";
            }
        };

        const tuple: string[][] = [];

        payload.children.forEach((c) => {
            c.children.forEach((gc) => {
                tuple.push([`"node ${gc.name}"`, gc.status, statusBg(gc.status)]);
            });
        });

        tuple.forEach(($type) => {
            const [node, node_colour, popover_status_colour] = $type;
            cy.dataCy(node).click();
            cy.dataCy(node).should("have.attr", "class").and("contain", node_colour);
            cy.dataCy("selected-node-status")
                .should("have.attr", "class")
                .and("contain", popover_status_colour);
        });
    }

    public assertModelDateCorrect(payload: ExecutionTreeRoot): void {
        const tuple: string[][] = [];

        payload.children.forEach((c) => {
            tuple.push([`"date ${c.name}"`, c.start_date]);

            c.children.forEach((gc) => {
                tuple.push([`"date ${gc.name}"`, gc.start_date]);
            });
        });

        tuple.forEach(($type) => {
            const [name, dateTime] = $type;
            cy.dataCy(name).should("contain", formatDateString(dateTime));
        });
    }

    public assertNodeColour(payload: ExecutionTreeRoot): void {
        const tuple: string[][] = [];

        payload.children.forEach((c) => {
            tuple.push([`"node ${c.name}"`, c.status]);

            c.children.forEach((gc) => {
                tuple.push([`"node ${gc.name}"`, gc.status]);
            });
        });

        tuple.forEach(($type) => {
            const [node, style] = $type;
            cy.dataCy(node).should("have.attr", "class").and("contain", style);
        });
    }

    public clickZoomIn(): void {
        cy.dataCy(AdminPayloadDashboardPage.ZOOM_IN).click().click().click();
    }

    public clickZoomOut(): void {
        cy.dataCy(AdminPayloadDashboardPage.ZOOM_OUT).click().click().click();
    }

    public clickReset(): void {
        cy.dataCy(AdminPayloadDashboardPage.RESET).click();
    }

    public formatTaskDate(payload: string): string {
        const date = payload.split("T")[0].replace(/(\d{4})(\d{2})(\d+)/, "$1-$2-$3");
        const hour = Number(payload.split("T")[1].substring(0, 2));
        const minutes = payload.split("T")[1].substring(4, 2).toString();
        payload = date + " " + (Number(hour) < 10 ? "0" + hour : hour) + ":" + minutes;
        return payload;
    }

    public async initPagePayloadApiError(error: number) {
        cy.intercept(`/payloads`, { statusCode: error }).as(`payloadTable`);
        cy.visit(`/#/admin-payload-dashboard`);
        cy.wait([`@payloadTable`]);
        Cypress.on(`uncaught:exception`, () => {
            return false;
        });
    }

    public async initPagePayloadTreeApiError(error: number) {
        cy.intercept(`/payloads`, { statusCode: error }).as(`payloadTable`);
        cy.visit(`/#/admin-payload-dashboard`);
        cy.wait([`@payloadTable`]);
        Cypress.on(`uncaught:exception`, () => {
            return false;
        });
    }

    public assertLatestErrorContainsMessage(text: string): void {
        cy.get("[class=v-toast__text]").should("have.text", text);
    }

    public expandAndViewTreeWithoutData(payload: IPayload): void {
        const payload_id = payload.payload_id;
        cy.intercept(`/payloads/${payload_id}/executions`, { statusCode: 400 }).as(`executions`);
        cy.get(`tbody > :nth-child(${payload_id}) > :nth-child(1)`).should(`exist`).click();
        cy.wait([`@executions`]);
        Cypress.on(`uncaught:exception`, () => {
            return false;
        });
    }

    public assertPopoverLogsDisplayed(task: IIssue): void {
        cy.dataCy('"name export-task-connectathon2"').click();

        cy.intercept(`/api/logs/*`, ApiMocks.ADMIN_DASHBOARD_EXECUTION_LOGS).as(`Logs`);

        cy.dataCy(AdminPayloadDashboardPage.VIEW_LOGS_BUTTON).click();
        this.getTask(task.task_id).within(() => {
            cy.wait([`@Logs`]);
            Cypress.on(`uncaught:exception`, () => {
                return false;
            });
        });
        this.assertPopoverExecutionLogs(ApiMocks.ADMIN_DASHBOARD_EXECUTION_LOGS[0].msg);
        cy.get(".v-card__actions > :nth-child(2)").click();
    }

    public assertPopoverExecutionLogs(text: string): void {
        cy.dataCy(AdminPayloadDashboardPage.LOGS).should("contain.text", text);
    }
}
``;
