import { UserListItem } from "../../../src/models/user-management/UserManagement";
import ApiMocks from "../../fixtures/mockIndex";

export class UserData implements UserListItem {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    realmRoles: string[];
    enabled: boolean;

    constructor(user: UserListItem) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.realmRoles = user.realmRoles;
        this.enabled = user.enabled;
    }

    public static USER_DATA_1: UserData = new UserData(
        <UserListItem>ApiMocks.USER_MANAGEMENT_GET_USERS[0],
    );
    public static USER_DATA_2: UserData = new UserData(
        <UserListItem>ApiMocks.USER_MANAGEMENT_GET_USERS[1],
    );
    public static USER_DATA_3: UserData = new UserData(
        <UserListItem>ApiMocks.USER_MANAGEMENT_GET_USERS[2],
    );
    public static USER_DATA_4: UserData = new UserData(
        <UserListItem>ApiMocks.USER_MANAGEMENT_GET_USERS[3],
    );
    public static USER_DATA_5: UserData = new UserData(
        <UserListItem>ApiMocks.USER_MANAGEMENT_GET_USERS[4],
    );
    public static USER_DATA_6: UserData = new UserData(
        <UserListItem>ApiMocks.USER_MANAGEMENT_GET_USERS[5],
    );
    public static USER_DATA_7: UserData = new UserData(
        <UserListItem>ApiMocks.USER_MANAGEMENT_GET_USERS[6],
    );
    public static USER_DATA_8: UserData = new UserData(
        <UserListItem>ApiMocks.USER_MANAGEMENT_GET_USERS[7],
    );
    public static USER_DATA_9: UserData = new UserData(
        <UserListItem>ApiMocks.USER_MANAGEMENT_GET_USERS[8],
    );
    public static USER_DATA_10: UserData = new UserData(
        <UserListItem>ApiMocks.USER_MANAGEMENT_GET_USERS[9],
    );
    public static USER_DATA_11: UserData = new UserData(
        <UserListItem>ApiMocks.USER_MANAGEMENT_GET_USERS[10],
    );
}
