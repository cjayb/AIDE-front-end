import {
    ApplicationDetail,
    Certification,
    Files,
    Specification,
    Version,
} from "../../src/models/ApplicationResult";
import ApiMocks from "../fixtures/mockIndex";

export class AppProfileData implements ApplicationDetail {
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

    constructor(application_detail: ApplicationDetail) {
        this.id = application_detail.id;
        this.name = application_detail.name;
        this.version = application_detail.version;
        this.application_version_id = application_detail.application_version_id;
        this.versions = application_detail.versions;
        this.short_description = application_detail.short_description;
        this.long_description = application_detail.long_description;
        this.intended_use = application_detail.intended_use;
        this.image = application_detail.image;
        this.medical_specialties = application_detail.medical_specialties;
        this.certification = application_detail.certification;
        this.developer_details = application_detail.developer_details;
        this.developers = application_detail.developers;
        this.collaborators = application_detail.collaborators;
        this.specification = application_detail.specification;
        this.files = application_detail.files;
        this.created_at = application_detail.created_at;
        this.updated_at = application_detail.updated_at;
    }
    public static APPLICATION_DETAILS1: AppProfileData = new AppProfileData(
        <ApplicationDetail>ApiMocks.APP_PROFILE_PAGE1,
    );
    public static APPLICATION_DETAILS2: AppProfileData = new AppProfileData(
        <ApplicationDetail>ApiMocks.APP_PROFILE_PAGE2,
    );
}
