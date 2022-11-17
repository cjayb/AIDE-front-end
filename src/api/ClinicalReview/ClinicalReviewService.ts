import { ClinicalReviewTaskDetail } from "@/models/ClinicalReview/ClinicalReviewTask";
import { createAxiosInstance } from "@/utils/axios-helpers";

const http = createAxiosInstance();

export async function getStudy(taskExecutionId: string): Promise<ClinicalReviewTaskDetail> {
    const response = await http.get<ClinicalReviewTaskDetail>(
        `/clinical-review/${taskExecutionId}`,
    );

    return response.data;
}

export async function getDicomFile(key: string): Promise<ArrayBuffer> {
    const response = await http.get<ArrayBuffer>(`/clinical-review/dicom?key=${key}`, {
        responseType: "arraybuffer",
    });

    return response.data;
}
