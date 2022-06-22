export interface IPayload {
    payload_id: number;
    patient_name: string;
    patient_id: string;
    payload_received: string;
}

export interface IPayloadExecutions {
    execution_id: number;
    payload_id: number;
    model_name: string;
    execution_status: string;
    execution_started: string;
    execution_finished: string;
    executions: IPayloadExecutions[];
}

export interface IPayloadExecutionsFormatted {
    execution_id: number;
    payload_id: number;
    model_name: string;
    execution_status: string;
    execution_started: string;
    execution_finished: string;
    children: IPayloadExecutions[];
}
