import { IOverview } from "@/models/Admin/IOverview";
import { IIndexedIssue, IIssue } from "@/models/Admin/IIssue";
import { ILogs } from "@/models/Admin/ILogs";
import { IModelSummary, IModelDetails } from "@/models/Admin/IModel";
import { createAxiosInstance, ErrorMessageMap, isResultOk } from "@/utils/axios-helpers";
import { AxiosResponse } from "axios";

const errorMessages: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving executions!",
    post: "Something unexpected went wrong retrieving executions!",
    put: "Something unexpected went wrong with your dismissal request!",
};

const http = createAxiosInstance(errorMessages);

// Overview Section
export async function getOverview(filterPeriod: string): Promise<IOverview> {
    const response = await http.get(`/api/overview?period=${filterPeriod}`);

    return response.data;
}

// Issues Section
export async function getIssues(acknowledged: string): Promise<IIssue[]> {
    const response = await http.get(`/workflowinstances/failed?acknowledged=${acknowledged}`);

    return response.data;
}

export async function dismissIssue(dismissedItem: IIndexedIssue): Promise<boolean> {
    const response = await http.put(
        `/workflowinstances/${dismissedItem.issue.workflow_instance_id}/executions/${dismissedItem.issue.execution_id}/acknowledge`,
    );
    return isResultOk(response);
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
