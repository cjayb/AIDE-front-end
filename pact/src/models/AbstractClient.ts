import axios, { AxiosInstance } from "axios";

export default abstract class AbstractClient {
    protected axios: AxiosInstance;
    constructor(port: number) {
        this.axios = axios.create({
            baseURL: `http://localhost:${port}`,
            headers: { Accept: "application/json, text/plain, */*" },
        });
    }
}
