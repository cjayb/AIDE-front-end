export interface PaginatedWorkflowsResponse {
    totalPages: number;
    totalRecords: number;
    data: WorkflowListItem[];
}

export interface WorkflowListItem {
    workflow_id: string;
    revision: number;
    name: string;
    version: string;
    description: string;
    ae_title: string;
    data_origins: string[];
}

export interface MonaiWorkflow {
    id: string;
    workflow_id: string;
    revision: number;
    workflow: unknown;
}

export interface WorkflowError {
    type: string;
    title: string;
    status: number;
    detail: string;
    instance: string;
    traceId: string;
}
