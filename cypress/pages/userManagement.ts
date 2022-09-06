import { AbstractPage } from "./abstractPage";
import ApiMocks from "fixtures/mockIndex";
import { UserListItem } from "../../src/models/user-management/UserManagement";
const userManagementUrl = "/#/user-management";

export default class UserManagement extends AbstractPage {
    static dropdown = ".d-flex > .v-input > .v-input__control > .v-input__slot > .v-select__slot";

    public initPage() {
        cy.intercept("/users", ApiMocks.USER_MANAGEMENT_GET_USERS).as("users");
        cy.intercept("/roles", ApiMocks.USER_MANAGEMENT_ROLES).as("users");
        cy.visit(userManagementUrl);
        cy.wait(["@users"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public initPageErrorUsers(statusCode: number) {
        cy.intercept("/users", { statusCode: statusCode }).as("users");
        cy.intercept("/roles", ApiMocks.USER_MANAGEMENT_ROLES).as("roles");
        cy.visit(userManagementUrl);
        //cy.wait(["@users", "@roles"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public initPageErrorRoles(statusCode: number) {
        cy.intercept("/users", ApiMocks.USER_MANAGEMENT_GET_USERS).as("users");
        cy.intercept("/roles", { statusCode: statusCode }).as("roles");
        cy.visit(userManagementUrl);
        cy.wait(["@users", "@roles"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public searchIssuesTable(text: string): void {
        if (text !== "") {
            cy.dataCy("user-search-input").clear().type(text);
        } else {
            cy.dataCy("user-search-input").clear();
        }
    }

    public assertCorrectTaskReturned(user: UserListItem): void {
        cy.dataCy("user-table-row-firstname-0").should(`contain`, user.firstName);
        cy.dataCy("user-table-row-lastname-0").should(`contain`, user.lastName);
        cy.dataCy("user-table-row-email-0").should(`contain`, user.email);
    }

    public elementVisible(tag: string) {
        cy.dataCy(tag).should("be.visible");
    }

    public assertTableDataCorrect(user: UserListItem) {
        cy.dataCy("user-table-row-firstname-0").should(`contain`, user.firstName);
        cy.dataCy("user-table-row-lastname-0").should(`contain`, user.lastName);
        cy.dataCy("user-table-row-email-0").should(`contain`, user.email);
        this.checkStatus(user);
        cy.dataCy("user-table-row-roles-0").should(`contain`, user.realmRoles[0]);
        cy.dataCy("user-table-row-roles-0").should(`contain`, user.realmRoles[1]);
        cy.dataCy("user-table-row-roles-0").should(`contain`, user.realmRoles[2]);
    }

    public elementVisibleCyGet(tag: string) {
        cy.get(tag).should("be.visible");
    }

    public usersPerPage(visibleRow, notVisibleRow) {
        cy.dataCy(`user-table-row-firstname-${visibleRow}`).should("be.visible");
        cy.dataCy(`user-table-row-firstname-${notVisibleRow}`).should("not.exist");
    }

    public checkStatus(user: UserListItem) {
        switch (user.enabled) {
            case true:
                cy.dataCy("user-table-row-status-0").should(`contain`, "Enabled");
                break;
            case false:
                cy.dataCy("user-table-row-status-0").should(`contain`, "Disabled");
        }
    }

    public assertRoles(selection: string) {
        cy.get(UserManagement.dropdown).click({ force: true });
        cy.get(".v-menu__content").should("contain", selection);
    }

    public selectElementInDropdown(index: number) {
        cy.get(UserManagement.dropdown).click({ force: true });
        cy.get(".role-filters .v-list-item").eq(index).click({ force: true });
    }

    public select(selector: string) {
        cy.get(selector).click();
    }

    public noUsers() {
        cy.dataCy(`user-table-row-roles-0`).should("not.exist");
    }

    public assertRowContainsType(type: string) {
        switch (type) {
            case "Admin":
                [0, 1, 2, 3, 4, 5].forEach((row) => {
                    cy.dataCy(`user-table-row-roles-${row}`).should("contain", type);
                });
                break;
            case "Clinician":
                [0, 1, 2, 3, 4, 5, 6, 7].forEach((row) => {
                    cy.dataCy(`user-table-row-roles-${row}`).should("contain", type);
                });
                break;
            case "User-Manager":
                [0].forEach((row) => {
                    cy.dataCy(`user-table-row-roles-${row}`).should("contain", type);
                });
                break;
        }
    }

    public assertRowContains(column: string) {
        switch (column) {
            case "firstName":
                cy.dataCy(`user-table-row-firstname-0`).should("contain", "ALexander");
                cy.dataCy(`user-table-row-firstname-1`).should("contain", "Banjo");
                cy.dataCy(`user-table-row-firstname-2`).should("contain", "Charles");
                cy.dataCy(`user-table-row-firstname-3`).should("contain", "Fred");
                break;
            case "lastName":
                cy.dataCy(`user-table-row-lastname-0`).should("contain", "Bazatronics");
                cy.dataCy(`user-table-row-lastname-1`).should("contain", "Bill");
                cy.dataCy(`user-table-row-lastname-2`).should("contain", "Doctor");
                cy.dataCy(`user-table-row-lastname-3`).should("contain", "Flinstone");
                break;
            case "email":
                cy.dataCy(`user-table-row-email-0`).should("contain", "bazatronics@");
                cy.dataCy(`user-table-row-email-1`).should("contain", "banjo.bill");
                cy.dataCy(`user-table-row-email-2`).should("contain", "magiera@");
                cy.dataCy(`user-table-row-email-3`).should("contain", "flinstone@");
                break;
        }
    }

    public nextPage() {
        cy.dataCy("").click();
    }

    public tabActive() {
        cy.dataCy("user-management-tab-Users").should("have.class", "v-tab--active");
    }

    public editButtonVisible() {
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((row) => {
            cy.dataCy(`user-table-row-actions-${row}`).within(() => {
                cy.dataCy("user-edit").should("be.visible");
            });
        });
    }

    public deleteButtonVisible() {
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((row) => {
            cy.dataCy(`user-table-row-actions-${row}`).within(() => {
                cy.dataCy("user-delete").should("be.visible");
            });
        });
    }
}
