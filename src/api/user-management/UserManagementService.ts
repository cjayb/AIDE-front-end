import {
    GetAllUsersResponse,
    PaginatedRolesResponse,
    UserListItem,
    UserRoleListItem,
} from "@/models/user-management/UserManagement";
import { createAxiosInstance, ErrorMessageMap, isResultOk } from "@/utils/axios-helpers";
import { AxiosError, AxiosResponse } from "axios";

const errorMessagesUsers: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving users",
    put: "Something unexpected went wrong updating the user details",
    post: "Something unexpected went wrong creating the user",
    delete: "Something unexpected went wrong deleting the user",
};

const httpUsers = createAxiosInstance(errorMessagesUsers);

const errorMessagesRoles: ErrorMessageMap = {
    get: "Something unexpected went wrong retrieving roles",
    put: "Something unexpected went wrong updating the role details",
    post: "Something unexpected went wrong creating the role",
    delete: "Something unexpected went wrong deleting the role",
};

const httpRoles = createAxiosInstance(errorMessagesRoles);

interface QueryParams {
    search?: string;
    page: number;
    itemsPerPage: number;
    sortBy: string[];
    sortDesc: boolean[];
}

export async function getAllUsers(query: QueryParams): Promise<GetAllUsersResponse> {
    const params = new URLSearchParams({
        search: query.search?.replaceAll(" ", "%") ?? "",
        first:
            query.page === 1 || query.search
                ? "0"
                : `${query.page * query.itemsPerPage - query.itemsPerPage}`,
        max: `${query.itemsPerPage}`,
        sortBy: query.sortBy.length ? query.sortBy[0] : "",
        sortDesc: query.sortDesc.length ? `${query.sortDesc[0]}` : "",
    });

    const response = await httpUsers.get<GetAllUsersResponse>(`/users?${params}`);

    const defaultData = { totalUserCount: 0, totalFilteredUserCount: 0, users: [] };

    return isResultOk(response) ? response.data : defaultData;
}

export async function updateUserDetails(
    userId: string,
    user: UserListItem,
): Promise<AxiosResponse | AxiosError> {
    return await httpUsers.put(`/users/${userId}`, user).catch((error) => {
        if (error) {
            return error;
        }
    });
}

export async function createUser(user: UserListItem): Promise<AxiosResponse | AxiosError> {
    return await httpUsers.post("/users", user).catch((error) => {
        if (error) {
            return error;
        }
    });
}

export async function deleteUser(userId: string): Promise<boolean> {
    try {
        const result = await httpUsers.delete(`/users/${userId}`);
        return isResultOk(result);
    } catch {
        return false;
    }
}

export async function getAllRoles(): Promise<UserRoleListItem[]> {
    const response = await httpRoles.get<UserRoleListItem[]>("/roles/list");
    return isResultOk(response) ? response.data : [];
}

export async function getPaginatedRoles(query: QueryParams): Promise<PaginatedRolesResponse> {
    const params = new URLSearchParams({
        search: query.search?.replaceAll(" ", "%") ?? "",
        first: query.page === 1 ? "0" : `${query.page * query.itemsPerPage - query.itemsPerPage}`,
        max: `${query.itemsPerPage}`,
        sortBy: query.sortBy.length ? query.sortBy[0] : "",
        sortDesc: query.sortDesc.length ? `${query.sortDesc[0]}` : "",
    });

    const defaultData = { totalRolesCount: 0, totalFilteredRolesCount: 0, roles: [] };

    const response = await httpRoles.get<PaginatedRolesResponse>(`/roles?${params}`);
    return isResultOk(response) ? response.data : defaultData;
}

export async function createRole(role: UserRoleListItem): Promise<boolean> {
    try {
        const result = await httpRoles.post("/roles", role);
        return isResultOk(result);
    } catch {
        return false;
    }
}

export async function updateRole(roleId: string, role: UserRoleListItem): Promise<boolean> {
    try {
        const result = await httpRoles.put(`/roles/${roleId}`, role);
        return isResultOk(result);
    } catch {
        return false;
    }
}

export async function deleteRole(roleId: string): Promise<boolean> {
    try {
        const result = await httpRoles.delete(`/roles/${roleId}`);
        return isResultOk(result);
    } catch {
        return false;
    }
}
