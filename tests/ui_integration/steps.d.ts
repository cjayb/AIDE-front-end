/// <reference types='codeceptjs' />
type PlaywrightHelper = import("./helpers/PlaywrightHelper");
type registrationPage = typeof import("./pages/registration");
type adminDashboardPage = typeof import("./pages/adminDashboard");
type mocks = typeof import("./mocks/mockIndex")
type screenshotter = typeof import("./utils/screenshotter");
type keycloakMock = typeof import("./utils/keycloak_mock");

declare namespace CodeceptJS {
    interface SupportObject {
        I: I;
        registrationPage: registrationPage;
        adminDashboardPage: adminDashboardPage;
        screenshotter: screenshotter;
        keycloakMock: keycloakMock;
        mocks: mocks;
    }
    interface Methods extends Playwright, PlaywrightHelper {}
    interface I extends WithTranslation<Methods> {}
    namespace Translation {
        interface Actions {}
    }
}
