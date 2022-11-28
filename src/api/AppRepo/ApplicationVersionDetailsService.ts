import { VersionDetails } from "@/models/AppRepo/Application";
import { createAxiosInstance, ErrorMessageMap } from "@/utils/axios-helpers";

const errorMessages: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving the application version details",
    post: "Something unexpected went wrong saving the application version details",
    put: "Something unexpected went wrong updating the application version details",
};

const http = createAxiosInstance(errorMessages);

export async function getAllVersionDetails(): Promise<VersionDetails[]> {
    const response = await http.get(`/app_store/version_details`);
    return response.data;
}

export async function getVersionDetails(version_details_id: string): Promise<VersionDetails> {
    const response = await http.get(`/app_store/version_details/${version_details_id}`);
    return response.data;
}

export async function createVersionDetails(
    version_details: VersionDetails,
): Promise<VersionDetails> {
    const response = await http.post(`/app_store/version_details`, version_details);
    return response.data;
}

export async function updateVersionDetails(
    version_details_id: string,
    version_details: VersionDetails,
): Promise<VersionDetails> {
    const response = await http.put(
        `/app_store/version_details/${version_details_id}`,
        version_details,
    );
    return response.data;
}
