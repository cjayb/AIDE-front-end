import { AbstractPage } from "./abstractPage";
import ApiMocks from "fixtures/mockIndex";
import { GetAllUsersResponse } from "../../src/models/user-management/UserManagement";
import { UserData } from "data/user-management/users";
import { UserDataPost } from "data/user-management/usersPost";
const userManagementUrl = "/#/user-management";
const firstName = '[aria-label="First Name: Not sorted. Activate to sort ascending."]';
const lastName = '[aria-label="Last Name: Not sorted. Activate to sort ascending."]';
const email = '[aria-label="Email: Not sorted. Activate to sort ascending."]';
const nextPage = ".v-data-footer__icons-after > .v-btn > .v-btn__content > .v-icon";

export default class UserManagement extends AbstractPage {
    static dropdown = ".d-flex > .v-input > .v-input__control > .v-input__slot > .v-select__slot";
    static rolesDropdown = ":nth-child(4) > .v-input > .v-input__control > .v-input__slot";

    public initPage() {
        cy.intercept(
            "users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_GET_USERS,
        ).as("users");
        cy.intercept("/roles", ApiMocks.USER_MANAGEMENT_ROLES).as("roles");
        cy.visit(userManagementUrl);
        cy.wait(["@users", "@roles"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public initPageOneUser() {
        cy.intercept(
            "users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ONE_USER,
        ).as("users");
        cy.intercept("/roles", ApiMocks.USER_MANAGEMENT_ROLES).as("users");
        cy.visit(userManagementUrl);
        cy.wait(["@users"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorAddUser(statusCode: number) {
        cy.intercept("POST", "/users", { statusCode: statusCode }).as("post");
        this.clickDataCy("user-modal-save");
        cy.wait(["@post"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorEditUser(statusCode: number) {
        cy.intercept("PUT", "/users/1", { statusCode: statusCode }).as("put");
        this.clickDataCy("user-edit-confirm-ok");
        cy.wait(["@put"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorDeleteUser(statusCode: number) {
        cy.intercept("DELETE", "/users/1", { statusCode: statusCode }).as("delete");
        this.clickDataCy("user-delete-ok");
        cy.wait(["@delete"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorRoles(statusCode: number) {
        cy.intercept(
            "https://localhost:8000/users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_GET_USERS,
        ).as("users");
        cy.intercept("/roles", { statusCode: statusCode }).as("roles");
        cy.visit(userManagementUrl);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorSort(statusCode: number) {
        cy.intercept(
            "GET",
            `https://localhost:8000/users?search=&first=0&max=10&sortBy=firstName&sortDesc=false`,
            {
                statusCode: statusCode,
            },
        ).as("sortFirst");
        cy.intercept(
            "https://localhost:8000/users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_GET_USERS,
        ).as("users");
        cy.intercept("/roles", ApiMocks.USER_MANAGEMENT_ROLES).as("roles");
        cy.visit(userManagementUrl);
        this.clickGet(firstName);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorSearch(statusCode: number) {
        cy.intercept(
            "GET",
            `https://localhost:8000/users?search=S&first=0&max=10&sortBy=&sortDesc=`,
            {
                statusCode: statusCode,
            },
        ).as("search");
        cy.intercept(
            "https://localhost:8000/users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_GET_USERS,
        ).as("users");
        cy.intercept("/roles", ApiMocks.USER_MANAGEMENT_ROLES).as("roles");
        cy.visit(userManagementUrl);
        cy.dataCy("user-search-input").clear().type("S");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorPagination(statusCode: number) {
        cy.intercept(
            "GET",
            `https://localhost:8000/users?search=&first=10&max=10&sortBy=&sortDesc=`,
            {
                statusCode: statusCode,
            },
        ).as("pagination");
        cy.intercept(
            "https://localhost:8000/users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_GET_USERS,
        ).as("users");
        cy.intercept("/roles", ApiMocks.USER_MANAGEMENT_ROLES).as("roles");
        cy.visit(userManagementUrl);
        this.clickGet(nextPage);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorUsers(statusCode: number) {
        cy.intercept("https://localhost:8000/users?search=&first=0&max=10&sortBy=&sortDesc=", {
            statusCode: statusCode,
        }).as("users");
        cy.intercept("/roles", ApiMocks.USER_MANAGEMENT_ROLES).as("roles");
        cy.visit(userManagementUrl);
        cy.wait(500);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public searchIssuesTable(text: string): void {
        cy.intercept(
            "GET",
            `https://localhost:8000/users?search=S&first=0&max=10&sortBy=&sortDesc=`,
            ApiMocks.USER_MANAGEMENT_SEARCH,
        ).as("S");
        cy.intercept(
            "GET",
            `https://localhost:8000/users?search=Su&first=0&max=10&sortBy=&sortDesc=`,
            ApiMocks.USER_MANAGEMENT_SEARCH,
        ).as("Su");
        cy.intercept(
            "GET",
            `https://localhost:8000/users?search=Sus&first=0&max=10&sortBy=&sortDesc=`,
            ApiMocks.USER_MANAGEMENT_SEARCH,
        ).as("Sus");
        cy.intercept(
            "GET",
            `https://localhost:8000/users?search=Susa&first=0&max=10&sortBy=&sortDesc=`,
            ApiMocks.USER_MANAGEMENT_SEARCH,
        ).as("Susa");
        cy.intercept(
            "GET",
            `https://localhost:8000/users?search=Susan&first=0&max=10&sortBy=&sortDesc=`,
            ApiMocks.USER_MANAGEMENT_SEARCH,
        ).as("Susan");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.dataCy("user-search-input").clear().type(text);
        cy.wait(["@S", "@Su", "@Sus", "@Susa", "@Susan"]);
    }

    public assertCorrectUserReturned(user: GetAllUsersResponse): void {
        cy.dataCy("user-table-row-firstname-0").should(`contain`, user.users[0].firstName);
        cy.dataCy("user-table-row-lastname-0").should(`contain`, user.users[0].lastName);
        cy.dataCy("user-table-row-email-0").should(`contain`, user.users[0].email);
    }

    public assertSecondPageUsers(user: GetAllUsersResponse): void {
        cy.dataCy("user-table-row-firstname-0").should(`contain`, user.users[0].firstName);
        cy.dataCy("user-table-row-lastname-0").should(`contain`, user.users[0].lastName);
        cy.dataCy("user-table-row-email-0").should(`contain`, user.users[0].email);
        cy.dataCy("user-table-row-firstname-1").should(`contain`, user.users[1].firstName);
        cy.dataCy("user-table-row-lastname-1").should(`contain`, user.users[1].lastName);
        cy.dataCy("user-table-row-email-1").should(`contain`, user.users[1].email);
    }

    public assertTotalUsers(users: GetAllUsersResponse) {
        cy.get(".text-h5").should("contain", users.totalUsers);
    }

    public elementVisibleDataCy(tag: string) {
        cy.dataCy(tag).should("be.visible");
    }

    public elementVisibleGet(tag: string) {
        cy.get(tag).should("be.visible");
    }

    public assertTableDataCorrect(user: GetAllUsersResponse) {
        cy.dataCy("user-table-row-firstname-0").should(`contain`, user.users[0].firstName);
        cy.dataCy("user-table-row-lastname-0").should(`contain`, user.users[0].lastName);
        cy.dataCy("user-table-row-email-0").should(`contain`, user.users[0].email);
        this.checkStatus(user);
        cy.dataCy("user-table-row-roles-0").should(`contain`, user.users[0].realmRoles[0].name);
        cy.dataCy("user-table-row-roles-0").should(`contain`, user.users[0].realmRoles[1].name);
        cy.dataCy("user-table-row-roles-0").should(`contain`, user.users[0].realmRoles[2].name);
    }

    public usersPerPage(visibleRow, notVisibleRow) {
        cy.dataCy(`user-table-row-firstname-${visibleRow}`).should("be.visible");
        cy.dataCy(`user-table-row-firstname-${notVisibleRow}`).should("not.exist");
    }

    public checkStatus(user: GetAllUsersResponse) {
        switch (user.users[0].enabled) {
            case true:
                cy.dataCy("user-table-row-status-0").should(`contain`, "Enabled");
                break;
            case false:
                cy.dataCy("user-table-row-status-0").should(`contain`, "Disabled");
                break;
            default:
                throw "This scenario has not been implemented. Please review";
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

    public assertNoUsers() {
        cy.dataCy(`user-table-row-roles-0`).should("not.exist");
    }

    public assertUserNotSaved() {
        cy.dataCy("user-table-row-firstname-0").should("contain", "Initial");
        cy.dataCy("user-table-row-lastname-0").should("contain", "User");
        cy.dataCy("user-table-row-email-0").should("contain", "initial.user@answerdigital.com");
        cy.dataCy("user-table-row-roles-0").should("contain", "Clinician");
        cy.dataCy("user-table-row-roles-0").should("contain", "User-Manager");
    }

    public assertRowContainsType(type: string) {
        switch (type) {
            case "Admin":
                [0, 1, 2, 3, 4].forEach((row) => {
                    cy.dataCy(`user-table-row-roles-${row}`).should("contain", type);
                });
                break;
            case "Clinician":
                [0, 1, 2, 3, 4, 5].forEach((row) => {
                    cy.dataCy(`user-table-row-roles-${row}`).should("contain", type);
                });
                break;
            case "User-Manager":
                [0, 1, 2, 3, 4].forEach((row) => {
                    cy.dataCy(`user-table-row-roles-${row}`).should("contain", type);
                });
                break;
            default:
                throw "This scenario has not been implemented. Please review";
        }
    }

    public paginationRequest() {
        cy.intercept(
            "GET",
            `https://localhost:8000/users?search=&first=10&max=10&sortBy=&sortDesc=`,
            ApiMocks.USER_MANAGEMENT_PAGINATION,
        ).as("nextPage");
        this.clickGet(nextPage);
        cy.wait(["@nextPage"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public assertRequestSort(column: string) {
        switch (column) {
            case "first name":
                cy.intercept(
                    "GET",
                    `https://localhost:8000/users?search=&first=0&max=10&sortBy=firstName&sortDesc=false`,
                    ApiMocks.USER_MANAGEMENT_SORT_FIRST_NAME,
                ).as("sortFirst");
                this.clickGet(firstName);
                cy.wait(["@sortFirst"]);
                Cypress.on("uncaught:exception", () => {
                    return false;
                });
                break;
            case "last name":
                cy.intercept(
                    "GET",
                    `https://localhost:8000/users?search=&first=0&max=10&sortBy=lastName&sortDesc=false`,
                    ApiMocks.USER_MANAGEMENT_SORT_LAST_NAME,
                ).as("sortLast");
                this.clickGet(lastName);
                cy.wait(["@sortLast"]);
                Cypress.on("uncaught:exception", () => {
                    return false;
                });
                break;
            case "email":
                cy.intercept(
                    "GET",
                    `https://localhost:8000/users?search=&first=0&max=10&sortBy=email&sortDesc=false`,
                    ApiMocks.USER_MANAGEMENT_SORT_EMAIL,
                ).as("sortEmail");
                this.clickGet(email);
                cy.wait(["@sortEmail"]);
                Cypress.on("uncaught:exception", () => {
                    return false;
                });
                break;
            default:
                throw "This scenario has not been implemented. Please review";
        }
    }

    public sortedDataDisplayedCorrectly(column: string) {
        switch (column) {
            case "first name":
                cy.intercept(
                    "GET",
                    `https://localhost:8000/users?search=&first=0&max=10&sortBy=firstName&sortDesc=false`,
                    ApiMocks.USER_MANAGEMENT_SORT_FIRST_NAME,
                ).as("sortFirst");
                this.clickGet(firstName);
                cy.wait(["@sortFirst"]);
                Cypress.on("uncaught:exception", () => {
                    return false;
                });
                cy.dataCy(`user-table-row-firstname-0`).should("contain", "ALexander");
                cy.dataCy(`user-table-row-firstname-1`).should("contain", "Banjo");
                cy.dataCy(`user-table-row-firstname-2`).should("contain", "Charles");
                cy.dataCy(`user-table-row-firstname-3`).should("contain", "Fred");
                break;
            case "last name":
                cy.intercept(
                    "GET",
                    `https://localhost:8000/users?search=&first=0&max=10&sortBy=lastName&sortDesc=false`,
                    ApiMocks.USER_MANAGEMENT_SORT_LAST_NAME,
                ).as("sortLast");
                this.clickGet(lastName);
                cy.wait(["@sortLast"]);
                Cypress.on("uncaught:exception", () => {
                    return false;
                });
                cy.dataCy(`user-table-row-lastname-0`).should("contain", "Bazatronics");
                cy.dataCy(`user-table-row-lastname-1`).should("contain", "Bill");
                cy.dataCy(`user-table-row-lastname-2`).should("contain", "Doctor");
                cy.dataCy(`user-table-row-lastname-3`).should("contain", "Flinstone");
                break;
            case "email":
                cy.intercept(
                    "GET",
                    `https://localhost:8000/users?search=&first=0&max=10&sortBy=email&sortDesc=false`,
                    ApiMocks.USER_MANAGEMENT_SORT_EMAIL,
                ).as("sortEmail");
                this.clickGet(email);
                cy.wait(["@sortEmail"]);
                Cypress.on("uncaught:exception", () => {
                    return false;
                });
                cy.dataCy(`user-table-row-email-0`).should("contain", "bazatronics@");
                cy.dataCy(`user-table-row-email-1`).should("contain", "banjo.bill");
                cy.dataCy(`user-table-row-email-2`).should("contain", "magiera@");
                cy.dataCy(`user-table-row-email-3`).should("contain", "flinstone@");
                break;
            default:
                throw "This scenario has not been implemented. Please review";
        }
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

    public clickEditButton(index: number) {
        cy.dataCy(`user-table-row-actions-${index}`).within(() => {
            cy.dataCy("user-edit").click();
        });
    }

    public clickDeleteButton(index: number) {
        cy.dataCy(`user-table-row-actions-${index}`).within(() => {
            cy.dataCy("user-delete").click();
        });
    }

    public clickAway() {
        cy.get(".v-card__title").click({ force: true });
        cy.wait(50);
    }

    public requiredFieldsValidation(field: string) {
        switch (field) {
            case "FIRST_NAME":
                this.clickDataCy("user-first-name");
                this.clickAway();
                this.assertRequiredText();
                break;
            case "LAST_NAME":
                this.clickDataCy("user-last-name");
                this.clickAway();
                this.assertRequiredText();
                break;
            case "EMAIL":
                this.clickDataCy("user-email");
                this.clickAway();
                this.assertRequiredText();
                break;
            case "ROLE":
                this.clickDataCy("user-roles");
                this.clickAway();
                cy.get(".v-messages__message").should("contain.text", "Select one or more");
                break;
            default:
                throw "This scenario has not been implemented. Please review";
        }
    }

    public assertRequiredText() {
        cy.get(".v-messages__message").should("contain.text", "Required");
    }

    public onlySaveWhenMandatoryFieldsEntered() {
        cy.dataCy("user-first-name").type("Added");
        this.assertAddUser("disabled");
        cy.dataCy("user-last-name").type("User");
        this.assertAddUser("disabled");
        cy.dataCy("user-email").type("added.user@answerdigital");
        this.assertAddUser("disabled");
        this.clickDataCy("user-roles");
        cy.get(".user-role .v-list-item").eq(0).click();
        this.assertAddUser("disabled");
        cy.dataCy("user-email").type(".com");
        this.clickAway();
        this.assertAddUser("enabled");
    }

    public saveDisabledUnlessAllFIeldsEntered() {
        this.assertAddUser("enabled");
        cy.dataCy("user-first-name").clear();
        this.clickAway();
        this.assertAddUser("disabled");
        cy.dataCy("user-first-name").type("Added");
        cy.dataCy("user-last-name").clear();
        this.clickAway();
        this.assertAddUser("disabled");
        cy.dataCy("user-last-name").type("User");
        cy.dataCy("user-email").clear();
        this.clickAway();
        this.assertAddUser("disabled");
        cy.dataCy("user-email").type("added.user@answerdigital.com");
        this.clickDataCy("user-roles");
        cy.get(".user-role .v-list-item").eq(1).click();
        cy.get(".user-role .v-list-item").eq(2).click();
        this.clickAway();
        this.assertAddUser("disabled");
        this.clickDataCy("user-roles");
        cy.get(".user-role .v-list-item").eq(0).click();
        cy.get(".user-role .v-list-item").eq(1).click();
        cy.get(".user-role .v-list-item").eq(2).click();
        this.clickAway();
        this.assertAddUser("enabled");
    }

    public editFields() {
        cy.dataCy("user-first-name").clear();
        cy.dataCy("user-first-name").type("Added");
        cy.dataCy("user-last-name").clear();
        cy.dataCy("user-last-name").type("User");
        cy.dataCy("user-email").clear();
        cy.dataCy("user-email").type("added.user@answerdigital.com");
        this.clickDataCy("user-roles");
        cy.get(".user-role .v-list-item").eq(0).click();
        this.clickAway();
    }

    public assertPutDetailsCorrect(user: GetAllUsersResponse) {
        cy.intercept({ method: "PUT", url: `/users/${user.users[0].id}` }).as("Put");
        this.clickDataCy("user-edit-confirm-ok");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait("@Put").then((xhr) => {
            const actualRequest = new UserDataPost(xhr.request.body);
            expect(actualRequest.firstName).to.eql("Added");
            expect(actualRequest.lastName).to.eql("User");
            expect(actualRequest.email).to.eql("added.user@answerdigital.com");
            expect(actualRequest.realmRoles[0].name).to.include("Clinician");
            expect(actualRequest.realmRoles[1].name).to.include("User-Manager");
            expect(actualRequest.realmRoles[2].name).to.include("Admin");
        });
    }

    public assertPostedDetailsCorrect() {
        cy.intercept("POST", "/users", ApiMocks.USER_MANAGEMENT_ADD_USER).as("Post");
        this.clickDataCy("user-modal-save");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait("@Post").then((xhr) => {
            const actualRequest = new UserDataPost(xhr.request.body);
            expect(actualRequest.firstName).to.eql("Added");
            expect(actualRequest.lastName).to.eql("User");
            expect(actualRequest.email).to.eql("added.user@answerdigital.com");
            expect(actualRequest.realmRoles[0].name).to.include("Admin");
            expect(actualRequest.realmRoles[1].name).to.include("Clinician");
            expect(actualRequest.realmRoles[2].name).to.include("User-Manager");
        });
    }

    public assertAddUser(status: string) {
        switch (status) {
            case "enabled":
                cy.dataCy("user-modal-save").should("be.enabled");
                break;
            case "disabled":
                cy.dataCy("user-modal-save").should("be.disabled");
                break;
            default:
                throw "This scenario has not been implemented. Please review";
        }
    }

    public enterAddUserDetails() {
        cy.dataCy("user-first-name").type("Added");
        cy.dataCy("user-last-name").type("User");
        cy.dataCy("user-email").type("added.user@answerdigital.com");
        this.clickDataCy("user-roles");
        cy.get(".user-role .v-list-item").eq(0).click();
        cy.get(".user-role .v-list-item").eq(1).click();
        cy.get(".user-role .v-list-item").eq(2).click();
        this.clickAway();
    }

    public assertAddGetDetailsCorrect(user: GetAllUsersResponse) {
        cy.intercept("POST", "/users", ApiMocks.USER_MANAGEMENT_ADD_USER).as("Post");
        cy.intercept(
            "GET",
            "https://localhost:8000/users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ADD_USER,
        ).as("Get");
        this.clickDataCy("user-modal-save");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Post", "@Get"]);
        this.assertTableDataCorrect(user);
    }

    public assertEditGetDetailsCorrect(user: GetAllUsersResponse, userEdited: GetAllUsersResponse) {
        cy.intercept("PUT", `/users/${user.users[0].id}`, ApiMocks.USER_MANAGEMENT_ADD_USER).as(
            "Put",
        );
        cy.intercept(
            "GET",
            "https://localhost:8000/users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ADD_USER,
        ).as("Get");
        this.clickDataCy("user-edit-confirm-ok");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Put", "@Get"]);
        this.assertTableDataCorrect(userEdited);
    }

    public assertDeleteRequest(user: GetAllUsersResponse) {
        cy.intercept("DELETE", `/users/${user.users[0].id}`, ApiMocks.USER_MANAGEMENT_EMPTY).as(
            "Delete",
        );
        cy.intercept(
            "GET",
            "https://localhost:8000/users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_EMPTY,
        ).as("Get");
        this.clickDataCy("user-delete-ok");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Delete", "@Get"]);
    }

    public assertFields(user: GetAllUsersResponse) {
        cy.dataCy("user-first-name").click().should("have.value", user.users[0].firstName);
        cy.dataCy("user-last-name").click().should("have.value", user.users[0].lastName);
        cy.dataCy("user-email").click().should("have.value", user.users[0].email);
        cy.get(UserManagement.rolesDropdown).should("contain", user.users[0].realmRoles[0].name);
        cy.get(UserManagement.rolesDropdown).should("contain", user.users[0].realmRoles[1].name);
    }
}
