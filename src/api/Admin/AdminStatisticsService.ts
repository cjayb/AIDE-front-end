import { IOverview } from "@/models/Admin/IOverview";
import { IIssue } from "@/models/Admin/IIssue";
import { ILogs } from "@/models/Admin/ILogs";
import { IModelSummary, IModelDetails } from "@/models/Admin/IModel";
import { IPayload, IPayloadExecutions } from "@/models/Admin/IPayload";
import { createAxiosInstance, ErrorMessageMap } from "@/utils/axios-helpers";

const errorMessages: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving executions!",
    post: "Something unexpected went wrong retrieving executions!",
};

const http = createAxiosInstance(errorMessages);

// Overview Section
export async function getOverview(filterPeriod: string): Promise<IOverview> {
    const response = await http.get(`/api/overview?period=${filterPeriod}`);

    return response.data;
}

// Issues Section
export async function getIssues(): Promise<IIssue[]> {
    const response = await http.get(`/api/issues`);

    return response.data;
}

export async function dismissIssues(taskIDs: number[]): Promise<number[]> {
    const response = await http.post(`/api/issues/dismiss`, taskIDs);

    return response.data;
}

// Models Section
export async function getModels(): Promise<IModelSummary[]> {
    const response = await http.get(`/api/models`);

    return response.data;
}

export async function getModelStatsForGraphs(
    model_id: number,
    start_date: string,
    end_date: string,
): Promise<IModelDetails> {
    const response = await http.get(
        `/api/graph/${model_id}?start_date=${start_date}&end_date=${end_date}`,
    );

    return response.data;
}

// Payloads Section
export async function getPayloads(): Promise<IPayload[]> {
    const response = await http.get(`/api/payloads`);

    return response.data;
}

export async function getPayloadExecutions(payload_id: number): Promise<IPayloadExecutions[]> {
    const response = await http.get(`/api/payloads/${payload_id}/executions`);

    return response.data;
}

// Shared
export async function getTaskLogs(task_id: number): Promise<ILogs[]> {
    const response = await http.get(`/api/logs/${task_id}`);

    return response.data;
}
