import Vue from "vue";
import axios from "axios";
import { Application } from "@/models/Application";

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
            Vue.$toast.error(`Something unexpected went wrong retrieving application!`);
            return Promise.reject(error);
        }
    },
);

export async function getAllApplications(): Promise<Application[]> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/app_store/api/applications/`);
    return response.data;
}

export async function getAllApplicationsFilteredByStatus(status: string): Promise<Application[]> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/app_store/api/applications?status=${status}`);
    return response.data;
}

export async function getApplication(application_id: string): Promise<Application> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/app_store/api/applications/${application_id}`);
    return response.data;
}

export async function getApplicationFilteredByStatus(
    application_id: string,
    status: string,
): Promise<Application> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(
        `/app_store/api/applications/${application_id}?status=${status}`,
    );
    return response.data;
}

export async function createApplication(application: Application): Promise<Application> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.post(`//app_store/api/applications/`, application);
    return response.data;
}

export async function updateApplication(application: Application): Promise<Application> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.put(`/app_store/api/applications/`, application);
    return response.data;
}
