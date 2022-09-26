import {
    PaginatedWorkflowsResponse,
    WorkflowListItem,
} from "../../../src/models/workflows/Workflow";
import ApiMocks from "../../fixtures/mockIndex";

export class WorkflowData implements PaginatedWorkflowsResponse {
    totalPages: number;
    totalRecords: number;
    data: WorkflowListItem[];

    constructor(role: PaginatedWorkflowsResponse) {
        this.totalPages = role.totalPages;
        this.totalRecords = role.totalRecords;
        this.data = role.data;
    }

    public static WORKFLOWS_INIT: WorkflowData = new WorkflowData(
        <PaginatedWorkflowsResponse>ApiMocks.WORKFLOWS,
    );
    public static WORKFLOWS_TEN: WorkflowData = new WorkflowData(
        <PaginatedWorkflowsResponse>ApiMocks.WORKFLOWS_TEN,
    );
}