import { rest } from "msw";

const issuesData = [
    {
        task_id: 1,
        status: "Error",
        model_name: "Test model 1",
        patient_name: "Test patient",
        patient_id: "1",
        execution_time: "20220516T151114",
        workflow_instance_id: "345435",
        execution_id: "45435341",
    },
    {
        task_id: 2,
        status: "Error",
        model_name: "Test model 2",
        patient_name: "Frederico McSullivan",
        patient_id: "10",
        execution_time: "20210417T151112",
        workflow_instance_id: "345435",
        execution_id: "45435342",
    },
    {
        task_id: 3,
        status: "Error",
        model_name: "Test model 3",
        patient_name: "Dr Joseph Batts",
        patient_id: "112357",
        execution_time: "20200327T071114",
        workflow_instance_id: "345435",
        execution_id: "45435343",
    },
    {
        task_id: 4,
        status: "Error",
        model_name: "Test model 4",
        patient_name: "Alexis John Bazin-Archer",
        patient_id: "111235999",
        execution_time: "20150517T191115",
        workflow_instance_id: "345435",
        execution_id: "45435344",
    },
    {
        task_id: 5,
        status: "Error",
        model_name: "Test model 5",
        patient_name: "Migle O'Donahue",
        patient_id: "111235999",
        execution_time: "20310517T191115",
        workflow_instance_id: "345435",
        execution_id: "45435345",
    },
];

export const issuesHandler = [
    rest.get(`${window.FRONTEND_API_HOST}/workflowinstances/failed`, (req, res, ctx) => {
        return res(ctx.json(issuesData));
    }),
    rest.put(
        `${window.FRONTEND_API_HOST}/workflowinstances/:workflowInstanceId/executions/:executionId/acknowledge`,
        (req, res, ctx) => {
            return res(ctx.status(200));
        },
    ),
];