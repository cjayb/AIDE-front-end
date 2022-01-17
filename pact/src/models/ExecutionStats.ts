import AbstractClient from "./AbstractClient";
import { ExecutionStat } from "../../../src/models/ExecutionStat"

export class ExecutionsStat {
    private executionStat: ExecutionStat;

    constructor(executionStat: ExecutionStat) {
        this.executionStat = executionStat;
    }

    public getExecutionPage(): ExecutionStat {
        return this.executionStat;
    }
}

export default class ExecutionStatClient extends AbstractClient {
    public fetchExecutionStats(days: string, model_id?: string) {
        let url = `/execution_stats?days=${days}`
        if(model_id !== undefined) {
            url = `${url}&model_id=${model_id}`
        }

        return this.axios.get(url, { headers: { Authorization: "token" }}).then(
            res => {
                return res.data.map((o: ExecutionStat) => {
                    return new ExecutionsStat({
                        average_execution_time: o.average_execution_time,
                        average_turnaround_time: o.average_turnaround_time,
                        errors: o.errors,
                        executions: o.executions,
                        failures: o.failures
                    })
                })
            }
        )
    }

    public fetchStatsDontSerialise(days: string, model_id?: string) {
        let url = `/execution_stats?days=${days}`
        if(model_id !== undefined) {
            url = `${url}&model_id=${model_id}`
        }
        return this.axios.get(url, { headers: { Authorization: "token" }})
    }

    public fetchStatsNoAuth(days: string, model_id?: string) {
        let url = `/execution_stats?days=${days}`
        if(model_id !== undefined) {
            url = `${url}&model_id=${model_id}`
        }
        return this.axios.get(url)
    }
}