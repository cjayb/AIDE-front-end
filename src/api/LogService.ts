import { ILogs } from "@/models/Admin/ILogs";
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

export async function getTaskLogs(taskId: number): Promise<ILogs[]> {
    const response = await http.get(`/api/logs/${taskId}`);

    return response.data;
}
