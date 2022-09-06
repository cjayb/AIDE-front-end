import ApiMocks from "../fixtures/mockIndex";
import { IPayload, IPayloadExecutions } from "../../src/models/Admin/IPayload";
import { IIssue } from "../../src/models/Admin/IIssue";

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
            `/api/payloads/${payload_id}/executions`,
            ApiMocks.ADMIN_DASHBOARD_PAYLOAD_EXECUTIONS,
        ).as(`executions`);
        cy.get(`tbody > :nth-child(${payload_id}) > :nth-child(1)`).should(`exist`).click();
        cy.wait([`@executions`]);
        Cypress.on(`uncaught:exception`, () => {
            return false;
        });
    }

    public async initPagePayload() {
        cy.intercept(`/api/payloads`, ApiMocks.ADMIN_DASHBOARD_PAYLOAD_TABLE).as(`payloadTable`);
        cy.visit(`/#/admin-payload-dashboard`);
        cy.wait([`@payloadTable`]);
        Cypress.on(`uncaught:exception`, () => {
            return false;
        });
    }

    public assertModelNameCorrect(payload: IPayloadExecutions): void {
        const tuple = [
            ['"name Dicom Received"', payload.model_name],
            ['"name Model 1"', payload.executions[0].model_name],
            ['"name Model 2"', payload.executions[1].model_name],
            ['"name Model 3"', payload.executions[0].executions[0].model_name],
            ['"name Model 4"', payload.executions[0].executions[1].model_name],
            ['"name Model 5"', payload.executions[1].executions[0].model_name],
            ['"name Model 6"', payload.executions[1].executions[1].model_name],
        ];
        tuple.forEach(($type) => {
            const [Model_number, model_name] = $type;
            cy.dataCy(Model_number).should("contain", model_name);
        });
    }

    public assertModelNameMatchesPopover(payload: IPayloadExecutions): void {
        const tuple = [
            ['"node Dicom Received"', payload.model_name],
            ['"node Model 1"', payload.executions[0].model_name],
            ['"node Model 2"', payload.executions[1].model_name],
            ['"node Model 3"', payload.executions[0].executions[0].model_name],
            ['"node Model 4"', payload.executions[0].executions[1].model_name],
            ['"node Model 5"', payload.executions[1].executions[0].model_name],
            ['"node Model 6"', payload.executions[1].executions[1].model_name],
        ];
        tuple.forEach(($type) => {
            const [node, model_name] = $type;
            cy.dataCy(node).click();
            cy.dataCy("selected-node-name").should("contain", model_name);
        });
    }

    public assertModelColourMatchesPopover(): void {
        const tuple = [
            [
                '"node Dicom Received"',
                "background: green; border: 2px solid black; border-radius: 50%;",
                "light-green",
            ],
            [
                '"node Model 1"',
                "background: red; border-radius: 50%; border: 2px solid black;",
                "red",
            ],
            [
                '"node Model 2"',
                "background: green; border-radius: 50%; border: 2px solid black;",
                "light-green",
            ],
            [
                '"node Model 3"',
                "background: green; border-radius: 50%; border: 2px solid black;",
                "light-green",
            ],
            [
                '"node Model 4"',
                "background: red; border-radius: 50%; border: 2px solid black;",
                "red",
            ],
            [
                '"node Model 5"',
                "background: red; border-radius: 50%; border: 2px solid black;",
                "red",
            ],
            [
                '"node Model 6"',
                "background: green; border-radius: 50%; border: 2px solid black;",
                "light-green",
            ],
        ];
        tuple.forEach(($type) => {
            const [node, node_colour, popover_status_colour] = $type;
            cy.dataCy(node).click();
            cy.dataCy(node).should("have.attr", "style", node_colour);
            cy.dataCy("selected-node-status").should("have.class", popover_status_colour);
        });
    }

    public assertModelDateCorrect(payload: IPayloadExecutions): void {
        const tuple = [
            ['"date Dicom Received"', payload.execution_finished],
            ['"date Model 1"', payload.executions[0].execution_finished],
            ['"date Model 2"', payload.executions[1].execution_finished],
            ['"date Model 3"', payload.executions[0].executions[0].execution_finished],
            ['"date Model 4"', payload.executions[0].executions[1].execution_finished],
            ['"date Model 5"', payload.executions[1].executions[0].execution_finished],
            ['"date Model 6"', payload.executions[1].executions[1].execution_finished],
        ];
        tuple.forEach(($type) => {
            const [Model_number, dateTime] = $type;
            const DateTime = this.formatDateAndTimeOfString(dateTime as string);
            cy.dataCy(Model_number).should("contain", DateTime);
        });
    }

    public assertNodeColour(): void {
        const tuple = [
            [
                '"node Dicom Received"',
                "background: green; border: 2px solid black; border-radius: 50%;",
            ],
            ['"node Model 1"', "background: red; border-radius: 50%;"],
            ['"node Model 2"', "background: green; border-radius: 50%;"],
            ['"node Model 3"', "background: green; border-radius: 50%;"],
            ['"node Model 4"', "background: red; border-radius: 50%;"],
            ['"node Model 5"', "background: red; border-radius: 50%;"],
            ['"node Model 6"', "background: green; border-radius: 50%;"],
        ];
        tuple.forEach(($type) => {
            const [node, style] = $type;
            cy.dataCy(node).should("have.attr", "style", style);
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

    public formatDateAndTimeOfString(item: string): string {
        const date = item.split("T")[0].replace(/(\d{4})(\d{2})(\d+)/, "$1-$2-$3");
        const hour = Number(item.split("T")[1].substring(0, 2));
        const minutes = item.split("T")[1].substring(2, 2).toString();
        return (item = date + " " + (Number(hour) < 10 ? "0" + hour : hour) + ":" + minutes);
    }

    public formatTaskDate(payload: string): string {
        const date = payload.split("T")[0].replace(/(\d{4})(\d{2})(\d+)/, "$1-$2-$3");
        const hour = Number(payload.split("T")[1].substring(0, 2));
        const minutes = payload.split("T")[1].substring(4, 2).toString();
        payload = date + " " + (Number(hour) < 10 ? "0" + hour : hour) + ":" + minutes;
        return payload;
    }

    public async initPagePayloadApiError(error: number) {
        cy.intercept(`/api/payloads`, { statusCode: error }).as(`payloadTable`);
        cy.visit(`/#/admin-payload-dashboard`);
        cy.wait([`@payloadTable`]);
        Cypress.on(`uncaught:exception`, () => {
            return false;
        });
    }

    public async initPagePayloadTreeApiError(error: number) {
        cy.intercept(`/api/payloads`, { statusCode: error }).as(`payloadTable`);
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
        cy.intercept(`/api/payloads/${payload_id}/executions`, { statusCode: 400 }).as(
            `executions`,
        );
        cy.get(`tbody > :nth-child(${payload_id}) > :nth-child(1)`).should(`exist`).click();
        cy.wait([`@executions`]);
        Cypress.on(`uncaught:exception`, () => {
            return false;
        });
    }

    public assertPopoverLogsDisplayed(task: IIssue): void {
        cy.intercept(`/api/logs/${task.task_id}`, ApiMocks.ADMIN_DASHBOARD_EXECUTION_LOGS).as(
            `Logs`,
        );

        cy.dataCy(AdminPayloadDashboardPage.VIEW_LOGS_BUTTON).click();
        this.getTask(task.task_id).within(() => {
            cy.wait([`@Logs`]);
            Cypress.on(`uncaught:exception`, () => {
                return false;
            });
        });
        this.assertPopoverExecutionLogs(ApiMocks.ADMIN_DASHBOARD_EXECUTION_LOGS[0].msg);
    }

    public assertPopoverExecutionLogs(text: string): void {
        cy.dataCy(AdminPayloadDashboardPage.LOGS).should("contain.text", text);
    }
}
``;
