import AbstractClient from "./AbstractClient"

export default class LogClient extends AbstractClient {
    private url = "/logs/"

    public fetchLogs(executionId: string) {
        return this.axios.get(`${this.url}${executionId}`, { headers: { Authorization: "token" } })
    }

    public fetchLogsNoToken(executionId: string) {
        return this.axios.get(`${this.url}${executionId}`)
    }
}