import { IPayloadExecutions } from "../../../src/models/Admin/IPayload";
import ApiMocks from "../../fixtures/mockIndex";

export class PayloadTreeData implements IPayloadExecutions {
    execution_id: number;
    payload_id: number;
    model_name: string;
    execution_status: string;
    execution_started: string;
    execution_finished: string;
    executions: IPayloadExecutions[];

    constructor(payloadTree: IPayloadExecutions) {
        this.execution_id = payloadTree.execution_id;
        this.payload_id = payloadTree.payload_id;
        this.model_name = payloadTree.model_name;
        this.execution_status = payloadTree.execution_status;
        this.execution_started = payloadTree.execution_started;
        this.execution_finished = payloadTree.execution_finished;
        this.executions = payloadTree.executions;
    }

    public static TREE_DATA_1: PayloadTreeData = new PayloadTreeData(
        <IPayloadExecutions>ApiMocks.ADMIN_DASHBOARD_PAYLOAD_EXECUTIONS[0],
    );
    public static TREE_DATA_2: PayloadTreeData = new PayloadTreeData(
        <IPayloadExecutions>ApiMocks.ADMIN_DASHBOARD_PAYLOAD_EXECUTIONS[0],
    );
    public static TREE_DATA_3: PayloadTreeData = new PayloadTreeData(
        <IPayloadExecutions>ApiMocks.ADMIN_DASHBOARD_PAYLOAD_EXECUTIONS[0],
    );
    public static TREE_DATA_4: PayloadTreeData = new PayloadTreeData(
        <IPayloadExecutions>ApiMocks.ADMIN_DASHBOARD_PAYLOAD_EXECUTIONS[0],
    );
    public static TREE_DATA_5: PayloadTreeData = new PayloadTreeData(
        <IPayloadExecutions>ApiMocks.ADMIN_DASHBOARD_PAYLOAD_EXECUTIONS[0],
    );
}
