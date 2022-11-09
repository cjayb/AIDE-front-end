import { rest } from "msw";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dicomFile from "!url-loader!./fixtures/report-dicom.dcm";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import reportFile from "!url-loader!./fixtures/report-pdf.pdf";

export const executionsHandlers = [
    rest.get(
        `${window.FRONTEND_API_HOST}/executions/:worflowInstanceId/tasks/:executionId/artifacts`,
        (_req, res, ctx) => {
            return res(ctx.json({ "report-dicom": "report-dicom", "report-pdf": "report-pdf" }));
        },
    ),
    rest.get(
        `${window.FRONTEND_API_HOST}/executions/:worflowInstanceId/tasks/:executionId/metadata`,
        (_req, res, ctx) => {
            return res(ctx.json({ key: "value" }));
        },
    ),
    rest.get(`${window.FRONTEND_API_HOST}/executions/artifact-download`, async (req, res, ctx) => {
        const key = req.url.searchParams.get("key");

        const dicomBuffer = await fetch(dicomFile).then((resp) => resp.arrayBuffer());
        const pdfBuffer = await fetch(reportFile).then((resp) => resp.arrayBuffer());

        if (!key) {
            return res(ctx.status(400));
        }

        switch (key) {
            case "report-pdf":
                return res(
                    ctx.set("Content-Type", "application/pdf"),
                    ctx.set("Content-Length", pdfBuffer.byteLength.toString()),
                    ctx.body(pdfBuffer),
                );
            case "report-dicom":
                return res(
                    ctx.set("Content-Type", "application/dicom"),
                    ctx.set("Content-Length", dicomBuffer.byteLength.toString()),
                    ctx.body(dicomBuffer),
                );
            default:
                return res(ctx.status(404));
        }
    }),
];
