import { UserRoleListItem } from "../../../src/models/user-management/UserManagement";
import ApiMocks from "../../fixtures/mockIndex";

export class RoleData implements UserRoleListItem {
    id: string;
    name: string;
    editable: boolean;

    constructor(user: UserRoleListItem) {
        this.id = user.id;
        this.name = user.name;
        this.editable = user.editable;
    }

    public static ROLE_DATA_1: RoleData = new RoleData(
        <UserRoleListItem>ApiMocks.USER_MANAGEMENT_ROLES[0],
    );
    public static ROLE_DATA_2: RoleData = new RoleData(
        <UserRoleListItem>ApiMocks.USER_MANAGEMENT_ROLES[1],
    );
    public static ROLE_DATA_3: RoleData = new RoleData(
        <UserRoleListItem>ApiMocks.USER_MANAGEMENT_ROLES[2],
    );
    public static ROLE_DATA_4: RoleData = new RoleData(
        <UserRoleListItem>ApiMocks.USER_MANAGEMENT_ROLES[3],
    );
}
