import { Version } from "@/models/AppRepo/Application";
import { createAxiosInstance, ErrorMessageMap } from "@/utils/axios-helpers";

const errorMessages: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving the application version",
    post: "Something unexpected went wrong saving the application version",
    put: "Something unexpected went wrong updating the application version",
};

const http = createAxiosInstance(errorMessages);

export async function getAllVersions(): Promise<Version[]> {
    const response = await http.get(`/app_store/api/versions`);
    return response.data;
}

export async function getVersion(version_id: string): Promise<Version> {
    const response = await http.get(`/app_store/api/versions/${version_id}`);
    return response.data;
}

export async function createVersion(version: Version): Promise<Version> {
    const response = await http.post(`/app_store/api/versions/`, version);
    return response.data;
}

export async function updateVersion(
    application_id: string,
    version_id: string,
    version: Version,
): Promise<Version> {
    const response = await http.put(`/app_store/api/versions/${version_id}`, version);
    return response.data;
}
