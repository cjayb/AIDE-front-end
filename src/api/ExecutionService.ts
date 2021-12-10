import Vue from "vue";
import axios from "axios";
import { Execution, ExecutionPage } from "@/models/Execution";
import { ExecutionStat } from "@/models/ExecutionStat";

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
        } else if (error.message == `Network Error`) {
            Vue.$toast.error(`⚠ Connection error`);
        } else {
            Vue.$toast.error(`Something unexpected went wrong retrieving executions!`);
            return Promise.reject(error);
        }
    },
);

export async function getAllExecutionsPage(
    from: string,
    to: string,
    approved: string,
): Promise<ExecutionPage> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/executions?from=${from}&to=${to}&approved=${approved}`);
    return response.data;
}

export async function getAllModelExecutions(
    model_id: string,
    from: string,
    to: string,
): Promise<ExecutionPage> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/executions?model_id=${model_id}&from=${from}&to=${to}`);
    return response.data;
}

export async function getModelExecutions(
    model_id: string,
    from: string,
    to: string,
    approved: string,
): Promise<Array<Execution>> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(
        `/executions?model_id=${model_id}&from=${from}&to=${to}&approved=${approved}`,
    );
    return response.data;
}

export async function getExecutionPipelines(correlation_id: string): Promise<Array<Execution>> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/pipeline/${correlation_id}`);
    return response.data;
}

export async function getExecutionStats(days: string): Promise<ExecutionStat> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/execution_stats?days=${days}`);
    return response.data;
}

export async function getModelExecutionStats(
    days: string,
    model_id: string,
): Promise<ExecutionStat> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/execution_stats?days=${days}&model_id=${model_id}`);
    return response.data;
}

export async function updateClinicalReview(
    execution_uid: string,
    acceptance: string,
    reason: string,
    message: string,
): Promise<any> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.post(
        `/executions/${execution_uid}/approvals?acceptance=${acceptance}&reason=${reason}&message=${message}`,
    );
    return response.data;
}

export async function getFile(file_path: string): Promise<any> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.post("/file", { file_path: file_path }, { responseType: "blob" });
    const file_name = file_path.split("/");
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", file_name[file_name.length - 1]); //or any other extension
    document.body.appendChild(link);
    link.click();
    return response.data;
}
