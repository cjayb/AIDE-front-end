import Vue from "vue";
import axios from "axios";
import {
    IExecutionStatistics,
    IIssue,
    ILogs,
    IModelDetails,
    IModelSummary,
    IPayload,
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

    //return response.data;

    return [
        {
            task_id: 1,
            status: "Error",
            model_name: "test model 1",
            patient_name: "test patient",
            patient_id: "11294",
            execution_time: "20220516T101114",
        },
        {
            task_id: 2,
            status: "Error",
            model_name: "test model 2",
            patient_name: "test patient",
            patient_id: "11294",
            execution_time: "20220516T051514",
        },
        {
            task_id: 3,
            status: "Error",
            model_name: "test model 3",
            patient_name: "test patient",
            patient_id: "11294",
            execution_time: "20220516T190014",
        },
        {
            task_id: 4,
            status: "Error",
            model_name: "test model 4",
            patient_name: "test patient",
            patient_id: "11294",
            execution_time: "20220516T111114",
        },
        {
            task_id: 5,
            status: "Error",
            model_name: "test model 5",
            patient_name: "test patient",
            patient_id: "11294",
            execution_time: "20220516T151114",
        },
        {
            task_id: 6,
            status: "Error",
            model_name: "test model 6",
            patient_name: "test patient",
            patient_id: "11294",
            execution_time: "20220516T151114",
        },
        {
            task_id: 7,
            status: "Error",
            model_name: "test model 7",
            patient_name: "test patient",
            patient_id: "11294",
            execution_time: "20220516T151114",
        },
    ];
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

    return [
        {
            model_id: 12,
            model_name: "test model",
        },
        {
            model_id: 13,
            model_name: "test model2",
        },
    ];

    //return response.data;
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

    return {
        model_id: 12,
        status: "Active",
        model_name: "test model",
        total_executions: 200,
        total_failures: 10,
        days: [
            {
                date: "20220516",
                total_executions: 230,
                total_failures: 10,
            },
            {
                date: "20220517",
                total_executions: 500,
                total_failures: 10,
            },
            {
                date: "20220518",
                total_executions: 204,
                total_failures: 10,
            },
            {
                date: "20220519",
                total_executions: 140,
                total_failures: 10,
            },
            {
                date: "20220520",
                total_executions: 800,
                total_failures: 10,
            },
            {
                date: "20220521",
                total_executions: 720,
                total_failures: 10,
            },
        ],
    };
    //return response.data;
}

export async function getPayloads(): Promise<IPayload[]> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/api/payloads`);

    return response.data;
}

export async function getPayloadExecutions(payload_id: number): Promise<IPayload[]> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/api/payloads/${payload_id}/executions`);

    return response.data;
}
