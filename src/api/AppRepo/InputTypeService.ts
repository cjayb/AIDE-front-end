import { InputType } from "@/models/AppRepo/Application";
import { createAxiosInstance, ErrorMessageMap } from "@/utils/axios-helpers";

const errorMessages: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving the input types",
    post: "Something unexpected went wrong saving the input type",
};

const http = createAxiosInstance(errorMessages);

export async function getAllInputType(): Promise<InputType[]> {
    const response = await http.get(`/app_store/input_types`);
    return response.data;
}

export async function createInputType(inputType: InputType): Promise<InputType> {
    const response = await http.post(`/app_store/input_types`, inputType);
    return response.data;
}
