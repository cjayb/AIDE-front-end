import { IPayload, WorkflowInstance } from "@/models/Admin/IPayload";
import { createAxiosInstance, ErrorMessageMap } from "@/utils/axios-helpers";

const errorMessages: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving executions!",
    post: "Something unexpected went wrong retrieving executions!",
};

const http = createAxiosInstance(errorMessages);

// Payloads Section
export async function getPayloads(): Promise<IPayload[]> {
    const response = await http.get(`/payloads`);

    return response.data;
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
