import Vue from "vue";
import axios from "axios";
import { IExecutionStatistics } from "@/models/AdminStatistics/ExecutionStatistics";

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

export async function getModelExecutionStatistics(): Promise<IExecutionStatistics> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/api/model-execution-stats?period=day`);

    // return {
    //     deployed_models: 5,
    //     model_executions: 158,
    //     model_failures: 5,
    // };
    return response.data;
}
