import { AbstractPage } from "./abstractPage";
import ApiMocks from "fixtures/mockIndex";
import {
    GetAllUsersResponse,
    PaginatedRolesResponse,
} from "../../src/models/user-management/UserManagement";
import { UserDataPost } from "data/user-management/usersPost";
import { RolePostData } from "data/user-management/rolesPost";
const userManagementUrl = "/#/user-management";
const firstName = '[aria-label="First Name: Not sorted. Activate to sort ascending."]';
const roleName =
    ".v-window-item--active > .px-4 > .v-card > .v-data-table > .v-data-table__wrapper > table > .v-data-table-header > tr > .sortable";
const lastName = '[aria-label="Last Name: Not sorted. Activate to sort ascending."]';
const email = '[aria-label="Email: Not sorted. Activate to sort ascending."]';
const sortRoles =
    ".v-window-item--active > .px-4 > .v-card > .v-data-table > .v-data-table__wrapper > table > .v-data-table-header > tr > .text-start";
const nextPage = ".v-data-footer__icons-after > .v-btn > .v-btn__content > .v-icon";
const paginationDropdown =
    ".v-window-item--active > .px-4 > .v-card > .v-data-table > .v-data-footer > .v-data-footer__select > .v-input > .v-input__control > .v-input__slot > .v-select__slot > .v-input__append-inner > .v-input__icon > .v-icon";
export default class UserManagement extends AbstractPage {
    static dropdown = ".d-flex > .v-input > .v-input__control > .v-input__slot > .v-select__slot";
    static rolesDropdown = ":nth-child(4) > .v-input > .v-input__control > .v-input__slot";

    public initPage() {
        cy.intercept(
            "users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_GET_USERS,
        ).as("users");
        cy.intercept("roles/list", ApiMocks.USER_MANAGEMENT_ROLES_LIST).as("rolesList");
        cy.visit(userManagementUrl);
        cy.wait(["@users", "@rolesList"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public initPageRoles() {
        cy.intercept(
            "users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_GET_USERS,
        ).as("users");
        cy.intercept(
            "/roles?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ROLES,
        ).as("roles");
        cy.intercept("roles/list", ApiMocks.USER_MANAGEMENT_ROLES_LIST).as("rolesList");
        cy.visit(userManagementUrl);
        cy.wait(["@users", "@rolesList"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        this.clickDataCy("user-management-tab-Roles");
        cy.wait(500);
    }

    public initAccessibilityModal() {
        cy.intercept(
            "users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_GET_USERS,
        ).as("users");
        cy.intercept(
            "/roles?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ROLES,
        ).as("roles");
        cy.intercept("roles/list", ApiMocks.USER_MANAGEMENT_ROLES_LIST).as("rolesList");
        cy.visit(userManagementUrl);
        cy.wait(["@users", "@roles", "@rolesList"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        this.clickDataCy("user-management-tab-Roles");
        cy.wait(500);
        this.clickDataCy("add-role");
    }

    public initPageOneRole() {
        cy.intercept(
            "users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ONE_USER,
        ).as("users");
        cy.intercept(
            "roles?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ONE_ROLE,
        ).as("roles");
        cy.intercept("roles/list", ApiMocks.USER_MANAGEMENT_ONE_ROLES_LIST).as("rolesList");
        cy.visit(userManagementUrl);
        cy.wait(["@users", "@rolesList"]);
        this.clickDataCy("user-management-tab-Roles");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public initPageOneUser() {
        cy.intercept(
            "users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ONE_USER,
        ).as("users");
        cy.intercept(
            "roles?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ROLES,
        ).as("roles");
        cy.intercept("roles/list", ApiMocks.USER_MANAGEMENT_ROLES_LIST).as("rolesList");
        cy.visit(userManagementUrl);
        cy.wait(["@users", "@rolesList"]);
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
            "/users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_GET_USERS,
        ).as("users");
        cy.intercept("/roles/list", { statusCode: statusCode }).as("roles");
        cy.intercept(
            "/roles?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ROLES_PAGINATION,
        ).as("rolesPaginated");
        cy.visit(userManagementUrl);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorSort(statusCode: number) {
        cy.intercept("GET", `/users?search=&first=0&max=10&sortBy=firstName&sortDesc=false`, {
            statusCode: statusCode,
        }).as("sortFirst");
        cy.intercept(
            "/users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_GET_USERS,
        ).as("users");
        cy.intercept("/roles/list", ApiMocks.USER_MANAGEMENT_ROLES).as("roles");
        cy.intercept(
            "/roles?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ROLES_PAGINATION,
        ).as("rolesPaginated");
        cy.visit(userManagementUrl);
        this.clickGet(firstName);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorSortRoles(statusCode: number) {
        cy.intercept(
            "/users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_GET_USERS,
        ).as("users");
        cy.intercept(
            "/roles?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ROLES,
        ).as("roles");
        cy.intercept("/roles/list", ApiMocks.USER_MANAGEMENT_ROLES_LIST).as("rolesList");
        cy.visit(userManagementUrl);
        cy.wait(["@users", "@rolesList"]);
        this.clickDataCy("user-management-tab-Roles");
        cy.intercept("/roles?search=&first=0&max=10&sortBy=name&sortDesc=false", {
            statusCode: statusCode,
        }).as("sortRoles");
        this.clickGet(roleName);
        cy.wait(["@sortRoles"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorSearchRoles(statusCode: number) {
        cy.intercept(
            "/users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_GET_USERS,
        ).as("users");
        cy.intercept(
            "/roles?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ROLES,
        ).as("roles");
        cy.intercept("/roles/list", ApiMocks.USER_MANAGEMENT_ROLES_LIST).as("rolesList");
        cy.visit(userManagementUrl);
        cy.wait(["@users", "@rolesList"]);
        this.clickDataCy("user-management-tab-Roles");
        cy.intercept("/roles?search=H&first=0&max=10&sortBy=&sortDesc=", {
            statusCode: statusCode,
        }).as("search");
        cy.dataCy("role-search-input").type("H");
        cy.wait(["@search"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorNextPageRoles(statusCode: number) {
        cy.intercept(
            "/users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_GET_USERS,
        ).as("users");
        cy.intercept(
            "/roles?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ROLES,
        ).as("roles");
        cy.intercept("/roles/list", ApiMocks.USER_MANAGEMENT_ROLES_LIST).as("rolesList");
        cy.visit(userManagementUrl);
        cy.wait(["@users", "@rolesList"]);
        this.clickDataCy("user-management-tab-Roles");
        cy.intercept("/roles?search=&first=10&max=10&sortBy=&sortDesc=", {
            statusCode: statusCode,
        }).as("nextPage");
        cy.get(nextPage).last().click({ force: true });
        cy.wait(["@nextPage"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorSearch(statusCode: number) {
        cy.intercept("GET", `/users?search=S&first=0&max=10&sortBy=&sortDesc=`, {
            statusCode: statusCode,
        }).as("search");
        cy.intercept(
            "/users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_GET_USERS,
        ).as("users");
        cy.intercept("/roles/list", ApiMocks.USER_MANAGEMENT_ROLES).as("roles");
        cy.intercept(
            "/roles?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ROLES_PAGINATION,
        ).as("rolesPaginated");
        cy.visit(userManagementUrl);
        cy.dataCy("user-search-input").clear().type("S");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorPagination(statusCode: number) {
        cy.intercept(
            "/users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_GET_USERS,
        ).as("users");
        cy.intercept(
            "/roles?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ROLES,
        ).as("roles");
        cy.intercept("/roles/list", ApiMocks.USER_MANAGEMENT_ROLES_LIST).as("rolesList");
        cy.visit(userManagementUrl);
        cy.wait(["@users", "@rolesList"]);
        cy.intercept("GET", `/users?search=&first=10&max=10&sortBy=&sortDesc=`, {
            statusCode: statusCode,
        }).as("pagination");
        this.clickGet(nextPage);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public errorUsers(statusCode: number) {
        cy.intercept("/users?search=&first=0&max=10&sortBy=&sortDesc=", {
            statusCode: statusCode,
        }).as("users");
        cy.intercept("/roles/list", ApiMocks.USER_MANAGEMENT_ROLES).as("roles");
        cy.intercept(
            "/roles?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ROLES_PAGINATION,
        ).as("rolesPaginated");
        cy.visit(userManagementUrl);
        cy.wait(500);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public searchRoleTable(text: string): void {
        cy.intercept(
            "GET",
            `https://localhost:8000/roles?search=Clinician&first=0&max=10&sortBy=&sortDesc=`,
            ApiMocks.USER_MANAGEMENT_ROLES_SEARCH,
        ).as("Clinician");
        cy.dataCy("role-search-input").clear().type(text);
        cy.wait(["@Clinician"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public searchUserTable(text: string): void {
        cy.intercept(
            "GET",
            `/users?search=Susan&first=0&max=10&sortBy=&sortDesc=`,
            ApiMocks.USER_MANAGEMENT_SEARCH,
        ).as("Susan");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.dataCy("user-search-input").clear().type(text);
        cy.wait(["@Susan"]);
    }

    public assertCorrectUserDisplayed(user: GetAllUsersResponse): void {
        cy.dataCy("user-table-row-firstname-0").should(`contain`, user.users[0].firstName);
        cy.dataCy("user-table-row-lastname-0").should(`contain`, user.users[0].lastName);
        cy.dataCy("user-table-row-email-0").should(`contain`, user.users[0].email);
    }

    public assertCorrectRoleDisplayed(): void {
        cy.dataCy("role-table-row-name-0").should(`contain`, "Clinician");
    }

    public assertSecondPageUsers(user: GetAllUsersResponse): void {
        cy.dataCy("user-table-row-firstname-0").should(`contain`, user.users[0].firstName);
        cy.dataCy("user-table-row-lastname-0").should(`contain`, user.users[0].lastName);
        cy.dataCy("user-table-row-email-0").should(`contain`, user.users[0].email);
        cy.dataCy("user-table-row-firstname-1").should(`contain`, user.users[1].firstName);
        cy.dataCy("user-table-row-lastname-1").should(`contain`, user.users[1].lastName);
        cy.dataCy("user-table-row-email-1").should(`contain`, user.users[1].email);
    }

    public assertSecondPageRoles(): void {
        cy.dataCy("role-table-row-name-0").should(`contain`, "Editable role 8");
        cy.dataCy("role-table-row-name-1").should(`contain`, "Editable role 9");
        cy.dataCy("role-table-row-name-2").should(`contain`, "Editable role 10");
    }

    public assertTotalUsers(users: GetAllUsersResponse) {
        cy.get(".text-h5").should("contain", users.totalUserCount);
    }

    public assertTotalRoles(roles: PaginatedRolesResponse) {
        cy.get(".text-h5").should("contain", roles.totalRolesCount);
    }

    public elementVisibleDataCy(tag: string) {
        cy.wait(500);
        cy.dataCy(tag).should("be.visible");
    }

    public elementVisibleGet(tag: string) {
        cy.get(tag).should("be.visible");
    }

    public assertTableDataCorrectUsers(user: GetAllUsersResponse) {
        cy.dataCy("user-table-row-firstname-0").should(`contain`, user.users[0].firstName);
        cy.dataCy("user-table-row-lastname-0").should(`contain`, user.users[0].lastName);
        cy.dataCy("user-table-row-email-0").should(`contain`, user.users[0].email);
        this.checkStatus(user);
        cy.dataCy("user-table-row-roles-0").should(`contain`, user.users[0].realmRoles[0].name);
        cy.dataCy("user-table-row-roles-0").should(`contain`, user.users[0].realmRoles[1].name);
        cy.dataCy("user-table-row-roles-0").should(`contain`, user.users[0].realmRoles[2].name);
    }

    public assertTableDataCorrectAllRoles() {
        cy.dataCy("role-table-row-name-0").should(`contain`, "Admin");
        cy.dataCy("role-table-row-name-1").should(`contain`, "Clinician");
        cy.dataCy("role-table-row-name-2").should(`contain`, "User-Manager");
        cy.dataCy("role-table-row-name-3").should(`contain`, "Editable role 1");
        cy.dataCy("role-table-row-name-4").should(`contain`, "Editable role 2");
        cy.dataCy("role-table-row-name-5").should(`contain`, "Editable role 3");
        cy.dataCy("role-table-row-name-6").should(`contain`, "Editable role 4");
        cy.dataCy("role-table-row-name-7").should(`contain`, "Editable role 5");
        cy.dataCy("role-table-row-name-8").should(`contain`, "Editable role 6");
    }

    public assertTableDataCorrectRoles() {
        cy.dataCy("role-table-row-name-0").should(`contain`, "Added role");
    }

    public assertTableDataCorrectEditedRoles() {
        cy.dataCy("role-table-row-name-0").should(`contain`, "Edited role");
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

    public assertRoleNotSaved() {
        cy.dataCy("role-table-row-name-0").should("contain", "Initial");
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

    public assertRowRoles(role: string) {
        cy.dataCy(`user-table-row-roles-0`).should("contain", role);
        cy.dataCy(`user-table-row-roles-0`).should("contain", role);
        cy.dataCy(`user-table-row-roles-0`).should("contain", role);
    }

    public paginationRequestUsers() {
        cy.intercept(
            "GET",
            `/users?search=&first=10&max=10&sortBy=&sortDesc=`,
            ApiMocks.USER_MANAGEMENT_PAGINATION,
        ).as("nextPage");
        this.clickGet(nextPage);
        cy.wait(["@nextPage"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public paginationRequestRoles() {
        cy.intercept(
            "GET",
            `https://localhost:8000/roles?search=&first=10&max=10&sortBy=&sortDesc=`,
            ApiMocks.USER_MANAGEMENT_ROLES_PAGINATION,
        ).as("nextPage");
        cy.get(nextPage).last().click({ force: true });
        cy.wait(["@nextPage"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public paginationReturnToFirstPage() {
        cy.intercept(
            "GET",
            `https://localhost:8000/roles?search=&first=10&max=10&sortBy=&sortDesc=`,
            ApiMocks.USER_MANAGEMENT_ROLES_PAGINATION,
        ).as("nextPage");
        cy.get(nextPage).last().click({ force: true });
        cy.wait(["@nextPage"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public paginationRequestFiveRolesPerPage() {
        cy.intercept(
            "GET",
            `https://localhost:8000/roles?search=&first=0&max=5&sortBy=&sortDesc=`,
            ApiMocks.USER_MANAGEMENT_ROLES_PAGINATION,
        ).as("fivePerPage");
        cy.get(paginationDropdown).last().click({ force: true });
        cy.get(".menuable__content__active .v-list-item").eq(0).click();
        cy.wait(["@fivePerPage"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public assertRequestToSortRole() {
        cy.intercept(
            "GET",
            `https://localhost:8000/users?search=&first=0&max=10&sortBy=&sortDesc=`,
            ApiMocks.USER_MANAGEMENT_ROLES_SORTED,
        ).as("sortFirst");
        cy.get(sortRoles).click();
        cy.wait(["@sortFirst"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    // public assertTableWhenSortingRole() {
    //     cy.intercept(
    //         "GET",
    //         `https://localhost:8000/users?search=&first=0&max=10&sortBy=firstName&sortDesc=false`,
    //         //https://localhost:8000/users?search=&first=0&max=10&sortBy=firstName&sortDesc=false
    //         ApiMocks.USER_MANAGEMENT_SORT_FIRST_NAME,
    //     ).as("sortFirst");
    //     this.clickGet(firstName);
    //     //cy.wait(["@sortFirst"]);
    //     Cypress.on("uncaught:exception", () => {
    //         return false;
    //     });
    // }

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
                    `/users?search=&first=0&max=10&sortBy=lastName&sortDesc=false`,
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
                    `/users?search=&first=0&max=10&sortBy=email&sortDesc=false`,
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

    public sortedUsersDisplayedCorrectly(column: string) {
        switch (column) {
            case "first name":
                cy.intercept(
                    "GET",
                    `/users?search=&first=0&max=10&sortBy=firstName&sortDesc=false`,
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
                    `/users?search=&first=0&max=10&sortBy=lastName&sortDesc=false`,
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
                    `/users?search=&first=0&max=10&sortBy=email&sortDesc=false`,
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

    public assertSortedRolesRequest() {
        cy.intercept(
            "GET",
            `https://localhost:8000/roles?search=&first=0&max=10&sortBy=name&sortDesc=false`,
            ApiMocks.USER_MANAGEMENT_ROLES_SORTED,
        ).as("sortFirst");
        this.clickGet(roleName);
        cy.wait(["@sortFirst"]);
        Cypress.on("uncaught:exception", () => {
            return false;
        });
    }

    public assertResponseDisplayedCorrectly() {
        cy.dataCy(`role-table-row-name-0`).should("contain", "Admin");
        cy.dataCy(`role-table-row-name-1`).should("contain", "Clinician");
        cy.dataCy(`role-table-row-name-2`).should("contain", "Editable role 1");
        cy.dataCy(`role-table-row-name-3`).should("contain", "Editable role 2");
        cy.dataCy(`role-table-row-name-4`).should("contain", "Editable role 3");
        cy.dataCy(`role-table-row-name-5`).should("contain", "User-Manager");
    }

    public tabActive() {
        cy.dataCy("user-management-tab-Users").should("have.class", "v-tab--active");
    }

    public editButtonVisibleUsers() {
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((row) => {
            cy.dataCy(`user-table-row-actions-${row}`).within(() => {
                cy.dataCy("user-edit").should("be.visible");
            });
        });
    }

    public deleteButtonVisibleUsers() {
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((row) => {
            cy.dataCy(`user-table-row-actions-${row}`).within(() => {
                cy.dataCy("user-delete").should("be.visible");
            });
        });
    }

    public editButtonVisibleRoles() {
        [3, 4, 5].forEach((row) => {
            cy.dataCy(`role-table-row-actions-${row}`).within(() => {
                cy.dataCy("role-edit").should("be.visible");
            });
        });
    }

    public editButtonNotVisibleRoles() {
        [0, 1, 2].forEach((row) => {
            cy.dataCy(`role-table-row-actions-${row}`).should("not.exist");
        });
    }

    public deleteButtonVisibleRoles() {
        [3, 4, 5, 6, 8, 9, 10, 11, 12].forEach((row) => {
            cy.dataCy(`role-table-row-actions-${row}`).within(() => {
                cy.dataCy("role-delete").should("be.visible");
            });
        });
    }

    public deleteButtonNotVisibleRoles() {
        [0, 1, 2, 7].forEach((row) => {
            cy.dataCy(`role-table-row-actions-${row}`).should("not.exist");
        });
    }

    public clickEditButtonUsers(index: number) {
        cy.dataCy(`user-table-row-actions-${index}`).within(() => {
            cy.dataCy("user-edit").click();
        });
    }

    public clickEditButtonRoles() {
        cy.wait(500);
        cy.get('[data-cy="role-edit"] > .v-btn__content > .v-icon').click();
    }

    public clickDeleteButtonUsers(index: number) {
        cy.dataCy(`user-table-row-actions-${index}`).within(() => {
            cy.dataCy("user-delete").click();
        });
    }

    public clickDeleteButtonRoles() {
        cy.wait(500);
        cy.dataCy(`role-table-row-actions-0`).within(() => {
            cy.dataCy("role-delete").click();
        });
    }

    public clickAway() {
        cy.get(".v-card__title").click({ force: true });
        cy.wait(50);
    }

    public requiredFieldsValidationUsers(field: string) {
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

    public requiredFieldsValidationRoles() {
        this.clickDataCy("role-name");
        this.clickAway();
        this.assertRequiredText();
    }

    public assertRequiredText() {
        cy.get(".v-messages__message").should("contain.text", "Required");
    }

    public onlySaveWhenMandatoryFieldsEntered() {
        cy.dataCy("user-first-name").type("Added");
        this.assertAddUserButton("disabled");
        cy.dataCy("user-last-name").type("User");
        this.assertAddUserButton("disabled");
        cy.dataCy("user-email").type("added.user@answerdigital");
        this.assertAddUserButton("disabled");
        this.clickDataCy("user-roles");
        cy.get(".user-role .v-list-item").eq(0).click();
        this.assertAddUserButton("disabled");
        cy.dataCy("user-email").type(".com");
        this.clickAway();
        this.assertAddUserButton("enabled");
    }

    public enterNewRoleName() {
        cy.dataCy("role-name").type("Added role");
        this.clickAway();
    }

    public saveDisabledUnlessAllFIeldsEntered() {
        this.assertAddUserButton("enabled");
        cy.dataCy("user-first-name").clear();
        this.clickAway();
        this.assertAddUserButton("disabled");
        cy.dataCy("user-first-name").type("Added");
        cy.dataCy("user-last-name").clear();
        this.clickAway();
        this.assertAddUserButton("disabled");
        cy.dataCy("user-last-name").type("User");
        cy.dataCy("user-email").clear();
        this.clickAway();
        this.assertAddUserButton("disabled");
        cy.dataCy("user-email").type("added.user@answerdigital.com");
        this.clickDataCy("user-roles");
        cy.get(".user-role .v-list-item").eq(1).click();
        cy.get(".user-role .v-list-item").eq(2).click();
        this.clickAway();
        this.assertAddUserButton("disabled");
        this.clickDataCy("user-roles");
        cy.get(".user-role .v-list-item").eq(0).click();
        cy.get(".user-role .v-list-item").eq(1).click();
        cy.get(".user-role .v-list-item").eq(2).click();
        this.clickAway();
        this.assertAddUserButton("enabled");
    }

    public editUsers() {
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

    public editRoles() {
        cy.dataCy("role-name").clear();
        cy.dataCy("role-name").type("Edited role");
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

    public assertPutRolesDetailsCorrect() {
        cy.intercept("PUT", `/roles/15`, ApiMocks.USER_MANAGEMENT_ROLES_EDIT).as("Put");
        this.clickDataCy("role-edit-confirm-ok");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait("@Put").then((xhr) => {
            const actualRequest = new RolePostData(xhr.request.body);
            expect(actualRequest.name).to.eql("Edited role");
        });
    }

    public assertEditedRoleDisplayedCorrectly() {
        cy.intercept("PUT", `/roles/15`, ApiMocks.USER_MANAGEMENT_ROLES_EDIT).as("Put");
        cy.intercept(
            "GET",
            "https://localhost:8000/roles?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ROLES_EDIT_TABLE,
        ).as("Get");
        this.clickDataCy("role-edit-confirm-ok");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Put", "@Get"]);
        this.assertTableDataCorrectEditedRoles();
    }

    public assertPostedUserCorrect() {
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

    public assertPostedRoleCorrect() {
        cy.intercept("POST", "/roles", ApiMocks.USER_MANAGEMENT_ROLES_ADD).as("Post");
        this.clickDataCy("role-modal-save");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait("@Post").then((xhr) => {
            const actualRequest = new RolePostData(xhr.request.body);
            expect(actualRequest.name).to.eql("Added role");
        });
    }

    public errorAddingRole(statusCode: number) {
        cy.intercept("POST", "/roles", { statusCode: statusCode }).as("Post");
        cy.intercept(
            "GET",
            "https://localhost:8000/roles?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ROLES_ADD,
        ).as("Get");
        this.clickDataCy("role-modal-save");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait("@Post");
    }

    public errorEditingRole(statusCode: number) {
        cy.intercept("PUT", "/roles/15", { statusCode: statusCode }).as("Put");
        cy.intercept(
            "GET",
            "https://localhost:8000/roles?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ROLES_EDIT,
        ).as("Get");
        this.clickDataCy("role-edit-confirm-ok");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait("@Put");
    }

    public errorDeletingRole(statusCode: number) {
        cy.intercept("DELETE", "/roles/15", { statusCode: statusCode }).as("Delete");
        cy.intercept(
            "GET",
            "https://localhost:8000/roles?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ROLES_EDIT,
        ).as("Delete");
        this.clickDataCy("role-delete-ok");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait("@Delete");
    }

    public assertAddRoleDetailsCorrect() {
        cy.intercept("POST", "/roles", ApiMocks.USER_MANAGEMENT_ROLES_ADD).as("Post");
        cy.intercept(
            "GET",
            "https://localhost:8000/roles?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ROLES_ADD,
        ).as("Get");
        this.clickDataCy("role-modal-save");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Post", "@Get"]);
        this.assertTableDataCorrectRoles();
    }

    public assertAddUserButton(status: string) {
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

    public assertAddRoleButton(status: string) {
        switch (status) {
            case "enabled":
                cy.dataCy("role-modal-save").should("be.enabled");
                break;
            case "disabled":
                cy.dataCy("role-modal-save").should("be.disabled");
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

    public assertAddUserDetailsCorrect(user: GetAllUsersResponse) {
        cy.intercept("POST", "/users", ApiMocks.USER_MANAGEMENT_ADD_USER).as("Post");
        cy.intercept(
            "GET",
            "/users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ADD_USER,
        ).as("Get");
        this.clickDataCy("user-modal-save");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Post", "@Get"]);
        this.assertTableDataCorrectUsers(user);
    }

    public assertEditedUserDisplayedCorrectly(
        user: GetAllUsersResponse,
        userEdited: GetAllUsersResponse,
    ) {
        cy.intercept("PUT", `/users/${user.users[0].id}`, ApiMocks.USER_MANAGEMENT_ADD_USER).as(
            "Put",
        );
        cy.intercept(
            "GET",
            "/users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ADD_USER,
        ).as("Get");
        this.clickDataCy("user-edit-confirm-ok");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Put", "@Get"]);
        this.assertTableDataCorrectUsers(userEdited);
    }

    public assertDeleteRequestUsers(user: GetAllUsersResponse) {
        cy.intercept("DELETE", `/users/${user.users[0].id}`, ApiMocks.USER_MANAGEMENT_EMPTY).as(
            "Delete",
        );
        cy.intercept(
            "GET",
            "/users?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_EMPTY,
        ).as("Get");
        this.clickDataCy("user-delete-ok");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Delete", "@Get"]);
    }

    public assertDeleteDisplayedCorrectly(user: GetAllUsersResponse) {
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
        cy.dataCy("user-table-row-firstName-0").should("not.exist");
    }

    public assertDeleteRequestRoles() {
        cy.intercept("DELETE", `/roles/15`, ApiMocks.USER_MANAGEMENT_ROLES_EMPTY).as("Delete");
        cy.intercept(
            "GET",
            "https://localhost:8000/roles?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ROLES_EMPTY,
        ).as("Get");
        this.clickDataCy("role-delete-ok");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Delete", "@Get"]);
    }

    public assertDeleteRoleDisplayedCorrectly() {
        cy.intercept("DELETE", `/roles/15`, ApiMocks.USER_MANAGEMENT_ROLES_EMPTY).as("Delete");
        cy.intercept(
            "GET",
            "https://localhost:8000/roles?search=&first=0&max=10&sortBy=&sortDesc=",
            ApiMocks.USER_MANAGEMENT_ROLES_EMPTY,
        ).as("Get");
        this.clickDataCy("role-delete-ok");
        Cypress.on("uncaught:exception", () => {
            return false;
        });
        cy.wait(["@Delete", "@Get"]);
        cy.dataCy("role-table-row-name-0").should("not.exist");
    }

    public assertFieldsUser(user: GetAllUsersResponse) {
        cy.dataCy("user-first-name").click().should("have.value", user.users[0].firstName);
        cy.dataCy("user-last-name").click().should("have.value", user.users[0].lastName);
        cy.dataCy("user-email").click().should("have.value", user.users[0].email);
        cy.get(UserManagement.rolesDropdown).should("contain", user.users[0].realmRoles[0].name);
        cy.get(UserManagement.rolesDropdown).should("contain", user.users[0].realmRoles[1].name);
    }

    public assertFieldsRoles() {
        cy.dataCy("role-name").click().should("have.value", "Only role");
    }
}
