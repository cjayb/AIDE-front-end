import { PaginatedWorkflowsResponse, WorkflowListItem } from "@/models/workflows/Workflow";
import { createAxiosInstance, ErrorMessageMap, isResultOk } from "@/utils/axios-helpers";

const errorMessagesWorkflows: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving workflows",
    put: "Something unexpected went wrong updating the workflow details",
    post: "Something unexpected went wrong creating the workflow",
    delete: "Something unexpected went wrong deleting the workflow",
};

const httpWorkflows = createAxiosInstance(errorMessagesWorkflows);

interface QueryParams {
    itemsPerPage: number;
    page: number;
}

export async function getAllWorkflows(query: QueryParams): Promise<PaginatedWorkflowsResponse> {
    const params = new URLSearchParams({
        pageNumber: `${query.page}`,
        pageSize: `${query.itemsPerPage}`,
    });

    const response = await httpWorkflows.get<PaginatedWorkflowsResponse>(`/workflows?${params}`);

    const defaultData = { totalPages: 0, totalRecords: 0, data: [] };

    return isResultOk(response) ? response.data : defaultData;
}

export async function updateWorkflow(
    workflowId: string,
    workflow: WorkflowListItem,
): Promise<boolean> {
    try {
        const result = await httpWorkflows.put(`/workflows/${workflowId}`, workflow);
        return isResultOk(result);
    } catch {
        return false;
    }
}

export async function createWorkflow(workflow: WorkflowListItem): Promise<boolean> {
    try {
        const result = await httpWorkflows.post("/workflows", workflow);
        return isResultOk(result);
    } catch {
        return false;
    }
}

export async function deleteWorkflow(workflowId: string): Promise<boolean> {
    try {
        const result = await httpWorkflows.delete(`/workflows/${workflowId}`);
        return isResultOk(result);
    } catch {
        return false;
    }
}
