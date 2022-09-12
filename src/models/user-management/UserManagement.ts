export interface GetAllUsersResponse {
    totalUsers: number;
    totalFilteredUsers: number;
    users: UserListItem[];
}

export interface UserListItem {
    id: string;
    firstName: string;
    lastName: string;
    enabled: boolean;
    email: string;
    realmRoles: UserRoleListItem[];
}

export interface UserRoleListItem {
    id: string;
    name: string;
    editable?: boolean;
}
