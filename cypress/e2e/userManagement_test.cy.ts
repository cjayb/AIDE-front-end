import UserManagement from "pages/userManagement";
import { UserData } from "../data/user-management/users";
import { RoleData } from "data/user-management/roles";

const userManagementPage = new UserManagement();
const allUsers = UserData.GET_ALL_USERS;
const addUser = UserData.USER_DATA_ADD_USER;
const initialUser = UserData.USER_DATA_INITIAL_USER;
const SearchUser = UserData.USER_DATA_SEARCH;
const paginationUsers = UserData.USER_DATA_PAGINATION;

describe("Display list of users", () => {
    beforeEach(() => {
        userManagementPage.initPage();
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

    describe("Accessibility", () => {
        it("Page should have no accessibility violations", () => {
            cy.checkA11y();
        });
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
            userManagementPage.editButtonVisible();
        });
        it("Each row has a delete button visible", () => {
            userManagementPage.deleteButtonVisible();
        });
        it("An add user button is visible", () => {
            userManagementPage.elementVisibleDataCy("add-user");
        });
        it("'Total number of users' element displays the correct number of users", () => {
            userManagementPage.assertTotalUsers(allUsers);
        });
    });

    describe("Searching the table", () => {
        it(`What I enter in the search bar is correctly sent in the request to the API`, () => {
            userManagementPage.searchIssuesTable("Susan" as string);
        });
        it(`What is returned from the API is correctly displayed in the table`, () => {
            userManagementPage.searchIssuesTable("Susan" as string);
            userManagementPage.assertCorrectUserReturned(SearchUser as UserData);
        });
    });

    describe("Role filter", () => {
        it(`The correct roles are displayed in the dropdown filter`, () => {
            [
                RoleData.ROLE_DATA_1.name,
                RoleData.ROLE_DATA_2.name,
                RoleData.ROLE_DATA_3.name,
                RoleData.ROLE_DATA_4.name,
            ].forEach((role) => {
                userManagementPage.assertRoles(role);
            });
        });
        const tuple = [
            [RoleData.ROLE_DATA_1.name, 0],
            [RoleData.ROLE_DATA_2.name, 1],
            [RoleData.ROLE_DATA_3.name, 2],
        ];
        tuple.forEach((userType) => {
            const [userRole, position] = userType;
            it("Selecting a type in the dropdown should filter users by that type", () => {
                userManagementPage.selectElementInDropdown(position as number);
                userManagementPage.assertRowContainsType(userRole as string);
            });
        });
        it("Selecting a type assigned to no user displays no users", () => {
            userManagementPage.selectElementInDropdown(3);
            userManagementPage.assertNoUsers();
        });
    });

    describe("GET users", () => {
        it(`I can view the correct data returned by the API for the user in the table`, () => {
            userManagementPage.assertTableDataCorrect(allUsers);
        });
    });

    describe("Sort", () => {
        ["first name", "last name", "email"].forEach((field) => {
            it(`When I select the ${field} column to sort, a request is sent to the API to sort by ${field}`, () => {
                userManagementPage.assertRequestSort(field);
            });

            it(`When the sort data for ${field} is returned, the data is displayed correctly`, () => {
                userManagementPage.sortedDataDisplayedCorrectly(field);
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
            userManagementPage.paginationRequest();
        });
        it("Response from API is displayed correctly", () => {
            userManagementPage.paginationRequest();
            userManagementPage.assertSecondPageUsers(paginationUsers);
        });
    });
});

describe("Display list of users - API errors", () => {
    const getUserErrorMessage = "Something unexpected went wrong retrieving users";
    const getRolesErrorMessage = "Something unexpected went wrong retrieving roles";
    [400, 404, 500, 502].forEach((statusCode) => {
        it(`UI message displayed if a ${statusCode} error is returned from the API on getting roles`, () => {
            userManagementPage.errorRoles(statusCode);
            userManagementPage.assertToast(getRolesErrorMessage);
        });
        it(`UI message displayed if a ${statusCode} error is returned from the API on sorting`, () => {
            userManagementPage.errorSort(statusCode);
            userManagementPage.assertToast(getUserErrorMessage);
        });

        it(`UI message displayed if a ${statusCode} error is returned from the API on searching`, () => {
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
                userManagementPage.requiredFieldsValidation(field);
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
            [
                RoleData.ROLE_DATA_1.name,
                RoleData.ROLE_DATA_2.name,
                RoleData.ROLE_DATA_3.name,
                RoleData.ROLE_DATA_4.name,
            ].forEach((role) => {
                userManagementPage.assertRoles(role);
            });
        });
        it("Selecting 'Add user' sends the correct data to the API", () => {
            userManagementPage.clickDataCy("add-user");
            userManagementPage.enterAddUserDetails();
            userManagementPage.assertPostedDetailsCorrect();
        });
        it("New user is correctly displayed in table", () => {
            userManagementPage.clickDataCy("add-user");
            userManagementPage.enterAddUserDetails();
            userManagementPage.assertAddGetDetailsCorrect(addUser);
        });
    });

    describe("Edit existing user", () => {
        it("Clicking on Edit button on a row opens up the modal with user details populated", () => {
            userManagementPage.clickEditButton(0);
            userManagementPage.assertFields(initialUser);
        });
        it("'Save' is inactive unless all fields are populated", () => {
            userManagementPage.clickEditButton(0);
            userManagementPage.saveDisabledUnlessAllFIeldsEntered();
        });
        it("Making an edit then discarding the modal does not update the user", () => {
            userManagementPage.clickEditButton(0);
            userManagementPage.editFields();
            userManagementPage.clickDataCy("user-modal-discard");
            userManagementPage.assertUserNotSaved();
        });
        it("Editing a user then selecting 'Cancel' on the confirmation modal does not update the user", () => {
            userManagementPage.clickEditButton(0);
            userManagementPage.editFields();
            userManagementPage.clickDataCy("user-modal-save");
            userManagementPage.clickDataCy("user-edit-confirm-cancel");
            userManagementPage.assertUserNotSaved();
        });
        it("Editing a user sends a PUT request with the edited details for that user", () => {
            userManagementPage.clickEditButton(0);
            userManagementPage.editFields();
            userManagementPage.clickDataCy("user-modal-save");
            userManagementPage.assertPutDetailsCorrect(initialUser);
        });
        it("Edited user is correctly displayed in the table", () => {
            userManagementPage.clickEditButton(0);
            userManagementPage.editFields();
            userManagementPage.clickDataCy("user-modal-save");
            userManagementPage.assertEditGetDetailsCorrect(initialUser, addUser);
        });
    });

    describe("Delete existing user", () => {
        it("Selecting delete sends a delete request for that user", () => {
            userManagementPage.clickDeleteButton(0);
            userManagementPage.assertDeleteRequest(initialUser);
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
                userManagementPage.clickEditButton(0);
                userManagementPage.clickDataCy("user-modal-save");
                userManagementPage.errorEditUser(statusCode);
                userManagementPage.assertToast(editErrorMessage);
            });
            it(`UI message displayed if a ${statusCode} error is returned on deleting existing user`, () => {
                userManagementPage.clickDeleteButton(0);
                userManagementPage.errorDeleteUser(statusCode);
                userManagementPage.assertToast(deleteErrorMessage);
            });
        });
    });
});
