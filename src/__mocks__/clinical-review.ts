import { rest } from "msw";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ctSlice from "!url-loader!./fixtures/CT000000.dcm";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import docSlice from "!url-loader!./fixtures/DO000000.dcm";

export const clinicalReviewHandlers = [
    rest.get(`${window.FRONTEND_API_HOST}/clinical-review/:task-execution-id`, (req, res, ctx) => {
        const study = {
            study: [
                {
                    series_id: "8244bd56-3f1f-4d3f-b9be-5d6d4c37b4b1",
                    modality: "CT",
                    files: ["CT000000.dcm"],
                },
                {
                    series_id: "8621ca92-d3b7-4ee6-8cb0-c662675f5b18",
                    modality: "DOC",
                    files: ["DO000000.dcm"],
                },
            ],
        };

        return res(ctx.json(study));
    }),
    rest.get(`${window.FRONTEND_API_HOST}/clinical-review/dicom`, async (req, res, ctx) => {
        const key = req.url.searchParams.get("key");

        if (!key) {
            return res(ctx.status(400));
        }

        const ctBuffer = await fetch(ctSlice).then((resp) => resp.arrayBuffer());
        const docBuffer = await fetch(docSlice).then((resp) => resp.arrayBuffer());

        if (key === "DO000000.dcm") {
            return res(
                ctx.set("Content-Type", "application/dicom"),
                ctx.set("Content-Length", docBuffer.byteLength.toString()),
                ctx.body(docBuffer),
            );
        }

        return res(
            ctx.set("Content-Type", "application/dicom"),
            ctx.set("Content-Length", ctBuffer.byteLength.toString()),
            ctx.body(ctBuffer),
        );
    }),
];
