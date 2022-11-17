import {
    ClinicalReviewTaskDetail,
    PagedClinicalReviewList,
} from "@/models/ClinicalReview/ClinicalReviewTask";
import { createAxiosInstance, ErrorMessageMap, isResultOk } from "@/utils/axios-helpers";

const clinicalReviewErrorMessages: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving clinical review tasks",
};

const http = createAxiosInstance(clinicalReviewErrorMessages);

interface CRTaskQueryParams {
    pageNumber: number;
    pageSize: number;
    patientName?: string;
    patientId?: string;
    applicationName?: string;
}

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

export async function getClinicalReviewTasks(
    query: CRTaskQueryParams,
): Promise<PagedClinicalReviewList> {
    const params = new URLSearchParams({
        pageNumber: `${query.pageNumber}`,
        pageSize: `${query.pageSize}`,
        patientId: query.patientId ?? "",
        patientName: query.patientName ?? "",
        applicationName: query.applicationName ?? "",
    });

    const response = await http.get(`/clinical-review?${params}`);
    return isResultOk(response) ? response.data : [];
}
