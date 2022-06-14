import Vue from "vue";
import axios from "axios";
import { MedicalSpeciality } from "@/models/AppRepo/Application";

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

export async function getAllMedicalSpeciality(): Promise<MedicalSpeciality[]> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/app_store/api/medical_specialities`);
    return response.data;
}

export async function createMedicalSpeciality(
    medicalSpeciality: MedicalSpeciality,
): Promise<MedicalSpeciality> {
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.post(`/app_store/api/medical_specialities`, medicalSpeciality);
    return response.data;
}
