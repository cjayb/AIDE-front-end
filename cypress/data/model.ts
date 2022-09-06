import { Model } from "../../src/models/ClinicalReview/Model";
import ApiMocks from "../fixtures/mockIndex";

export class ModelData implements Model {
    private _id: string;
    private _model_version: string;
    private _mode: string;
    private _predicate: string;
    private _active: boolean;
    private _stats: any;
    private _model_name: string;

    constructor(model: Model) {
        this._id = model.id;
        this._model_version = model.model_version;
        this._mode = model.mode;
        this._predicate = model.predicate;
        this._active = model.active;
        this._stats = model.stats;
        this._model_name = model.model_name;
    }

    public get predicate(): string {
        return this._predicate;
    }
    public set predicate(value: string) {
        this._predicate = value;
    }
    public get active(): boolean {
        return this._active;
    }
    public set active(value: boolean) {
        this._active = value;
    }
    public get stats(): any {
        return this._stats;
    }
    public set stats(value: any) {
        this._stats = value;
    }
    public get model_name(): string {
        return this._model_name;
    }
    public set model_name(value: string) {
        this._model_name = value;
    }
    public get model_version(): string {
        return this._model_version;
    }
    public set model_version(value: string) {
        this._model_version = value;
    }
    public get mode(): string {
        return this._mode;
    }
    public set mode(value: string) {
        this._mode = value;
    }
    public set id(value: string) {
        this._id = value;
    }

    public static HAEMORRHAGE_BRUSH: ModelData = new ModelData(
        <Model>ApiMocks.ADMIN_DASHBOARD_MODELS[0],
    );
    public static CH_MODEL_1: ModelData = new ModelData(<Model>ApiMocks.ADMIN_DASHBOARD_MODELS[1]);
    public static CH_MODEL_2: ModelData = new ModelData(<Model>ApiMocks.ADMIN_DASHBOARD_MODELS[2]);
    public static HAEMORRHAGE_STROKE: ModelData = new ModelData(
        <Model>ApiMocks.ADMIN_DASHBOARD_MODELS[3],
    );
}
