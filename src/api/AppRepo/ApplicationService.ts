import { Application } from "@/models/AppRepo/Application";
import { createAxiosInstance, ErrorMessageMap } from "@/utils/axios-helpers";

const errorMessages: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving the application",
    post: "Something unexpected went wrong saving the application",
    put: "Something unexpected went wrong updating the application",
};

const http = createAxiosInstance(errorMessages);

export async function getAllApplications(): Promise<Application[]> {
    const response = await http.get(`/app_store/applications/`);
    return response.data;
}

export async function getAllApplicationsFilteredByStatus(status: string): Promise<Application[]> {
    const response = await http.get(`/app_store/applications?status=${status}`);
    return response.data;
}

export async function getApplication(application_id: string): Promise<Application> {
    const response = await http.get(`/app_store/applications/${application_id}`);
    return response.data;
}

export async function getApplicationFilteredByStatus(
    application_id: string,
    status: string,
): Promise<Application> {
    const response = await http.get(`/app_store/applications/${application_id}?status=${status}`);
    return response.data;
}

export async function createApplication(application: Application): Promise<Application> {
    const response = await http.post(`/app_store/applications/`, application);
    return response.data;
}

export async function updateApplication(application: Application): Promise<Application> {
    const response = await http.put(`/app_store/applications/`, application);
    return response.data;
}
