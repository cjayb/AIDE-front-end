<template>
    <v-tab-item>
        <v-card class="px-4 py-4">
            <div class="d-flex mb-4 justify-space-between">
                <div class="text-h5">{{ userCount }}</div>
                <div class="d-flex align-center">
                    <div class="mr-6">
                        <v-text-field
                            outlined
                            dense
                            hide-details
                            clearable
                            :append-icon="tableSearch ? '' : 'mdi-magnify'"
                            label="Search by name or email"
                            v-model="tableSearch"
                            data-cy="user-search-input"
                        ></v-text-field>
                    </div>
                    <div class="mr-6 d-flex align-center">
                        <span class="font-weight-bold mr-2">Show</span>
                        <v-select
                            outlined
                            dense
                            hide-details
                            hidden
                            clearable
                            style="min-width: 180px"
                            id="user-filter-role"
                            label="Roles"
                            data-cy="user-filter-role"
                            item-text="name"
                            placeholder="All roles"
                            :menu-props="{ contentClass: 'role-filters' }"
                            :items="roles"
                            v-model="selectedRole"
                        >
                        </v-select>
                    </div>
                    <v-btn color="primary" data-cy="add-user" @click="createNewUser">
                        Add user
                        <v-icon class="ml-1">mdi-plus</v-icon>
                    </v-btn>
                </div>
            </div>
            <v-card elevation="1">
                <v-data-table
                    :headers="userHeaders"
                    :items="usersFiltered"
                    :search="tableSearch"
                    :server-items-length="totalFilteredUsers"
                    :options.sync="tableOptions"
                    :footer-props="{ itemsPerPageOptions: [5, 10] }"
                >
                    <template v-slot:item="{ item, index }">
                        <tr :data-cy="`user-table-row-${index}`">
                            <td class="text-start" :data-cy="`user-table-row-firstname-${index}`">
                                {{ item.firstName }}
                            </td>
                            <td class="text-start" :data-cy="`user-table-row-lastname-${index}`">
                                {{ item.lastName }}
                            </td>
                            <td class="text-start">
                                <v-chip
                                    :color="
                                        item.enabled ? 'light-green lighten-4' : 'red lighten-5'
                                    "
                                    :text-color="
                                        item.enabled ? 'light-green darken-4' : 'red darken-4'
                                    "
                                    :data-cy="`user-table-row-status-${index}`"
                                    small
                                >
                                    {{ item.enabled ? "Enabled" : "Disabled" }}
                                </v-chip>
                            </td>
                            <td class="text-start" :data-cy="`user-table-row-email-${index}`">
                                {{ item.email }}
                            </td>
                            <td
                                class="text-start text-capitalize"
                                :data-cy="`user-table-row-roles-${index}`"
                            >
                                {{ item.realmRoles | commaSeparated }}
                            </td>
                            <td class="text-start" :data-cy="`user-table-row-actions-${index}`">
                                <v-btn
                                    small
                                    elevation="0"
                                    class="mr-2"
                                    aria-label="edit user"
                                    data-cy="user-edit"
                                    @click.stop="() => editUserDetails(item)"
                                >
                                    <v-icon small>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn
                                    small
                                    elevation="0"
                                    aria-label="delete user"
                                    data-cy="user-delete"
                                    @click.stop="() => confirmDeletion(item)"
                                >
                                    <v-icon small>mdi-delete</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </template>

                    <template v-slot:no-data>
                        <span v-if="!selectedRole" class="grey--text text--darken-2">No users</span>
                        <span v-else class="grey--text text--darken-2"
                            >No users found with filters applied</span
                        >
                    </template>
                    <template v-slot:no-results>
                        <span class="grey--text text--darken-2"
                            >No users found with filters applied</span
                        >
                    </template>
                </v-data-table>
            </v-card>
        </v-card>

        <v-dialog persistent v-model="userModal" max-width="500px" v-if="userToEdit">
            <UserModal
                :roles="roles"
                :user="userToEdit"
                @discard="discardChanged"
                @save="confirmEditUserDetails"
            ></UserModal>
        </v-dialog>

        <v-dialog persistent v-model="deleteConfirm" max-width="350px">
            <v-card>
                <v-card-title>Delete user</v-card-title>
                <v-card-text class="grey--text text--darken-3"
                    >Are you sure you would like to delete
                    <strong>{{ userToDelete?.firstName }} {{ userToDelete?.lastName }}</strong
                    >?</v-card-text
                >
                <v-card-actions class="px-4 justify-end">
                    <v-btn text data-cy="user-delete-cancel" @click="cancelUserDeletion">
                        Cancel
                    </v-btn>
                    <v-btn text data-cy="user-delete-ok" color="red darken-2" @click="deleteUser">
                        Yes, delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog persistent v-model="editConfirm" max-width="350px">
            <v-card>
                <v-card-title>Edit user</v-card-title>
                <v-card-text class="grey--text text--darken-3">
                    Are you sure you wish to make changes to
                    <strong>{{ userToEdit?.firstName }} {{ userToEdit?.lastName }} </strong>?
                </v-card-text>
                <v-card-actions class="px-4 justify-end">
                    <v-btn text data-cy="user-edit-confirm-cancel" @click="editConfirm = false">
                        Cancel
                    </v-btn>
                    <v-btn
                        text
                        data-cy="user-edit-confirm-ok"
                        color="primary"
                        @click="continueSavingUserDetails"
                    >
                        Yes, save changes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-tab-item>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { DataTableHeader, DataOptions } from "vuetify";
import UserModal from "./UserModal.vue";
import {
    createUser,
    getAllUsers,
    updateUserDetails,
    deleteUser,
} from "@/api/user-management/UserManagementService";
import { UserListItem, UserRoleListItem } from "@/models/user-management/UserManagement";
import { Prop, Watch } from "vue-property-decorator";
import { throttle } from "underscore";

@Component({
    components: {
        UserModal,
    },
    computed: {
        userCount(): string {
            if (this.$data.totalUsers === 1) {
                return "1 User";
            }

            return `${this.$data.totalUsers} Users`;
        },
        usersFiltered(): UserListItem[] {
            if (this.$data.selectedRole) {
                return (this.$data.users as UserListItem[]).filter((u) =>
                    u.realmRoles.some((r) => r.name === this.$data.selectedRole),
                );
            }

            return this.$data.users;
        },
    },
    filters: {
        commaSeparated(values: UserRoleListItem[]): string {
            return values.map((v) => v.name).join(", ");
        },
    },
})
export default class UserTabItem extends Vue {
    userHeaders: DataTableHeader[] = [
        { text: "First Name", value: "firstName", sortable: true, filterable: true },
        { text: "Last Name", value: "lastName", sortable: true, filterable: true },
        { text: "Status", value: "status", sortable: false },
        { text: "Email", value: "email", sortable: true, filterable: true },
        { text: "Roles", value: "roles", sortable: false },
        { text: "Actions", value: "id", sortable: false, width: "150px" },
    ];

    users: UserListItem[] = [];
    tableSearch = "";
    selectedRole = "";

    userModal = false;
    userToEdit: UserListItem | null = null;

    deleteConfirm = false;
    userToDelete: UserListItem | null = null;

    editConfirm = false;
    userToSave: UserListItem | null = null;

    tableOptions: DataOptions = {
        page: 1,
        itemsPerPage: 10,
        sortBy: [] as string[],
        sortDesc: [] as boolean[],
    } as DataOptions;

    totalUsers = 0;
    totalFilteredUsers = 0;

    private throttledFetchUsers = throttle(() => {
        this.fetchAndSetUsers();
    }, 500);

    @Prop({ default: () => [] })
    roles!: UserRoleListItem[];

    @Watch("tableOptions", { deep: true })
    tableOptionsChanged() {
        this.throttledFetchUsers();
    }

    @Watch("tableSearch")
    async tableSearchChanged() {
        this.throttledFetchUsers();
    }

    createNewUser() {
        this.userToEdit = {} as UserListItem;
        this.userModal = true;
    }

    editUserDetails(user: UserListItem) {
        this.userToEdit = user;
        this.userModal = true;
    }

    discardChanged() {
        this.userModal = false;
        setTimeout(() => {
            this.userToEdit = null;
        }, 500);
    }

    confirmDeletion(user: UserListItem) {
        this.userToDelete = user;
        this.deleteConfirm = true;
    }

    cancelUserDeletion() {
        this.deleteConfirm = false;
        this.userToDelete = null;
    }

    async deleteUser() {
        if (!this.userToDelete) {
            return;
        }

        const ok = await deleteUser(this.userToDelete!.id);

        if (ok) {
            this.deleteConfirm = false;
            this.userToDelete = null;

            await this.fetchAndSetUsers();

            Vue.$toast.success("User successfully deleted");
        }
    }

    confirmEditUserDetails(user: UserListItem) {
        if (user.id) {
            this.editConfirm = true;
            this.userToSave = user;

            return;
        }

        this.saveUserDetails(user);
    }

    async continueSavingUserDetails() {
        if (!this.userToSave) {
            return;
        }

        this.editConfirm = false;
        await this.saveUserDetails(this.userToSave);
        this.userToSave = null;
    }

    async saveUserDetails(user: UserListItem) {
        let ok = false;

        if (user.id) {
            ok = await updateUserDetails(user.id, user);
        } else {
            ok = await createUser(user);
        }

        if (ok) {
            this.userModal = false;

            // need to set the timeout so it clears form correctly
            setTimeout(() => {
                this.userToEdit = null;
            }, 500);

            await this.fetchAndSetUsers();

            Vue.$toast.success("User successfully saved");
        }
    }

    private async fetchAndSetUsers() {
        const { totalUsers, totalFilteredUsers, users } = await getAllUsers({
            search: this.tableSearch,
            ...this.tableOptions,
        });

        this.totalUsers = totalUsers;
        this.totalFilteredUsers = totalFilteredUsers;
        this.users = users;
    }
}
</script>
