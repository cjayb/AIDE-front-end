import { Application, Version } from "../../src/models/AppRepo/Application";
import ApiMocks from "../fixtures/mockIndex";

export class AppProfileData implements Application {
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

    public static APPLICATION_DETAILS1: AppProfileData = new AppProfileData(
        <Application>ApiMocks.APP_PROFILE_PAGE1,
    );
    public static APPLICATION_DETAILS2: AppProfileData = new AppProfileData(
        <Application>ApiMocks.APP_PROFILE_PAGE2,
    );
}
