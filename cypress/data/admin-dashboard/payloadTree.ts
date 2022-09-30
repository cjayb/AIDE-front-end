import { WorkflowInstance } from "../../../src/models/Admin/IPayload";
import {
    ExecutionTreeRoot,
    ExecutionTreeFirstNode,
    mapToExecutionTree,
} from "../../../src/utils/workflow-instance-mapper";
import ApiMocks from "../../fixtures/mockIndex";

export class PayloadTreeData implements ExecutionTreeRoot {
    id: "root-node";
    name: "Payload Received";
    status: string;
    children: ExecutionTreeFirstNode[];

    constructor(instances: WorkflowInstance[]) {
        const { id, name, status, children } = mapToExecutionTree(instances);
        this.id = id;
        this.name = name;
        this.status = status;
        this.children = children;
    }

    public static TREE_DATA_1: PayloadTreeData = new PayloadTreeData(
        <WorkflowInstance[]>ApiMocks.ADMIN_DASHBOARD_PAYLOAD_EXECUTIONS,
    );
}
