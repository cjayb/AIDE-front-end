import { MedicalSpeciality } from "@/models/AppRepo/Application";
import { createAxiosInstance, ErrorMessageMap } from "@/utils/axios-helpers";

const errorMessages: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving the medical specialties",
    post: "Something unexpected went wrong saving the medical specialty",
};

const http = createAxiosInstance(errorMessages);

export async function getAllMedicalSpeciality(): Promise<MedicalSpeciality[]> {
    const response = await http.get(`/app_store/medical_specialities`);
    return response.data;
}

export async function createMedicalSpeciality(
    medicalSpeciality: MedicalSpeciality,
): Promise<MedicalSpeciality> {
    const response = await http.post(`/app_store/medical_specialities`, medicalSpeciality);
    return response.data;
}
