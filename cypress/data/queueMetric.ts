import { QueueMetric } from "../../src/models/QueueMetric"
import ApiMocks from "../fixtures/mockIndex";
export class QueueMetricData implements QueueMetric {
    private _name: string;
    private _delivered: number;
    private _message_count: number;
    private _published: number;
    
    constructor(queueMetric: QueueMetric) {
        this._name = queueMetric.name;
        this._delivered = queueMetric.delivered;
        this._message_count = queueMetric.message_count;
        this._published = queueMetric.published;
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    public get delivered(): number {
        return this._delivered;
    }
    public set delivered(value: number) {
        this._delivered = value;
    }
    public get message_count(): number {
        return this._message_count;
    }
    public set message_count(value: number) {
        this._message_count = value;
    }
    public get published(): number {
        return this._published;
    }
    public set published(value: number) {
        this._published = value;
    }

    public static INPUT_QUEUE_STATS: QueueMetricData = new QueueMetricData(<QueueMetric>ApiMocks.INPUT_QUEUE_STATS);
    public static OUTPUT_QUEUE_STATS: QueueMetricData = new QueueMetricData(<QueueMetric>ApiMocks.OUTPUT_QUEUE_STATS);
}