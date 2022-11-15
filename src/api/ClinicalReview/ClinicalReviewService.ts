import { createAxiosInstance } from "@/utils/axios-helpers";

const http = createAxiosInstance();

export async function getStudy(executionId: string) {
    const response = await http.get(`/clinical-review/${executionId}`);

    return response.data;
}
