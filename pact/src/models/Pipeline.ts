import { Execution } from "../../../src/models/ClinicalReview/Execution";
import AbstractClient from "./AbstractClient";

export class Executions {
    private execution: Execution;

    constructor(execution: Execution) {
        this.execution = execution
    }

    public getPipeline(): Execution {
        return this.execution;
    }
}

export default class PipelineClient extends AbstractClient {
    public fetchPipeline(correlation_id: string) {
        return this.axios.get(`/pipeline/${correlation_id}`, { headers: { Authorization: "token" } }).then(
            res => {
                const data: Array<Execution> = res.data
                return data.map((ex: Execution) => {
                    return new Executions({
                        correlation_id: ex.correlation_id,
                        event : ex.event,
                        model: ex.model,
                        result: ex.result,
                        timestamp: ex.timestamp
                    }).getPipeline()
                })
            }
        )
    }

    public fetchPipelineNoAuth(correlation_id: string) {
        return this.axios.get(`/pipeline/${correlation_id}`)
    }
}
