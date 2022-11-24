import {
    ClinicalReviewSeries,
    ClinicalReviewTaskDetail,
} from "../../../src/models/ClinicalReview/ClinicalReviewTask";
import ApiMocks from "../../fixtures/mockIndex";

export class StudyData implements ClinicalReviewTaskDetail {
    study_date?: string;
    study: ClinicalReviewSeries[];

    constructor(studyData: ClinicalReviewTaskDetail) {
        this.study_date = studyData.study_date;
        this.study = studyData.study;
    }

    public static STUDY_DATA_2: StudyData = new StudyData(
        <ClinicalReviewTaskDetail>ApiMocks.CLINICAL_REVIEW_EXECUTION_2,
    );
}
