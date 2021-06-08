Feature("CodeceptJS Example Test");

Scenario(
    "Enter the Student Registration Form Details",
    ({ I, registrationPage, screenshotter }) => {
        I.amOnPage("/");
        registrationPage.IEnterRegistrationDetails();
        screenshotter.TakePageScreenshotAndCompare("test1");
    },
);
