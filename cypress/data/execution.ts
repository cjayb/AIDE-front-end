import {
    Execution,
    Event,
    ExecutionModel,
    Result,
    Timestamp,
} from "../../src/models/ClinicalReview/Execution";
import ApiMocks from "../fixtures/mockIndex";
export class ExecutionData implements Execution {
    private _correlation_id: string;
    private _event: Event;
    private _model: ExecutionModel;
    private _result: Result;
    private _timestamp: Timestamp;

    constructor(execution: Execution) {
        this._correlation_id = execution.correlation_id;
        this._event = execution.event;
        this._model = execution.model;
        this._result = execution.result;
        this._timestamp = execution.timestamp;
    }

    public get correlation_id(): string {
        return this._correlation_id;
    }
    public set correlation_id(value: string) {
        this._correlation_id = value;
    }
    public get event(): Event {
        return this._event;
    }
    public set event(value: Event) {
        this._event = value;
    }
    public get model(): ExecutionModel {
        return this._model;
    }
    public set model(value: ExecutionModel) {
        this._model = value;
    }
    public get result(): Result {
        return this._result;
    }
    public set result(value: Result) {
        this._result = value;
    }
    public get timestamp(): Timestamp {
        return this._timestamp;
    }
    public set timestamp(value: Timestamp) {
        this._timestamp = value;
    }

    public getDuration(): number {
        return this.getTimeDifference(
            this._timestamp.inference_started,
            this._timestamp.inference_finished,
        );
    }

    public getTurnaround(): number {
        return this.getTimeDifference(
            this._timestamp.received_at,
            this._timestamp.inference_finished,
        );
    }

    private getTimeDifference(start: string, end: string) {
        const diff = Math.abs(new Date(start).getTime() - new Date(end).getTime());
        return Math.floor(diff / 1000 / 60);
    }

    public static REVIEW_DIANE_ANDERSON: ExecutionData = new ExecutionData(
        <Execution>ApiMocks.CLINICAL_REVIEW_PAGE_1.results[2],
    );
    public static REVIEW_KELLY_MALDONADO = new ExecutionData(
        <Execution>ApiMocks.CLINICAL_REVIEW_PAGE_1.results[0],
    );
    public static REVIEW_LEONE_GOODPASTURE = new ExecutionData(
        <Execution>ApiMocks.CLINICAL_REVIEW_PAGE_1.results[1],
    );
    public static FIRST_EXECUTION_MODEL_1 = new ExecutionData(
        <Execution>ApiMocks.ADMIN_DASH_EXECUTION_RESULTS_MODEL_1.results[0],
    );
}
