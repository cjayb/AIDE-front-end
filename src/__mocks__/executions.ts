import { rest } from "msw";

export const executionsHandlers = [
    rest.get(
        `${window.FRONTEND_API_HOST}/executions/:worflowInstanceId/tasks/:executionId/artifacts`,
        (_req, res, ctx) => {
            return res(ctx.json({ "file-name.ext": "minio-object-key/guid/file-name.ext" }));
        },
    ),
    rest.get(
        `${window.FRONTEND_API_HOST}/executions/:worflowInstanceId/tasks/:executionId/metadata`,
        (_req, res, ctx) => {
            return res(ctx.json({ key: "value" }));
        },
    ),
];
