import Vue from "vue";
import axios from "axios";
import { IOverview } from "@/models/Admin/IOverview";
import { IIssue } from "@/models/Admin/IIssue";
import { ILogs } from "@/models/Admin/ILogs";
import { IModelSummary, IModelDetails } from "@/models/Admin/IModel";
import { IPayload, IPayloadExecutions } from "@/models/Admin/IPayload";

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

// Overview Section
export async function getOverview(filterPeriod: string): Promise<IOverview> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/api/overview?period=${filterPeriod}`);

    return response.data;
}

// Issues Section
export async function getIssues(): Promise<IIssue[]> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/api/issues`);

    return response.data;
}

export async function dismissIssues(taskIDs: number[]): Promise<number[]> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.post(`/api/issues/dismiss`, taskIDs);

    return response.data;
}

// Models Section
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

// Payloads Section
export async function getPayloads(): Promise<IPayload[]> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/api/payloads`);

    return response.data;
}

export async function getPayloadExecutions(payload_id: number): Promise<IPayloadExecutions[]> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/api/payloads/${payload_id}/executions`);

    return response.data;
}

// Shared
export async function getTaskLogs(task_id: number): Promise<ILogs[]> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/api/logs/${task_id}`);

    return response.data;
}
