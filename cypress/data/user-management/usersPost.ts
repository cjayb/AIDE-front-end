import { UserRoleListItem, UserListItem } from "../../../src/models/user-management/UserManagement";
import ApiMocks from "../../fixtures/mockIndex";

export class UserDataPost implements UserListItem {
    id: string;
    firstName: string;
    lastName: string;
    enabled: boolean;
    email: string;
    realmRoles: UserRoleListItem[];

    constructor(getAllUsersResponse: UserListItem) {
        this.id = getAllUsersResponse.id;
        this.firstName = getAllUsersResponse.firstName;
        this.lastName = getAllUsersResponse.lastName;
        this.email = getAllUsersResponse.email;
        this.realmRoles = getAllUsersResponse.realmRoles;
    }

    public static GET_ALL_USERS: UserDataPost = new UserDataPost(
        <UserListItem>ApiMocks.USER_MANAGEMENT_GET_USERS,
    );
    public static USER_DATA_ADD_USER: UserDataPost = new UserDataPost(
        <UserListItem>ApiMocks.USER_MANAGEMENT_ADD_USER,
    );
    public static USER_DATA_INITIAL_USER: UserDataPost = new UserDataPost(
        <UserListItem>ApiMocks.USER_MANAGEMENT_ONE_USER,
    );
    public static USER_DATA_SEARCH: UserDataPost = new UserDataPost(
        <UserListItem>ApiMocks.USER_MANAGEMENT_SEARCH,
    );
    public static USER_DATA_PAGINATION: UserDataPost = new UserDataPost(
        <UserListItem>ApiMocks.USER_MANAGEMENT_PAGINATION,
    );
}
