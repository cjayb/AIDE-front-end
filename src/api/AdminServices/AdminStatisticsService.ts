import Vue from "vue";
import axios from "axios";
import {
    IExecutionStatistics,
    IIssue,
    ILogs,
    IModelDetails,
    IModelSummary,
} from "@/models/AdminStatistics/ExecutionStatistics";

const http = axios.create({
    baseURL: window.FRONTEND_API_HOST,
    headers: {
        "Content-Type": "application/json",
    },
});

http.interceptors.request.use((config) => {
    Vue.$keycloak.updateToken(70);
    return config;
});

http.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (!!error.response && 401 === error.response?.status) {
            Vue.$keycloak.logout({ redirectUri: `${window.location.origin}/#/` });
        } else if (error.message == `Network Error` && !error.response) {
            Vue.$toast.error(`⚠ Connection error`);
        } else {
            Vue.$toast.error(`Something unexpected went wrong retrieving executions!`);
            return Promise.reject(error);
        }
    },
);

export async function getModelExecutionStatistics(
    filterPeriod: string,
): Promise<IExecutionStatistics> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/api/model-execution-stats?period=${filterPeriod}`);

    return response.data;
}

export async function getModelExecutionIssues(): Promise<IIssue[]> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/api/tasks`);

    return response.data;
}

export async function getTaskLogs(task_id: number): Promise<ILogs[]> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/api/logs/${task_id}`);

    return response.data;
}

export async function dismissTasks(taskIDs: number[]): Promise<number[]> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.post(`/api/tasks/dismiss`, taskIDs);

    return response.data;
}

export async function getModels(): Promise<IModelSummary[]> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/api/models`);

    return response.data;
}

export async function getModelStatsForGraphs(
    model_id: number,
    start_date: string,
    end_date: string,
): Promise<IModelDetails> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(
        `/api/graph/${model_id}?start_date=${start_date}&end_date=${end_date}`,
    );

    return response.data;
}
