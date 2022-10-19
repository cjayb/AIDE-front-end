import { createAxiosOrthancInstance } from "@/utils/axios-helpers";

const httpService = createAxiosOrthancInstance();

export async function findStudy(StudyInstanceUID: string): Promise<any> {
    const response = await httpService.post(`/tools/find`, {
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
    const response = await httpService.get(`/studies/${StudyId}`);
    return response.data;
}

export async function getSeries(StudyId: string): Promise<any> {
    const response = await httpService.get(`/series/${StudyId}`);
    return response.data;
}

export async function getSeriesOrderedSlices(StudyId: string): Promise<any> {
    const response = await httpService.get(`/series/${StudyId}/ordered-slices`);
    return response.data;
}

export async function getInstance(StudyId: string): Promise<any> {
    const response = await httpService.get(`/instances/${StudyId}`);
    return response.data;
}

export async function getInstanceMetadata(StudyId: string): Promise<any> {
    const response = await httpService.get(`/instances/${StudyId}/tags`);
    return response.data;
}

export async function downloadStudy(StudyId: string): Promise<any> {
    const response = await httpService.get(`/studies/${StudyId}/media`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${StudyId}.zip`); //or any other extension
    document.body.appendChild(link);
    link.click();
    return response.data;
}
