import Vue from "vue";
import axios from "axios";

const http = axios.create({
    baseURL: process.env.VUE_APP_API_HOST,
    headers: {
        "Content-Type": "application/json",
    },
});

http.interceptors.request.use((config) => {
    Vue.$keycloak.updateToken(70);
    return config;
});

export async function getAllExecutions(from: string, size: string, approved: string): Promise<any> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/executions?from=${from}&size=${size}&approved=${approved}`);
    return response.data;
}

export async function getModelExecutions(
    model_id: string,
    from: string,
    size: string,
    approved: string,
): Promise<any> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(
        `/executions?model_id=${model_id}&from=${from}&size=${size}&approved=${approved}`,
    );
    return response.data;
}

export async function getExecutionPipelines(collaboration_uid: string): Promise<any> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/pipeline/${collaboration_uid}`);
    return response.data;
}

export async function getExecutionStats(days: string): Promise<any> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/execution_stats?days=${days}`);
    return response.data;
}

export async function getModelExecutionStats(days: string, model_id: string): Promise<any> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/execution_stats?days=${days}&model_id=${model_id}`);
    return response.data;
}
