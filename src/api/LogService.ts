import { createAxiosInstance, ErrorMessageMap } from "@/utils/axios-helpers";

const errorMessages: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving logs",
};

const http = createAxiosInstance(errorMessages);

export async function getLogs(executionId: string): Promise<any> {
    const response = await http.get(`/logs/${executionId}`);

    if (response.status == 404) {
        return "No Data Found";
    }

    return response.data;
}
