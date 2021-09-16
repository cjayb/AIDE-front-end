export interface Execution {
    correlation_id: string,
    event: Event,
    model: ExecutionModel,
    result: Result,
    timestamp: Timestamp,
}

export interface Event {
    correlation_id: string,
    executions: Array<ExecutionEvent>,
    origin: Origin,
    resources: Array<Resources>,
}

export interface ExecutionModel {
    execution_uid: string,
    mode: string,
    model_name: string,
    model_uid: string,
    model_version: string,
}

export interface Result {
    clinical_review: ClinicalReview,
    message: string,
    status: string,
}

export interface Timestamp {
    clinical_review_received: string,
    inference_finished: string,
    inference_started: string,
    received_at: string,
}

export interface ClinicalReview {
    completed: boolean,
}

interface ExecutionEvent {
    execution_uid: string,
    model_uid: string,
    status: string,
    clinical_review_received: boolean,
}

interface Origin {
    file_path: string,
    namespace: string,
    patientID: string,
    received_timestamp: string,
    series: Array<Object>,
    studyUID: string,
    type: string,
}

interface Resources {
    file_path: string,
    namespace: string,
    type: string,
}
