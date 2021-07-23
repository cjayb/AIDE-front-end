import axios from "axios";

const http = axios.create({
    baseURL: `localhost:5000`,
    headers: { "Content-Type": "application/json" },
});

export async function getQueueMetrics(queue_name: string): Promise<any> {
    const response = await http.get(`/queue/${queue_name}`);
    return response.data;
}
