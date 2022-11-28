import { MonaiWorkflow } from "../../../src/models/workflows/Workflow";
import ApiMocks from "../../fixtures/mockIndex";

export class WorkflowExampleData implements MonaiWorkflow {
    id: string;
    workflow_id: string;
    revision: number;
    workflow: unknown;

    constructor(workflow: MonaiWorkflow) {
        this.id = workflow.id;
        this.workflow_id = workflow.workflow_id;
        this.revision = workflow.revision;
    }

    public static WORKFLOW_EXAMPLE: WorkflowExampleData = new WorkflowExampleData(
        <MonaiWorkflow>ApiMocks.WORKFLOW_EXAMPLE,
    );
    public static WORKFLOW_EMPTY: WorkflowExampleData = new WorkflowExampleData(
        <MonaiWorkflow>ApiMocks.WORKFLOW_EMPTY,
    );
}
