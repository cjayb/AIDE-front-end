import { IPagedResponse, IPayload, WorkflowInstance } from "@/models/Admin/IPayload";
import { createAxiosInstance, ErrorMessageMap, isResultOk } from "@/utils/axios-helpers";

const errorMessages: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving executions!",
    post: "Something unexpected went wrong retrieving executions!",
};

const http = createAxiosInstance(errorMessages);

interface QueryParams {
    page: number;
    itemsPerPage: number;
    patientName?: string;
    patientId?: string;
}

// Payloads Section
export async function getPayloads(query: QueryParams): Promise<IPagedResponse<IPayload>> {
    const params = new URLSearchParams({
        pageNumber: `${query.page}`,
        pageSize: `${query.itemsPerPage}`,
        patientId: query.patientId ?? "",
        patientName: query.patientName ?? "",
    });

    const defaultData = {
        pageNumber: 0,
        pageSize: 0,
        firstPage: "",
        lastPage: "",
        totalPages: 0,
        totalRecords: 0,
        nextPage: "",
        previousPage: "",
        data: [],
    };

    const response = await http.get<IPagedResponse<IPayload>>(`/payloads?${params}`);
    return isResultOk(response) ? response.data : defaultData;
}

export async function getPayloadExecutions(payload_id: string): Promise<WorkflowInstance[]> {
    const response = await http.get(`/payloads/${payload_id}/executions`);

    return response.data;
}

export async function getPayloadExecutionArtifacts(
    workflow_instance_id: string,
    execution_id: string,
): Promise<{ [key: string]: string }> {
    const response = await http.get<{ [key: string]: string }>(
        `/executions/${workflow_instance_id}/tasks/${execution_id}/artifacts`,
    );

    return response.data;
}

export async function getPayloadExecutionMetadata(
    workflowInstanceId: string,
    executionId: string,
): Promise<unknown> {
    const url = `/executions/${workflowInstanceId}/tasks/${executionId}/metadata`;
    const response = await http.get(url);

    return response.data;
}

export async function getPayloadExecutionOutput(objectKey: string): Promise<Blob> {
    const response = await http.get<Blob>(`/executions/artifact-download?key=${objectKey}`, {
        responseType: "blob",
    });

    return response.data;
}
