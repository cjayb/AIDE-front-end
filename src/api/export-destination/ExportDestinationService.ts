import { IExportDestination } from "@/models/export-destinations/ExportDestination";
import { createAxiosInstance, ErrorMessageMap, isResultOk } from "@/utils/axios-helpers";
import { AxiosResponse } from "axios";

const errorMessages: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving DICOM configurations",
    delete: "Something unexpected went wrong deleting the DICOM configuration",
    put: "Something unexpected went wrong updating the DICOM configuration",
    post: "Something unexpected went wrong creating DICOM configuration",
};

const httpService = createAxiosInstance(errorMessages);

export async function getExportDestinations(): Promise<IExportDestination[]> {
    const result = await httpService.get<IExportDestination[]>("/destinations");

    return isResultOk(result) ? result.data : [];
}

export async function createExportDestination(destination: IExportDestination): Promise<boolean> {
    const result = await httpService.post("/destinations", destination);

    return isResultOk(result);
}

export async function updateExportDestination(
    destinationName: string,
    destination: IExportDestination,
): Promise<boolean> {
    const result = await httpService.put(`/destinations/${destinationName}`, destination);

    return isResultOk(result);
}

export async function echoExportDestination(destinationName: string): Promise<AxiosResponse> {
    const result = await httpService.get(`/destinations/echo/${destinationName}`, {
        validateStatus: () => true,
    });

    return result;
}

export async function deleteExportDestination(destinationName: string): Promise<boolean> {
    const result = await httpService.delete(`/destinations/${destinationName}`);

    return isResultOk(result);
}
