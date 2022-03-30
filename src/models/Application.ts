export interface ApplicationResult {
    count: number | null;
    next: number | null;
    previous: number | null;
    results: Application[];
}

export interface Application {
    name: string;
    application_id: string;
    versions: Version[];
    createdAt: string;
    updatedAt: string;
}

export interface Version {
    id: string;
    version_string: string;
    version_details: VersionDetails[];
    createdAt: string;
    updatedAt: string;
}

export interface VersionDetails {
    id: string;
    long_desc: string;
    short_desc: string;
    intended_use: string;
    collaborators: string[];
    certification_details: string;
    ce_certified: boolean;
    fda_certified: boolean;
    ukca_certified: boolean;
    min_gpu_memory: string;
    min_cpu_cores: string;
    min_disk_space: string;
    input_types: InputType[];
    output_types: OutputType[];
    min_ram: string;
    medical_specialities: MedicalSpeciality[];
    file_id: string;
    application_version_files: File[];
    status: string;
    public: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface MedicalSpeciality {
    id: string;
    name: string;
}

export interface InputType {
    id: string;
    name: string;
}

export interface OutputType {
    id: string;
    name: string;
}

export interface File {
    file_id: string;
    label: string;
    url: string;
}
