import Vue from "vue";
import axios from "axios";
import { Version } from "@/models/Application";

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

export async function getAllVersions(): Promise<Version[]> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/app_store/api/versions`);
    return response.data;
}

export async function getVersion(version_id: string): Promise<Version> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/app_store/api/versions/${version_id}`);
    return response.data;
}

export async function createVersion(version: Version): Promise<Version> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.post(`/app_store/api/versions/`, version);
    return response.data;
}

export async function updateVersion(
    application_id: string,
    version_id: string,
    version: Version,
): Promise<Version> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.put(`/app_store/api/versions/${version_id}`, version);
    return response.data;
}
