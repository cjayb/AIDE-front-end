import Vue from "vue";
import axios from "axios";
import { VersionDetails } from "@/models/AppRepo/Application";

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

export async function getAllVersionDetails(): Promise<VersionDetails[]> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/app_store/api/version_details`);
    return response.data;
}

export async function getVersionDetails(version_details_id: string): Promise<VersionDetails> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/app_store/api/version_details/${version_details_id}`);
    return response.data;
}

export async function createVersionDetails(
    version_details: VersionDetails,
): Promise<VersionDetails> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.post(`/app_store/api/version_details`, version_details);
    return response.data;
}

export async function updateVersionDetails(
    version_details_id: string,
    version_details: VersionDetails,
): Promise<VersionDetails> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.put(
        `/app_store/api/version_details/${version_details_id}`,
        version_details,
    );
    return response.data;
}
