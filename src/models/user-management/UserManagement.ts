export interface UserListItem {
    id: string;
    firstName: string;
    lastName: string;
    enabled: boolean;
    email: string;
    realmRoles: string[];
}

export interface UserRoleListItem {
    id: string;
    name: string;
    editable: boolean;
}
