import UserManagement from "pages/userManagement";
import { UserData } from "../data/user-management/users";
import { RoleData } from "data/user-management/roles";

const userManagementPage = new UserManagement();
const userOne = UserData.USER_DATA_1;
const firstName = '[aria-label="First Name: Not sorted. Activate to sort ascending."]';
const lastName = '[aria-label="Last Name: Not sorted. Activate to sort ascending."]';
const email = '[aria-label="Email: Not sorted. Activate to sort ascending."]';

describe("List of users integration tests", () => {
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
            userManagementPage.elementVisible("user-management-tab-Users");
        });
        it("I can see a user roles tab", () => {
            userManagementPage.elementVisible("user-management-tab-Roles");
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
            userManagementPage.elementVisible("add-user");
        });
        it("Total number of users is visible", () => {
            userManagementPage.elementVisibleCyGet(".text-h5");
        });
    });

    describe("I can search the table", () => {
        const tuple2 = [
            ["ALexander", userOne, "First Name"],
            ["Bazatronics", userOne, "Last name"],
            ["alexander.bazatronics@answerdigital.com", userOne, "E-mail"],
        ];
        tuple2.forEach(($type) => {
            const [search_text, user, test_name] = $type;
            it(`Using the search field I can search for a specific ${test_name}`, () => {
                userManagementPage.searchIssuesTable(search_text as string);
                userManagementPage.assertCorrectTaskReturned(user as UserData);
            });
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
            userManagementPage.noUsers();
        });
    });

    describe("GET users", () => {
        it(`I can view the correct data returned by the API for the user in the table`, () => {
            userManagementPage.assertTableDataCorrect(userOne);
        });
    });

    describe("Sort", () => {
        it(`I can sort by first name`, () => {
            userManagementPage.select(firstName);
            userManagementPage.assertRowContains("firstName");
        });
        it(`I can sort by last name`, () => {
            userManagementPage.select(lastName);
            userManagementPage.assertRowContains("lastName");
        });
        it(`I can sort by email`, () => {
            userManagementPage.select(email);
            userManagementPage.assertRowContains("email");
        });
    });

    describe("Pagination", () => {
        it("Pagination visible", () => {
            userManagementPage.elementVisibleCyGet(".v-data-footer__select");
            userManagementPage.elementVisibleCyGet(".v-data-footer__pagination");
            userManagementPage.elementVisibleCyGet(".v-data-footer__icons-after");
        });
        it("10 users visible per page", () => {
            userManagementPage.usersPerPage(9, 10);
        });
    });
});

describe("API errors", () => {
    const getUserErrorMessage = "Something unexpected went wrong retrieving users";
    const getRolesErrorMessage = "Something unexpected went wrong retrieving roles";
    [400, 404, 500, 502].forEach((statusCode) => {
        it("UI message displayed if an error is returned from the API on getting users", () => {
            userManagementPage.initPageErrorUsers(statusCode);
            userManagementPage.assertToast(getUserErrorMessage);
        });
    });
    [400, 404, 500, 502].forEach((statusCode) => {
        it("UI message displayed if an error is returned from the API on getting users", () => {
            userManagementPage.initPageErrorRoles(statusCode);
            userManagementPage.assertToast(getRolesErrorMessage);
        });
    });
});
