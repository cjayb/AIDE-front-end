import axios from "axios";

const http = axios.create({
    baseURL: process.env.VUE_APP_ELASTIC_HOST,
    headers: { "Content-Type": "application/json" },
});

export async function getModels(): Promise<any> {
    const response = await http.get(`/models`);
    return response.data;
}
