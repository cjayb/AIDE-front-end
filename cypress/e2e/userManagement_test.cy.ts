import UserManagement from "pages/userManagement";
import { UserData } from "../data/user-management/users";
import { RoleData } from "data/user-management/roles";

const userManagementPage = new UserManagement();
const allUsers = UserData.GET_ALL_USERS;
const filteredUsers = UserData.FILTERED_USERS;
const addUser = UserData.USER_DATA_ADD_USER;
const initialUser = UserData.USER_DATA_INITIAL_USER;
const SearchUser = UserData.USER_DATA_SEARCH;
const paginationUsers = UserData.USER_DATA_PAGINATION;
const allRoles = RoleData.ROLE_DATA_1;
const admin = "Admin";
const clinician = "Clinician";
const userManager = "User-Manager";
const EditableRole1 = "Editable role 1";

describe("Display list of users", () => {
    beforeEach(() => {
        userManagementPage.initPage();
    });

    describe("Tabs", () => {
        it("I can see a user's tab", () => {
            userManagementPage.elementVisibleDataCy("user-management-tab-Users");
        });
        it("I can see a user roles tab", () => {
            userManagementPage.elementVisibleDataCy("user-management-tab-Roles");
        });
        it("When I navigate to the page, users tab is selected by default", () => {
            userManagementPage.tabActive();
        });
    });

    describe("All expected elements on the page are visible", () => {
        it("Each row has an edit button visible", () => {
            userManagementPage.editButtonVisibleUsers();
        });
        it("Each row has a delete button visible", () => {
            userManagementPage.deleteButtonVisibleUsers();
        });
        it("An add user button is visible", () => {
            userManagementPage.elementVisibleDataCy("add-user");
        });
        it("'Total number of users' displays the correct number of users", () => {
            userManagementPage.assertTotalUsers(allUsers);
        });
    });

    describe("GET users", () => {
        it(`The users table is populated with the data returned from the API`, () => {
            userManagementPage.assertTableDataCorrectUsers(allUsers);
        });
    });

    describe("Searching the table", () => {
        it(`What I enter in the search bar is correctly sent in the request to the API`, () => {
            userManagementPage.searchUserTable("Susan" as string);
        });
        it(`Users returned are correctly displayed in the table`, () => {
            userManagementPage.searchUserTable("Susan" as string);
            userManagementPage.assertCorrectUserDisplayed(SearchUser as UserData);
        });
    });

    describe("Role filter", () => {
        it(`The correct roles are displayed in the dropdown filter`, () => {
            [admin, clinician, userManager, EditableRole1].forEach((role) => {
                userManagementPage.assertRoles(role);
            });
        });
        it(`Selecting a role in the dropdown should filter users by that role`, () => {
            userManagementPage.selectElementInDropdown(0);
            userManagementPage.assertRowContainsType(filteredUsers);
        });
    });

    describe("Sort", () => {
        ["first name", "last name", "email"].forEach((field) => {
            it(`When I select the ${field} column to sort users, a request is sent to the API to sort by ${field}`, () => {
                userManagementPage.assertRequestSort(field);
            });

            it(`When the sorted users are returned, the users are displayed by ${field}`, () => {
                userManagementPage.sortedUsersDisplayedCorrectly(field);
            });
        });
    });

    describe("Pagination", () => {
        it("Pagination visible", () => {
            userManagementPage.elementVisibleGet(".v-data-footer__select");
            userManagementPage.elementVisibleGet(".v-data-footer__pagination");
            userManagementPage.elementVisibleGet(".v-data-footer__icons-after");
        });
        it("Selecting next page sends a request for the next users to the API", () => {
            userManagementPage.paginationRequestUsers();
        });
        it("Users returned from API are displayed correctly", () => {
            userManagementPage.paginationRequestUsers();
            userManagementPage.assertSecondPageUsers(paginationUsers);
        });
    });
});

describe("Display list of users - API errors", () => {
    const getUserErrorMessage = "Something unexpected went wrong retrieving users";
    const getRolesErrorMessage = "Something unexpected went wrong retrieving roles";
    [400, 404, 500, 502].forEach((statusCode) => {
        it(`UI message displayed if a ${statusCode} error is returned from the API on getting roles on users tab`, () => {
            userManagementPage.errorRoles(statusCode);
            userManagementPage.assertToast(getRolesErrorMessage);
        });
        it(`UI message displayed if a ${statusCode} error is returned from the API on sorting users`, () => {
            userManagementPage.errorSort(statusCode);
            userManagementPage.assertToast(getUserErrorMessage);
        });
        it(`UI message displayed if a ${statusCode} error is returned from the API on searching for users`, () => {
            userManagementPage.errorSearch(statusCode);
            userManagementPage.assertToast(getUserErrorMessage);
        });
        it(`UI message displayed if a ${statusCode} error is returned from the API on going to next page`, () => {
            userManagementPage.errorPagination(statusCode);
            userManagementPage.assertToast(getUserErrorMessage);
        });
    });
});

describe("Add/Edit/Delete list of users", () => {
    beforeEach(() => {
        userManagementPage.initPageOneUser();
        cy.injectAxe();
        cy.configureAxe({
            rules: [
                {
                    id: "nested-interactive",
                    enabled: false,
                },
                {
                    id: "page-has-heading-one",
                    enabled: false,
                },
            ],
        });
    });
    describe("Add new user", () => {
        it("Clicking on 'Add new user' opens up the modal", () => {
            userManagementPage.clickDataCy("add-user");
            userManagementPage.elementVisibleGet(".v-card__actions");
        });
        ["FIRST_NAME", "LAST_NAME", "EMAIL", "ROLE"].forEach((field) => {
            it(`Validation should be displayed to the user to indicate that the '${field}' field is required`, () => {
                userManagementPage.clickDataCy("add-user");
                userManagementPage.requiredFieldsValidationUsers(field);
            });
        });
        it("'Add user' is inactive until all fields are populated", () => {
            userManagementPage.clickDataCy("add-user");
            userManagementPage.onlySaveWhenMandatoryFieldsEntered();
        });
        it("Discarding a user on the Modal does not save it", () => {
            userManagementPage.clickDataCy("add-user");
            userManagementPage.enterAddUserDetails();
            userManagementPage.clickDataCy("user-modal-discard");
            userManagementPage.assertUserNotSaved();
        });
        it(`The correct roles are displayed in the dropdown filter`, () => {
            userManagementPage.clickDataCy("add-user");
            userManagementPage.clickDataCy("user-roles");
            [admin, clinician, userManager, EditableRole1].forEach((role) => {
                userManagementPage.assertRoles(role);
            });
        });
        it("Selecting 'Add user' sends the correct data to the API", () => {
            userManagementPage.clickDataCy("add-user");
            userManagementPage.enterAddUserDetails();
            userManagementPage.assertPostedUserCorrect();
        });
        it("New user is correctly displayed in table", () => {
            userManagementPage.clickDataCy("add-user");
            userManagementPage.enterAddUserDetails();
            userManagementPage.assertAddUserDetailsCorrect(addUser);
        });
        it("Validation on adding a user with an existing email", () => {
            userManagementPage.clickDataCy("add-user");
            userManagementPage.enterAddUserDetails();
            userManagementPage.duplicateRequest("/users", "user-modal-save");
            userManagementPage.assertErrorContainer("User with this email address already exists");
        });
    });

    describe("Edit existing user", () => {
        it("Clicking on Edit button on a row opens up the modal with user details populated", () => {
            userManagementPage.clickEditButtonUsers(0);
            userManagementPage.assertFieldsUser(initialUser);
        });
        it("'Save' is inactive unless all fields are populated", () => {
            userManagementPage.clickEditButtonUsers(0);
            userManagementPage.saveDisabledUnlessAllFIeldsEntered();
        });
        it("Editing a user sends a PUT request with the edited details for that user", () => {
            userManagementPage.clickEditButtonUsers(0);
            userManagementPage.editUsers();
            userManagementPage.clickDataCy("user-modal-save");
            userManagementPage.assertPutDetailsCorrect(initialUser);
        });
        it("Edited user is correctly displayed in the table", () => {
            userManagementPage.clickEditButtonUsers(0);
            userManagementPage.editUsers();
            userManagementPage.clickDataCy("user-modal-save");
            userManagementPage.assertEditedUserDisplayedCorrectly(initialUser, addUser);
        });
        it("Validation on editing a user with an existing email", () => {
            userManagementPage.clickEditButtonUsers(0);
            userManagementPage.editUsers();
            userManagementPage.clickDataCy("user-modal-save");
            userManagementPage.duplicateRequest("/users/1", "user-edit-confirm-ok");
            userManagementPage.assertErrorContainer("User with this email address already exists");
        });
    });

    describe("Delete existing user", () => {
        it("Selecting delete sends a delete request for that user", () => {
            userManagementPage.clickDeleteButtonUsers(0);
            userManagementPage.assertDeleteRequestUsers(initialUser);
        });
        it("Delete response is displayed correctly", () => {
            userManagementPage.clickDeleteButtonUsers(0);
            userManagementPage.assertDeleteDisplayedCorrectly(initialUser);
        });
    });

    describe("Add/edit/delete users - API errors", () => {
        const addUserErrorMessage = "Something unexpected went wrong creating the user";
        const editErrorMessage = "Something unexpected went wrong updating the user details";
        const deleteErrorMessage = "Something unexpected went wrong deleting the user";

        [400, 404, 500, 502].forEach((statusCode) => {
            it(`UI message displayed if a ${statusCode} error is returned on adding new user`, () => {
                userManagementPage.clickDataCy("add-user");
                userManagementPage.enterAddUserDetails();
                userManagementPage.errorAddUser(statusCode);
                userManagementPage.assertToast(addUserErrorMessage);
            });
            it(`UI message displayed if a ${statusCode} error is returned on editing existing user`, () => {
                userManagementPage.clickEditButtonUsers(0);
                userManagementPage.clickDataCy("user-modal-save");
                userManagementPage.errorEditUser(statusCode);
                userManagementPage.assertToast(editErrorMessage);
            });
            it(`UI message displayed if a ${statusCode} error is returned on deleting existing user`, () => {
                userManagementPage.clickDeleteButtonUsers(0);
                userManagementPage.errorDeleteUser(statusCode);
                userManagementPage.assertToast(deleteErrorMessage);
            });
        });
    });
});

describe("Roles", () => {
    beforeEach(() => {
        userManagementPage.initPageRoles();
        cy.injectAxe();
        cy.configureAxe({
            rules: [
                {
                    id: "nested-interactive",
                    enabled: false,
                },
                {
                    id: "page-has-heading-one",
                    enabled: false,
                },
            ],
        });
    });

    describe("All expected elements on the roles page are visible", () => {
        it("Roles that are editable have visible edit buttons", () => {
            userManagementPage.editButtonVisibleRoles();
        });
        it("Roles that are not editable do not have visible edit buttons", () => {
            userManagementPage.editButtonNotVisibleRoles();
        });
        it("Roles that are editable have visible delete buttons", () => {
            userManagementPage.deleteButtonVisibleRoles();
        });
        it("Roles that are not editable do not have visible delete buttons", () => {
            userManagementPage.deleteButtonNotVisibleRoles();
        });
        it("An add new role button is visible", () => {
            userManagementPage.elementVisibleDataCy("add-role");
        });
        it("'Total number of roles' element displays the correct number of roles", () => {
            userManagementPage.assertTotalRoles(allRoles);
        });
    });

    describe("GET roles", () => {
        it(`The roles table is populated with the data returned from the API`, () => {
            userManagementPage.assertTableDataCorrectAllRoles();
        });
    });

    describe("Searching the table", () => {
        it(`Searching the roles table makes correct requests to the api`, () => {
            userManagementPage.searchRoleTable("Clinician" as string);
        });
        it(`The response is correctly displayed in the table`, () => {
            userManagementPage.searchRoleTable("Clinician" as string);
            userManagementPage.assertCorrectRoleDisplayed();
        });
    });

    describe("Sort", () => {
        it(`Sorting roles makes correct request to API`, () => {
            userManagementPage.assertSortedRolesRequest();
        });
        it(`When the sorted roles are returned, the roles are displayed correctly`, () => {
            userManagementPage.assertSortedRolesRequest();
            userManagementPage.assertResponseDisplayedCorrectly();
        });
    });

    describe("Pagination", () => {
        it("Pagination visible", () => {
            userManagementPage.elementVisibleGet(".v-data-footer__select");
            userManagementPage.elementVisibleGet(".v-data-footer__pagination");
            userManagementPage.elementVisibleGet(".v-data-footer__icons-after");
        });
        it("Clicking 'next page' sends the correct request to API", () => {
            userManagementPage.paginationRequestRoles();
        });
        it("Response displayed correctly", () => {
            userManagementPage.paginationRequestRoles();
            userManagementPage.assertSecondPageRoles();
        });
        it("Changing from 10 to 5 per page sends the correct request to API", () => {
            userManagementPage.paginationRequestFiveRolesPerPage();
        });
    });
});

describe("Display list of roles - API errors", () => {
    const getRolesErrorMessage = "Something unexpected went wrong retrieving roles";
    [400, 404, 500, 502].forEach((statusCode) => {
        it(`UI message displayed if a ${statusCode} error is returned from the API on getting roles`, () => {
            userManagementPage.errorRoles(statusCode);
            userManagementPage.assertToast(getRolesErrorMessage);
        });
        it(`UI message displayed if a ${statusCode} error is returned from the API on sorting roles`, () => {
            userManagementPage.errorSortRoles(statusCode);
            userManagementPage.assertToast(getRolesErrorMessage);
        });

        it(`UI message displayed if a ${statusCode} error is returned from the API on searching for a role`, () => {
            userManagementPage.errorSearchRoles(statusCode);
            userManagementPage.assertToast(getRolesErrorMessage);
        });
        it(`UI message displayed if a ${statusCode} error is returned from the API on going to next page`, () => {
            userManagementPage.errorNextPageRoles(statusCode);
            userManagementPage.assertToast(getRolesErrorMessage);
        });
    });
});

describe("Add/Edit/Delete list of roles", () => {
    beforeEach(() => {
        userManagementPage.initPageOneRole();
        cy.injectAxe();
        cy.configureAxe({
            rules: [
                {
                    id: "nested-interactive",
                    enabled: false,
                },
                {
                    id: "page-has-heading-one",
                    enabled: false,
                },
            ],
        });
    });
    describe("Add new role", () => {
        it("Clicking on 'Add new role' opens up the modal", () => {
            userManagementPage.clickDataCy("add-role");
            userManagementPage.elementVisibleGet(".v-card__actions");
        });
        it(`Validation should be displayed to the user to indicate that the 'Name' field is required`, () => {
            userManagementPage.clickDataCy("add-role");
            userManagementPage.requiredFieldsValidationRoles();
        });
        it("'Add role' is inactive until 'Name' field is populated'", () => {
            userManagementPage.clickDataCy("add-role");
            userManagementPage.assertAddRoleButton("disabled");
            userManagementPage.enterNewRoleName();
            userManagementPage.assertAddRoleButton("enabled");
        });
        it("Selecting 'Add role' sends the correct data to the API", () => {
            userManagementPage.clickDataCy("add-role");
            userManagementPage.enterNewRoleName();
            userManagementPage.assertPostedRoleCorrect();
        });
        it("New role is correctly displayed in table", () => {
            userManagementPage.clickDataCy("add-role");
            userManagementPage.enterNewRoleName();
            userManagementPage.assertAddRoleDetailsCorrect();
        });
        it("Validation on adding a role with an existing name", () => {
            userManagementPage.clickDataCy("add-role");
            userManagementPage.enterNewRoleName();
            userManagementPage.duplicateRequest("/roles", "role-modal-save");
            userManagementPage.assertErrorContainer("Role with this name already exists");
        });
    });

    describe("Edit existing role", () => {
        it("Clicking on Edit button on a row opens up the modal with role name populated", () => {
            userManagementPage.clickEditButtonRoles();
            userManagementPage.assertFieldsRoles();
        });
        it("Editing a role sends a PUT request with the edited details for that role", () => {
            userManagementPage.clickEditButtonRoles();
            userManagementPage.editRoles();
            userManagementPage.clickDataCy("role-modal-save");
            userManagementPage.assertPutRolesDetailsCorrect();
        });
        it("Edited role is correctly displayed in the table", () => {
            userManagementPage.clickEditButtonRoles();
            userManagementPage.editRoles();
            userManagementPage.clickDataCy("role-modal-save");
            userManagementPage.assertEditedRoleDisplayedCorrectly();
        });
        it("Validation on editing a role with an existing name", () => {
            userManagementPage.clickEditButtonRoles();
            userManagementPage.editRoles();
            userManagementPage.clickDataCy("role-modal-save");
            userManagementPage.duplicateRequest("/roles/15", "role-edit-confirm-ok");
            userManagementPage.assertErrorContainer("Role with this name already exists");
        });
    });

    describe("Delete existing role", () => {
        it("Selecting delete sends a delete request for that role", () => {
            userManagementPage.clickDeleteButtonRoles();
            userManagementPage.assertDeleteRequestRoles();
        });
        it("Response is correctly displayed in the table", () => {
            userManagementPage.clickDeleteButtonRoles();
            userManagementPage.assertDeleteRoleDisplayedCorrectly();
        });
    });

    describe("Add/edit/delete role - API errors", () => {
        const addRoleErrorMessage = "Something unexpected went wrong creating the role";
        const editErrorMessage = "Something unexpected went wrong updating the role details";
        const deleteErrorMessage = "Something unexpected went wrong deleting the role";

        [400, 404, 500, 502].forEach((statusCode) => {
            it(`UI message displayed if a ${statusCode} error is returned on adding new role`, () => {
                userManagementPage.clickDataCy("add-role");
                userManagementPage.enterNewRoleName();
                userManagementPage.errorAddingRole(statusCode);
                userManagementPage.assertToast(addRoleErrorMessage);
            });
            it(`UI message displayed if a ${statusCode} error is returned on editing existing role`, () => {
                userManagementPage.clickEditButtonRoles();
                userManagementPage.editRoles();
                userManagementPage.clickDataCy("role-modal-save");
                userManagementPage.errorEditingRole(statusCode);
                userManagementPage.assertToast(editErrorMessage);
            });
            it(`UI message displayed if a ${statusCode} error is returned on deleting existing role`, () => {
                userManagementPage.clickDeleteButtonRoles();
                userManagementPage.errorDeletingRole(statusCode);
                userManagementPage.assertToast(deleteErrorMessage);
            });
        });
    });
});
