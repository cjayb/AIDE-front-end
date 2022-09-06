import { Application, Version } from "../../src/models/AppRepo/Application";
import ApiMocks from "../fixtures/mockIndex";

export class ApplicationData implements Application {
    application_id: string;
    name: string;
    versions: Version[];
    createdAt: string;
    updatedAt: string;

    constructor(application: Application) {
        this.application_id = application.application_id;
        this.name = application.name;
        this.versions = application.versions;
        this.createdAt = application.createdAt;
        this.updatedAt = application.updatedAt;
    }

    public static MISSING_IMAGE_APP: ApplicationData = new ApplicationData(
        <Application>ApiMocks.APP_STORE_ALL_PERMUTATIONS[0],
    );
    public static CE_APP: ApplicationData = new ApplicationData(
        <Application>ApiMocks.APP_STORE_ALL_PERMUTATIONS[1],
    );
    public static UKCA_APP: ApplicationData = new ApplicationData(
        <Application>ApiMocks.APP_STORE_ALL_PERMUTATIONS[2],
    );
    public static FDA_APP: ApplicationData = new ApplicationData(
        <Application>ApiMocks.APP_STORE_ALL_PERMUTATIONS[3],
    );
    public static SPECIALITY_APP: ApplicationData = new ApplicationData(
        <Application>ApiMocks.APP_STORE_ALL_PERMUTATIONS[4],
    );
    public static LONG_DESCRIPTION_APP: ApplicationData = new ApplicationData(
        <Application>ApiMocks.APP_STORE_ALL_PERMUTATIONS[5],
    );
    public static UNIQUE_SPECIALITY_APP: ApplicationData = new ApplicationData(
        <Application>ApiMocks.APP_STORE_ALL_PERMUTATIONS[6],
    );
}
