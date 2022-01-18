export interface ApplicationResult {
    count: number | null;
    next: number | null;
    previous: number | null;
    results: Application[] | ApplicationDetail[];
}

export interface Application {
    id: string;
    name: string;
    latest_version: string;
    short_description: string;
    image: string;
    medical_specialties: string[];
    certification: Certification;
    developer_details: string;
    developers: string;
    collaborators: string[];
}

export interface ApplicationDetail {
    id: string;
    name: string;
    latest_version: string;
    short_description: string;
    image: string;
    medical_specialties: string[];
    certification: Certification;
    developer_details: string;
    developers: string;
    collaborators: string[];
}

export interface Certification {
    certification_details: string;
    certifications: string[];
}
