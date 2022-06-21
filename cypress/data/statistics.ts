import { IOverview } from "../../src/models/Admin/IOverview";
import ApiMocks from "../fixtures/mockIndex";

export class ExecStatistics implements IOverview {
    deployed_models: number;
    model_executions: number;
    model_failures: number;

    constructor(executionStatistics: IOverview) {
        this.deployed_models = executionStatistics.deployed_models;
        this.model_executions = executionStatistics.model_executions;
        this.model_failures = executionStatistics.model_failures;
    }

    public static NO_FAILED_MODELS_DATA: ExecStatistics = new ExecStatistics(
        <IOverview>ApiMocks.ADMIN_DASHBOARD_NO_FAILED_MODELS,
    );

    public static FAILED_MODELS_DATA: ExecStatistics = new ExecStatistics(
        <IOverview>ApiMocks.ADMIN_DASHBOARD_FAILED_MODELS,
    );
}
