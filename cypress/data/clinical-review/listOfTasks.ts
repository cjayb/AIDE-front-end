import {
    PagedClinicalReviewList,
    ClinicalReviewTask,
} from "../../../src/models/ClinicalReview/ClinicalReviewTask";
import ApiMocks from "../../fixtures/mockIndex";
export class ClinicalReviewTaskData implements PagedClinicalReviewList {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    data: ClinicalReviewTask[];
    succeeded: boolean;
    errors: any;
    message: any;

    constructor(taskData: PagedClinicalReviewList) {
        this.pageNumber = taskData.pageNumber;
        this.pageSize = taskData.pageSize;
        this.totalPages = taskData.totalPages;
        this.data = taskData.data;
        this.errors = taskData.errors;
        this.message = taskData.message;
    }

    public static LIST_OF_ALL_TASKS: ClinicalReviewTaskData = new ClinicalReviewTaskData(
        <PagedClinicalReviewList>ApiMocks.CLINICAL_REVIEW_TASKS,
    );
    public static SEARCH_PATIENT_ID: ClinicalReviewTaskData = new ClinicalReviewTaskData(
        <PagedClinicalReviewList>ApiMocks.CLINICAL_REVIEW_SEARCH_PATIENT_ID,
    );
    public static SEARCH_PATIENT_NAME: ClinicalReviewTaskData = new ClinicalReviewTaskData(
        <PagedClinicalReviewList>ApiMocks.CLINICAL_REVIEW_SEARCH_PATIENT_NAME,
    );
    public static SEARCH_APPLICATION_NAME: ClinicalReviewTaskData = new ClinicalReviewTaskData(
        <PagedClinicalReviewList>ApiMocks.CLINICAL_REVIEW_SEARCH_APPLICATION_NAME,
    );
    public static PAGINATION: ClinicalReviewTaskData = new ClinicalReviewTaskData(
        <PagedClinicalReviewList>ApiMocks.CLINICAL_REVIEW_PAGINATION,
    );
}
