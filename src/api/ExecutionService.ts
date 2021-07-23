import axios from "axios";

const http = axios.create({
    baseURL: `localhost:5000`,
    headers: { "Content-Type": "application/json" },
});

export async function getAllExecutions(page: string, size: string, approved: string): Promise<any> {
    const response = await http.get(`/executions?page=${page}&size=${size}&approved=${approved}`);
    return response.data;
}

export async function getModelExecutions(
    model_id: string,
    page: string,
    size: string,
    approved: string,
): Promise<any> {
    const response = await http.get(
        `/executions?model_id=${model_id}&page=${page}&size=${size}&approved=${approved}`,
    );
    return response.data;
}

export async function getExecutionPipelines(collaboration_uid: string): Promise<any> {
    const response = await http.get(`/pipelines/${collaboration_uid}`);
    return response.data;
}

export async function getExecutionStats(days: string): Promise<any> {
    const response = await http.get(`/execution_stats?days=${days}`);
    return response.data;
}

export async function getModelExecutionStats(days: string, model_id: string): Promise<any> {
    const response = await http.get(`/execution_stats?days=${days}&model_id=${model_id}`);
    return response.data;
}
