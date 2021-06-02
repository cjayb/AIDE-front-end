Feature('CodeceptJS Example Test');

Scenario('Enter the Student Registration Form Details', ({ I, registrationPage }) => {
    I.amOnPage("/");
    registrationPage.IEnterRegistrationDetails();
    I.TakePageScreenshotAndCompare("test");
}).tag("example");
