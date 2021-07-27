import axios from "axios";

const http = axios.create({
    baseURL: process.env.VUE_APP_ELASTIC_HOST,
    headers: { "Content-Type": "application/json" },
});

export async function getQueueMetrics(queue_name: string): Promise<any> {
    const response = await http.get(`/queues/${queue_name}`);
    return response.data;
}
