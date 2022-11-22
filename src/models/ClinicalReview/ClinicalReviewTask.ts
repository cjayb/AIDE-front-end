export interface ClinicalReviewSeries {
    series_uid: string;
    modality: string;
    files: string[];
}

export interface ClinicalReviewTaskDetail {
    study_date?: string;
    study: ClinicalReviewSeries[];
}

export interface PagedClinicalReviewList {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    data: ClinicalReviewTask[];
    succeeded: boolean;
    errors: any;
    message: any;
}

export interface ClinicalReviewTask {
    _id: string;
    clinical_review_message: ClinicalReviewTaskDetails;
    reviewed: boolean;
    received: Date;
}

export interface ClinicalReviewTaskDetails {
    task_id: string;
    reviewed_task_id: string;
    execution_id: string;
    reviewed_execution_id: string;
    correlation_id: string;
    workflow_name: string;
    patient_metadata: PatientMetadata;
    files: File[];
    reviewer_roles: string[];
    application_metadata: {
        application_name: string;
        application_version: string;
        application_mode: string;
    };
}

export interface PatientMetadata {
    patient_name: string;
    patient_id: string;
    patient_dob: string;
    patient_age: string;
    patient_sex: string;
}

export interface File {
    name: string;
    endpoint: string;
    bucket: string;
    relative_root_path: string;
    credentials: Credentials;
}

export interface Credentials {
    access_key: string;
    access_token: string;
    session_token: string;
}

export interface ClinicalReviewSeries {
    series_uid: string;
    modality: string;
    files: string[];
}

export interface ClinicalReviewTaskDetail {
    study: ClinicalReviewSeries[];
}

export interface PagedClinicalReviewList {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    data: ClinicalReviewTask[];
    succeeded: boolean;
    errors: any;
    message: any;
}

export interface ClinicalReviewTask {
    _id: string;
    clinical_review_message: ClinicalReviewTaskDetails;
    reviewed: boolean;
    received: Date;
}

export interface ClinicalReviewTaskDetails {
    task_id: string;
    reviewed_task_id: string;
    execution_id: string;
    reviewed_execution_id: string;
    correlation_id: string;
    workflow_name: string;
    patient_metadata: PatientMetadata;
    files: File[];
    reviewer_roles: string[];
    application_metadata: ApplicationMetadata;
}

export interface PatientMetadata {
    patient_name: string;
    patient_id: string;
    patient_dob: string;
    patient_age: string;
    patient_sex: string;
}

export interface ApplicationMetadata {
    application_name: string;
    application_version: string;
    application_mode: string;
}

export interface File {
    name: string;
    endpoint: string;
    bucket: string;
    relative_root_path: string;
    credentials: Credentials;
}

export interface Credentials {
    access_key: string;
    access_token: string;
    session_token: string;
}
