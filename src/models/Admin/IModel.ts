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
