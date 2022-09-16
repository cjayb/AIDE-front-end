import AppProfilePage from "pages/appProfilePage";
import { AppProfileData } from "data/app-store-profile/appProfile";

const appProfilePage = new AppProfilePage();

describe("App profile page version 1 ", () => {
    beforeEach(() => {
        appProfilePage.initPage1();
        cy.injectAxe();
    });

    it("displays application version 1 details correctly", () => {
        return appProfilePage.assertAppDetails(AppProfileData.APPLICATION_DETAILS1);
    });

    it("asserts version is selected and displayed", () => {
        appProfilePage.assertVersion(AppProfileData.APPLICATION_DETAILS1);
    });

    it("asserts system requirements are displayed correctly", () => {
        appProfilePage.assertSystemRequirements(AppProfileData.APPLICATION_DETAILS1);
    });
});

describe("App profile page version 2 ", () => {
    beforeEach(() => {
        appProfilePage.initPage2();
        cy.injectAxe();
    });

    it("displays application details with different sets of data", () => {
        appProfilePage.assertAppDetails(AppProfileData.APPLICATION_DETAILS2);
    });
    //waiting reply to ordering from Dan
    // it("asserts version is selected and displayed", () => {
    //     appProfilePage.assertVersion(AppProfileData.APPLICATION_DETAILS2);
    // });

    it("asserts system requirements are displayed correctly", () => {
        appProfilePage.assertSystemRequirements(AppProfileData.APPLICATION_DETAILS2);
    });
});

describe("Error codes on app store profile page", () => {
    beforeEach(() => {
        cy.injectAxe();
        Cypress.on("uncaught:exception", () => {
            //TODO: Remove this once uncaught exceptions have been removed
            return false;
        });
    });

    it("Application profile page handles 400 error code", () => {
        appProfilePage.returning400HandledGracefully();
    });

    it("Application profile page handles 403 error code", () => {
        appProfilePage.returning403HandledGracefully();
    });

    it("Application not found and gives 404 error code", () => {
        appProfilePage.returning404HandledGracefully();
    });

    it("Application profile page handles 500 error code", () => {
        appProfilePage.returning500HandledGracefully();
    });
});
