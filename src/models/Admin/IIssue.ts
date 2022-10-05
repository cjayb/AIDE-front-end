export interface IIssue {
    task_id: string;
    execution_id: string;
    workflow_instance_id: string;
    status: string;
    model_name: string;
    patient_name: string;
    patient_id: string;
    execution_time: string;
}

export interface IIndexedIssue {
    index: number;
    issue: IIssue;
}
