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
}
