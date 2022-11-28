import { UserRoleListItem } from "../../../src/models/user-management/UserManagement";
import ApiMocks from "../../fixtures/mockIndex";

export class RolePostData implements UserRoleListItem {
    id: string;
    name: string;
    editable?: boolean;

    constructor(role: UserRoleListItem) {
        this.id = role.id;
        this.name = role.name;
        this.editable = role.editable;
    }

    public static ROLE_POST_DATA: RolePostData = new RolePostData(
        <UserRoleListItem>ApiMocks.USER_MANAGEMENT_ROLES,
    );
}
