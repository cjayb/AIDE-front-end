/// <reference types='codeceptjs' />
type PlaywrightHelper = import("./helpers/PlaywrightHelper");
type registrationPage = typeof import("./pages/registration");
type screenshotter = typeof import("./utils/screenshotter");

declare namespace CodeceptJS {
    interface SupportObject {
        I: I;
        registrationPage: registrationPage;
        screenshotter: screenshotter;
    }
    interface Methods extends Playwright, PlaywrightHelper {}
    interface I extends WithTranslation<Methods> {}
    namespace Translation {
        interface Actions {}
    }
}
