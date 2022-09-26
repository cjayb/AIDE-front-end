import { WorkflowListItem } from "@/models/workflows/Workflow";
import { rest } from "msw";

const workflows: WorkflowListItem[] = [
    {
        workflow_id: "72657913-8ba7-4bba-b04f-5de8f0ce6b29",
        name: "workflow 1",
        version: "1",
        revision: 1,
        description: "This is a workflow description",
    },
    {
        workflow_id: "92657913-8ba7-4bba-b04f-5de8f0ce6b29",
        name: "workflow 2",
        version: "2",
        revision: 1,
        description: "",
    },
    {
        workflow_id: "26657913-8ba7-4bba-b04f-5de8f0ce6b29",
        name: "workflow 3",
        version: "2.2",
        revision: 1,
        description: "This is a workflow description",
    },
];

export const workflowsHandlers = [
    rest.get(`${window.FRONTEND_API_HOST}/workflows`, (req, res, ctx) => {
        const pageNumber = req.url.searchParams.get("pageNumber") || "0";

        return res(
            ctx.json({
                totalPages: pageNumber,
                totalRecords: workflows.length,
                data: workflows,
            }),
        );
    }),
    rest.post(`${window.FRONTEND_API_HOST}/workflows`, (req, res, ctx) => {
        return res(ctx.status(201));
    }),
    rest.put(`${window.FRONTEND_API_HOST}/workflows/:workflowId`, (req, res, ctx) => {
        return res(ctx.status(200));
    }),
    rest.delete(`${window.FRONTEND_API_HOST}/workflows/:workflowId`, (req, res, ctx) => {
        return res(ctx.status(200));
    }),
];
