import { rest } from "msw";
import { UserListItem, UserRoleListItem } from "@/models/user-management/UserManagement";

export const userManagementHandlers = [
    rest.get(`${window.FRONTEND_API_HOST}/users`, (_, res, ctx) => {
        const users: UserListItem[] = [
            {
                id: "some-guid",
                firstName: "Joe",
                lastName: "Bloggs",
                enabled: false,
                email: "joe.bloggs@email.com",
                realmRoles: ["admin", "clinician"],
            },
            {
                id: "some-guid2",
                firstName: "Jane",
                lastName: "Bloggs",
                enabled: true,
                email: "jane.bloggs@email.com",
                realmRoles: ["clinician"],
            },
        ];

        return res(ctx.json(users));
    }),
    rest.get(`${window.FRONTEND_API_HOST}/roles`, (_, res, ctx) => {
        const roles: UserRoleListItem[] = [
            {
                id: "12345",
                name: "admin",
                editable: false,
            },
            {
                id: "12346",
                name: "clinician",
                editable: true,
            },
        ];

        return res(ctx.json(roles));
    }),
];
