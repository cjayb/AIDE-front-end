import { ExecutionStat } from "@/models/ExecutionStat";

export interface Model {
    id: string;
    model_name: string;
    model_version: string;
    mode: string;
    predicate: string;
    active: boolean;
    stats: ExecutionStat;
}
