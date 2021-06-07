const { I } = inject();

export = {
    IEnterRegistrationDetails: () => {
        I.fillField("#firstName", "Joe");
        I.fillField("#lastName", "Test");
        I.fillField("#userEmail", "Joe@Test.com");
        I.click("label[for='gender-radio-1']");
        I.fillField("#userNumber", "0777777777");
        I.click("label[for='hobbies-checkbox-1']");
        I.fillField("#currentAddress", "10 test street");
        I.click("#submit");
        I.waitForVisible("div[class='modal-body']");
        I.click("#closeLargeModal");
        I.waitForVisible("#firstName");
    },
};
