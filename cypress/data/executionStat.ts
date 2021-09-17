import { ExecutionStat } from "../../src/models/ExecutionStat"
import ApiMocks from "../fixtures/mockIndex";
export class ExecutionStatData implements ExecutionStat {
    constructor(executionStat: ExecutionStat) {
        this._average_execution_time = executionStat.average_execution_time;
        this._average_turnaround_time = executionStat.average_turnaround_time;
        this._errors = executionStat.errors;
        this._failures = executionStat.failures;
        this._executions = executionStat.executions;
    }

    private _average_execution_time: number;
    private _average_turnaround_time: number;
    private _errors: number;
    private _executions: number;
    private _failures: number;


    public get average_execution_time(): number {
        return this._average_execution_time;
    }
    public set average_execution_time(value: number) {
        this._average_execution_time = value;
    }
    public get average_turnaround_time(): number {
        return this._average_turnaround_time;
    }
    public set average_turnaround_time(value: number) {
        this._average_turnaround_time = value;
    }
    public get errors(): number {
        return this._errors;
    }
    public set errors(value: number) {
        this._errors = value;
    }
    public get executions(): number {
        return this._executions;
    }
    public set executions(value: number) {
        this._executions = value;
    }
    public get failures(): number {
        return this._failures;
    }
    public set failures(value: number) {
        this._failures = value;
    }
    
    public static MODEL_1_STATS: ExecutionStatData = new ExecutionStatData(<ExecutionStat>ApiMocks.ADMIN_DASH_EXECUTION_STATS_MODEL_1)
    public static MODEL_2_STATS: ExecutionStatData = new ExecutionStatData(<ExecutionStat>ApiMocks.ADMIN_DASH_EXECUTION_STATS_MODEL_2)
    public static MODEL_3_STATS: ExecutionStatData = new ExecutionStatData(<ExecutionStat>ApiMocks.ADMIN_DASH_EXECUTION_STATS_MODEL_3)
    public static MODEL_4_STATS: ExecutionStatData = new ExecutionStatData(<ExecutionStat>ApiMocks.ADMIN_DASH_EXECUTION_STATS_MODEL_4)
}