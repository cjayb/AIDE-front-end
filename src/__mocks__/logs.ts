import { rest } from "msw";

const logs = [
    {
        task_id: 1,
        status: "Error",
        model_name: "test model 1",
        patient_name: "test patient",
        patient_id: "11294",
        execution_time: "20220516T101114",
    },
    {
        task_id: 2,
        status: "Error",
        model_name: "test model 2",
        patient_name: "test patient",
        patient_id: "11294",
        execution_time: "20220516T051514",
    },
    {
        task_id: 3,
        status: "Error",
        model_name: "test model 3",
        patient_name: "test patient",
        patient_id: "11294",
        execution_time: "20220516T190014",
    },
    {
        task_id: 4,
        status: "Error",
        model_name: "test model 4",
        patient_name: "test patient",
        patient_id: "11294",
        execution_time: "20220516T111114",
    },
    {
        task_id: 5,
        status: "Error",
        model_name: "test model 5",
        patient_name: "test patient",
        patient_id: "11294",
        execution_time: "20220516T151114",
    },
    {
        task_id: 6,
        status: "Error",
        model_name: "test model 6",
        patient_name: "test patient",
        patient_id: "11294",
        execution_time: "20220516T151114",
    },
    {
        task_id: 7,
        status: "Error",
        model_name: "test model 7",
        patient_name: "test patient",
        patient_id: "11294",
        execution_time: "20220516T151114",
    },
];

const taskLogs = [
    {
        json: {
            execution_id: "4e67b9e0-07b7-41e8-93c7-6f1561686ebc",
            level: "INFO",
            line_no: 28,
            logger: "aide - audit - logger",
            model_name: "test - model - operator",
            model_version: "1.0.0",
            module: "dicom_image",
            msg: "Model has loaded DICOM image dataset from storage",
            thread: "Thread - 289",
            type: "log",
            written_at: "2022 - 01 - 06T20: 50: 54.726Z",
            written_ts: 1641502254726809,
        },
    },
    {
        json: {
            execution_id: "4e67b9e0-07b7-41e8-93c7-6f1561686ebc",
            level: "INFO",
            line_no: 28,
            logger: "aide-audit-logger",
            model_name: "test-model-operator",
            model_version: "1.0.0",
            module: "dicom_image",
            msg: "Model has loaded DICOM image dataset from storage",
            thread: "Thread-289",
            type: "log",
            written_at: "2022-01-06T20:50:54.726Z",
            written_ts: 1641502254726809,
        },
    },
];

export const logsHandlers = [
    rest.get(`${window.FRONTEND_API_HOST}/logs/:executionId`, (req, res, ctx) => {
        return res(ctx.json({ logs }));
    }),
    rest.get(`${window.FRONTEND_API_HOST}/api/logs/:taskd`, (req, res, ctx) => {
        return res(ctx.json({ taskLogs }));
    }),
];
