import {
    UserListItem,
    GetAllUsersResponse,
} from "../../../src/models/user-management/UserManagement";
import ApiMocks from "../../fixtures/mockIndex";

export class UserData implements GetAllUsersResponse {
    totalUserCount: number;
    totalFilteredUserCount: number;
    users: UserListItem[];

    constructor(getAllUsersResponse: GetAllUsersResponse) {
        this.totalUserCount = getAllUsersResponse.totalUserCount;
        this.totalFilteredUserCount = getAllUsersResponse.totalFilteredUserCount;
        this.users = getAllUsersResponse.users;
    }

    public static GET_ALL_USERS: UserData = new UserData(
        <GetAllUsersResponse>ApiMocks.USER_MANAGEMENT_GET_USERS,
    );
    public static USER_DATA_ADD_USER: UserData = new UserData(
        <GetAllUsersResponse>ApiMocks.USER_MANAGEMENT_ADD_USER,
    );
    public static USER_DATA_INITIAL_USER: UserData = new UserData(
        <GetAllUsersResponse>ApiMocks.USER_MANAGEMENT_ONE_USER,
    );
    public static USER_DATA_SEARCH: UserData = new UserData(
        <GetAllUsersResponse>ApiMocks.USER_MANAGEMENT_SEARCH,
    );
    public static USER_DATA_PAGINATION: UserData = new UserData(
        <GetAllUsersResponse>ApiMocks.USER_MANAGEMENT_PAGINATION,
    );
    public static FILTERED_USERS: UserData = new UserData(
        <GetAllUsersResponse>ApiMocks.USER_MANAGEMENT_SORT_ADMIN_ROLE,
    );
}
