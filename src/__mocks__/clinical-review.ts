import { rest } from "msw";
import ctSlice1 from "!url-loader!./fixtures/CT000000.dcm";
import ctSlice2 from "!url-loader!./fixtures/CT000010.dcm";
import docSlice from "!url-loader!./fixtures/DO000000.dcm";
import { PagedClinicalReviewList } from "@/models/ClinicalReview/ClinicalReviewTask";

const clinicalReviewTasks: PagedClinicalReviewList = {
    pageNumber: 1,
    pageSize: 10,
    totalPages: 10,
    totalRecords: 1,
    data: [
        {
            _id: "678",
            clinical_review_message: {
                task_id: "",
                reviewed_task_id: "cde",
                execution_id: "677",
                reviewed_execution_id: "abc",
                correlation_id: "123",
                workflow_name: "bobwf",
                patient_metadata: {
                    patient_name: "Joe Batt",
                    patient_id: "1299-123-232-3422",
                    patient_sex: "M",
                    patient_Dob: "10-10-2000",
                    patient_Age: "23",
                },
                files: [],
                reviewer_roles: ["admin", "clinician"],
                application_metadata: {
                    application_name: "stroke model",
                    application_version: "1.1",
                    application_mode: "CU",
                },
            },
            reviewed: false,
            received: new Date(),
        },
        {
            _id: "678",
            clinical_review_message: {
                task_id: "",
                reviewed_task_id: "cde",
                execution_id: "678",
                reviewed_execution_id: "abc",
                correlation_id: "123",
                workflow_name: "bobwf",
                patient_metadata: {
                    patient_name: "Alexis Bazin",
                    patient_id: "1299-123-232-3424",
                    patient_sex: "M",
                    patient_Dob: "10-10-2000",
                    patient_Age: "23",
                },
                files: [],
                reviewer_roles: ["admin", "clinician"],
                application_metadata: {
                    application_name: "Application 1",
                    application_version: "1.1",
                    application_mode: "CU",
                },
            },
            reviewed: false,
            received: new Date(),
        },
    ],
    succeeded: true,
    errors: null,
    message: null,
};

export const clinicalReviewHandlers = [
    rest.get(`${window.FRONTEND_API_HOST}/clinical-review/dicom`, async (req, res, ctx) => {
        const key: string | null = req.url.searchParams.get("key");

        if (!key) {
            return res(ctx.status(400));
        }

        const ct1Buffer = await fetch(ctSlice1).then((resp) => resp.arrayBuffer());
        const ct2Buffer = await fetch(ctSlice2).then((resp) => resp.arrayBuffer());
        const docBuffer = await fetch(docSlice).then((resp) => resp.arrayBuffer());

        let responseBuffer: ArrayBuffer | undefined = undefined;

        switch (key) {
            case "DO000000.dcm":
                responseBuffer = docBuffer;
                break;
            case "CT000000.dcm":
                responseBuffer = ct1Buffer;
                break;
            case "CT000010.dcm":
                responseBuffer = ct2Buffer;
                break;
        }

        if (!responseBuffer) {
            return res(ctx.status(404));
        }

        return res(
            ctx.set("Content-Type", "application/dicom"),
            ctx.set("Content-Length", responseBuffer.byteLength.toString()),
            ctx.body(responseBuffer),
        );
    }),
    rest.get(`${window.FRONTEND_API_HOST}/clinical-review/:taskExecutionId`, (req, res, ctx) => {
        const study = {
            study: [
                {
                    series_id: "8244bd56-3f1f-4d3f-b9be-5d6d4c37b4b1",
                    modality: "CT",
                    files: ["CT000000.dcm", "CT000010.dcm"],
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
    rest.get(`${window.FRONTEND_API_HOST}/clinical-review`, (_req, res, ctx) => {
        return res(ctx.json(clinicalReviewTasks));
    }),
];
