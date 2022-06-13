import {
    IModelDetails,
    IModelStatistics,
    IModelSummary,
} from "../../src/models/AdminStatistics/IModel";
import ApiMocks from "../fixtures/mockIndex";

export class ModelDetailsData implements IModelDetails {
    model_id: number;
    status: string;
    model_name: string;
    total_executions: number;
    total_failures: number;
    days: IModelStatistics[];

    constructor(modelDetails: IModelDetails) {
        this.model_id = modelDetails.model_id;
        this.status = modelDetails.status;
        this.model_name = modelDetails.model_name;
        this.total_executions = modelDetails.total_executions;
        this.total_failures = modelDetails.total_failures;
        this.days = modelDetails.days;
    }

    public static MODEL_DETAILS_ASDA: ModelDetailsData = new ModelDetailsData(
        <IModelDetails>ApiMocks.ADMIN_DASHBOARD_MODEL_DETAILS_ONE_DAY
    );
    public static MODEL_DETAILS_BANANA: ModelDetailsData = new ModelDetailsData(
        <IModelDetails>ApiMocks.ADMIN_DASHBOARD_MODEL_DETAILS_TEN_DAYS
    );
    public static MODEL_DETAILS_CRAYON: ModelDetailsData = new ModelDetailsData(
        <IModelDetails>ApiMocks.ADMIN_DASHBOARD_MODEL_DETAILS_ONE_HUNDRED_DAYS
    );
}
