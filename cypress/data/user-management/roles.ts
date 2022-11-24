import {
    UserRoleListItem,
    PaginatedRolesResponse,
} from "../../../src/models/user-management/UserManagement";
import ApiMocks from "../../fixtures/mockIndex";

export class RoleData implements PaginatedRolesResponse {
    totalRolesCount: number;
    totalFilteredRolesCount: number;
    roles: UserRoleListItem[];

    constructor(role: PaginatedRolesResponse) {
        this.totalRolesCount = role.totalRolesCount;
        this.totalFilteredRolesCount = role.totalFilteredRolesCount;
        this.roles = role.roles;
    }

    public static ROLE_DATA_1: RoleData = new RoleData(
        <PaginatedRolesResponse>ApiMocks.USER_MANAGEMENT_ROLES,
    );
}
