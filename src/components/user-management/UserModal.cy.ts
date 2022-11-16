import { UserListItem, UserRoleListItem } from "@/models/user-management/UserManagement";
import UserModal from "./UserModal.vue";

describe("<UserModal />", () => {
    it("renders the modal with no user", () => {
        const roles: UserRoleListItem[] = [
            {
                id: "admin",
                name: "admin",
            },
        ];

        cy.mount(UserModal, { propsData: { roles, user: {} } });
        cy.get("[data-cy=user-modal-save]").should("be.disabled");
    });

    it("renders the modal with user", () => {
        const roles: UserRoleListItem[] = [
            {
                id: "admin",
                name: "admin",
            },
        ];

        const user: UserListItem = {
            id: "some-user",
            firstName: "Joe",
            lastName: "Bloggs",
            enabled: true,
            realmRoles: [
                {
                    id: "admin",
                    name: "admin",
                },
            ],
            email: "joe.bloggs@email.com",
        };

        cy.mount(UserModal, { propsData: { roles, user } });
        cy.get("[data-cy=user-modal-save]").should("be.enabled");
    });
});
