import { IIssue } from "../../src/models/Admin/IIssue";
import ApiMocks from "../fixtures/mockIndex";

export class TaskData implements IIssue {
    task_id: number;
    status: string;
    model_name: string;
    patient_name: string;
    patient_id: string;
    execution_time: string;

    constructor(task: IIssue) {
        this.task_id = task.task_id;
        this.status = task.status;
        this.model_name = task.model_name;
        this.patient_name = task.patient_name;
        this.patient_id = task.patient_id;
        this.execution_time = task.execution_time;
    }

    public static TASK_DATA_1: TaskData = new TaskData(<IIssue>ApiMocks.ADMIN_DASHBOARD_TASKS[0]);
    public static TASK_DATA_2: TaskData = new TaskData(<IIssue>ApiMocks.ADMIN_DASHBOARD_TASKS[1]);
    public static TASK_DATA_3: TaskData = new TaskData(<IIssue>ApiMocks.ADMIN_DASHBOARD_TASKS[2]);
    public static TASK_DATA_4: TaskData = new TaskData(<IIssue>ApiMocks.ADMIN_DASHBOARD_TASKS[3]);
    public static TASK_DATA_5: TaskData = new TaskData(<IIssue>ApiMocks.ADMIN_DASHBOARD_TASKS[4]);
}
