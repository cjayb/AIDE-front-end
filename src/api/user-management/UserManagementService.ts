import { UserListItem, UserRoleListItem } from "@/models/user-management/UserManagement";
import { createAxiosInstance, ErrorMessageMap } from "@/utils/axios-helpers";

const errorMessagesUsers: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving users",
};

const httpUsers = createAxiosInstance(errorMessagesUsers);

const errorMessagesRoles: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving roles",
};

const httpRoles = createAxiosInstance(errorMessagesRoles);

export async function getAllUsers(): Promise<UserListItem[]> {
    const response = await httpUsers.get("/users");
    return response.status === 200 ? response.data : [];
}

export async function getAllRoles(): Promise<UserRoleListItem[]> {
    const response = await httpRoles.get("/roles");
    return response.status === 200 ? response.data : [];
}
