import { Application, Certification } from "../../src/models/ApplicationResult";
import ApiMocks from "../fixtures/mockIndex";

export class ApplicationData implements Application {
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

    constructor(application: Application) {
        this.id = application.id;
        this.name = application.name;
        this.version = application.version;
        this.application_version_id = application.application_version_id;
        this.short_description = application.short_description;
        this.image = application.image;
        this.medical_specialties = application.medical_specialties;
        this.certification = application.certification;
        this.developer_details = application.developer_details;
        this.developers = application.developers;
        this.collaborators = application.collaborators;
    }

    public static MISSING_IMAGE_APP: ApplicationData = new ApplicationData(
        <Application>ApiMocks.APP_STORE_ALL_PERMUTATIONS["results"][0],
    );
    public static CE_APP: ApplicationData = new ApplicationData(
        <Application>ApiMocks.APP_STORE_ALL_PERMUTATIONS["results"][1],
    );
    public static UKCA_APP: ApplicationData = new ApplicationData(
        <Application>ApiMocks.APP_STORE_ALL_PERMUTATIONS["results"][2],
    );
    public static FDA_APP: ApplicationData = new ApplicationData(
        <Application>ApiMocks.APP_STORE_ALL_PERMUTATIONS["results"][3],
    );
    public static SPECIALITY_APP: ApplicationData = new ApplicationData(
        <Application>ApiMocks.APP_STORE_ALL_PERMUTATIONS["results"][4],
    );
    public static LONG_DESCRIPTION_APP: ApplicationData = new ApplicationData(
        <Application>ApiMocks.APP_STORE_ALL_PERMUTATIONS["results"][5],
    );
    public static UNIQUE_SPECIALITY_APP: ApplicationData = new ApplicationData(
        <Application>ApiMocks.APP_STORE_ALL_PERMUTATIONS["results"][6],
    );
}
