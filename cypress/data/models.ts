import { IModelSummary } from "../../src/models/AdminStatistics/IModel";
import ApiMocks from "../fixtures/mockIndex";

export class ModelSummaryData implements IModelSummary {
    model_id: number;
    model_name: string;


    constructor(ModelSummary: IModelSummary) {
        this.model_id = ModelSummary.model_id;
        this.model_name = ModelSummary.model_name;
    }

    public static MODEL_ASDA: ModelSummaryData = new ModelSummaryData(
        <IModelSummary>ApiMocks.ADMIN_DASHBOARD_MODELS[0]
    );
    public static MODEL_BANANA: ModelSummaryData = new ModelSummaryData(
        <IModelSummary>ApiMocks.ADMIN_DASHBOARD_MODELS[1]
    );
    public static MODEL_CRAYON: ModelSummaryData = new ModelSummaryData(
        <IModelSummary>ApiMocks.ADMIN_DASHBOARD_MODELS[2]
    );
}
