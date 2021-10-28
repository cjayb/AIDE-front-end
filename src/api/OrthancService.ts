import Vue from "vue";
import axios from "axios";

const http = axios.create({
    baseURL: window.ORTHANC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

http.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (401 === error.response.status) {
            Vue.$keycloak.logout({ redirectUri: `${window.location.origin}/#/` });
        } else {
            return error;
        }
    },
);

export async function findStudy(StudyInstanceUID: string): Promise<any> {
    const response = await http.post(`/tools/find`, {
        Level: "Study",
        Expand: true,
        Limit: 101,
        Query: {
            StudyDate: "",
            StudyInstanceUID: StudyInstanceUID,
        },
        Full: true,
    });
    return response.data;
}

export async function getStudy(StudyId: string): Promise<any> {
    const response = await http.get(`/studies/${StudyId}`);
    return response.data;
}

export async function getSeries(StudyId: string): Promise<any> {
    const response = await http.get(`/series/${StudyId}`);
    return response.data;
}

export async function getInstance(StudyId: string): Promise<any> {
    const response = await http.get(`/instances/${StudyId}`);
    return response.data;
}

export async function getInstanceMetadata(StudyId: string): Promise<any> {
    const response = await http.get(`/instances/${StudyId}/tags`);
    return response.data;
}

export async function downloadStudy(StudyId: string): Promise<any> {
    const response = await http.get(`/studies/${StudyId}/media`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${StudyId}.zip`); //or any other extension
    document.body.appendChild(link);
    link.click();
    return response.data;
}
