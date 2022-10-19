import { IOverview } from "@/models/Admin/IOverview";
import { IIndexedIssue, IIssue } from "@/models/Admin/IIssue";
import { IModelSummary, IModelDetails } from "@/models/Admin/IModel";
import { createAxiosInstance, ErrorMessageMap } from "@/utils/axios-helpers";

const errorMessages: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving executions!",
    post: "Something unexpected went wrong retrieving executions!",
};

const http = createAxiosInstance(errorMessages);

// Overview Section
export async function getOverview(filterPeriod: string): Promise<IOverview> {
    const response = await http.get(`/overview?period=${filterPeriod}`);

    return response.data;
}

// Issues Section
export async function getIssues(acknowledged: string): Promise<IIssue[]> {
    const response = await http.get(`/workflowinstances/failed?acknowledged=${acknowledged}`);

    return response.data;
}

export async function dismissIssues(dismissedItems: IIndexedIssue[]): Promise<boolean> {
    for (let i = 0; i < dismissedItems.length; i++) {
        const item = dismissedItems[i];
        await http.put(
            `/workflowinstances/${item.issue.workflow_instance_id}/executions/${item.issue.execution_id}/acknowledge`,
        );
    }
    return true;
}

// Models Section
export async function getModels(): Promise<IModelSummary[]> {
    const response = await http.get(`/models`);

    return response.data;
}

export async function getModelStatsForGraphs(
    model_id: number,
    start_date: string,
    end_date: string,
): Promise<IModelDetails> {
    const response = await http.get(
        `/graph/${model_id}?start_date=${start_date}&end_date=${end_date}`,
    );

    return response.data;
}
