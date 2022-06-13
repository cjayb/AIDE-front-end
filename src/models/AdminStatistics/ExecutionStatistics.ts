export interface IExecutionStatistics {
    deployed_models: number;
    model_executions: number;
    model_failures: number;
}

export interface IIssue {
    task_id: number;
    status: string;
    model_name: string;
    patient_name: string;
    patient_id: string;
    execution_time: string;
}

export interface ILogs {
    json: ILog;
}

export interface ILog {
    execution_id: string;
    level: string;
    line_no: number;
    logger: string;
    model_name: string;
    model_version: string;
    module: string;
    msg: string;
    thread: string;
    type: string;
    written_at: string;
    written_ts: number;
}

export interface IModelSummary {
    model_id: number;
    model_name: string;
}

export interface IModelDetails {
    model_id: number;
    status: string;
    model_name: string;
    total_executions: number;
    total_failures: number;
    days: IModelStatistics[];
}

export interface IModelStatistics {
    date: string;
    total_executions: number;
    total_failures: number;
}

export interface IPayload {
    payload_id: number;
    patient_name: string;
    patient_id: string;
    payload_received: string;
}
