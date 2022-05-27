import { IModels } from "../../src/models/AdminStatistics/Models";
import ApiMocks from "../fixtures/mockIndex";

export class ModelData implements IModels {
    model_id: number;
    model_name: string;


    constructor(Model: IModels) {
        this.model_id = Model.model_id;
        this.model_name = Model.model_name;
    }

    public static MODEL_ONE_YEAR: ModelData = new ModelData(
        <IModels>ApiMocks.ADMIN_DASHBOARD_MODELS
    );
    public static MODEL_TEN_DAYS: ModelData = new ModelData(
        <IModels>ApiMocks.ADMIN_DASHBOARD_MODELS
    );
}