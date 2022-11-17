export interface ClinicalReviewSeries {
    series_id: string;
    modality: string;
    files: string[];
}

export interface ClinicalReviewTaskDetail {
    study: ClinicalReviewSeries[];
}
