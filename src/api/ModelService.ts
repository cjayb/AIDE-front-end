import axios from "axios";

const http = axios.create({
    baseURL: process.env.VUE_APP_API_HOST,
    headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("vue-token"),
    },
});

export async function getModels(): Promise<any> {
    const response = await http.get(`/models`);
    return response.data;
}
