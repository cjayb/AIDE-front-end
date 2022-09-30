export interface IPayload {
    payload_id: number;
    patient_name: string;
    patient_id: string;
    payload_received: string;
}

export interface WorkflowInstance {
    id: string;
    ae_title: string;
    workflow_id: string;
    start_time: string;
    payload_id: string;
    status: string;
    tasks: TaskExecution[];
}

export interface TaskExecution {
    execution_id: string;
    payload_id: string;
    workflow_instance_id: string;
    task_start_time: string;
    task_id: string;
    status: string;
    next_task: TaskExecution[];
}
