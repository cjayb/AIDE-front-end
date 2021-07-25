import axios from "axios";

const http = axios.create({
    baseURL: `http://localhost:5000`,
    headers: { "Content-Type": "application/json" },
});

export async function getModels(): Promise<any> {
    const response = await http.get(`/models`);
    return response.data;
}
