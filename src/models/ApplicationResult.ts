export interface ApplicationResult {
    count: number | null;
    next: number | null;
    previous: number | null;
    results: Application[];
}

export interface Application {
    id: string;
    name: string;
    version: string;
    application_version_id: string;
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
    version: string;
    application_version_id: string;
    versions: Version[];
    short_description: string;
    long_description: string;
    intended_use: string;
    image: string;
    medical_specialties: string[];
    certification: Certification;
    developer_details: string;
    developers: string;
    collaborators: string[];
    specification: Specification;
    files: Files[];
    created_at: string;
    updated_at: string;
}

export interface Certification {
    certification_details: string;
    certifications: string[];
}

export interface Version {
    version: string;
    application_version_id: string;
    created_at: string;
}

export interface Specification {
    min_gpu_memory: string;
    min_cpu_cores: string;
    min_disk_space: string;
    min_ram_mb: string;
    input_types: string[];
    output_types: string[];
}

export interface Files {
    file_id: string;
    label: string;
    url: string;
    created_at: string;
}
