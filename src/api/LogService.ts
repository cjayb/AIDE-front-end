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

export async function getLogs(executionId: string): Promise<any> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    console.log(executionId);
    const response = await http.get(`/logs/${executionId}`);
    if (response.status == 404) {
        return "No Data Found";
    }

    return response.data;
}
