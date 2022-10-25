<template>
    <v-tab-item>
        <v-card class="px-4 py-4">
            <div class="d-flex mb-4 justify-space-between">
                <div class="text-h5">{{ userRoleCount }}</div>
                <div class="d-flex align-center">
                    <div class="mr-6">
                        <v-text-field
                            outlined
                            dense
                            hide-details
                            clearable
                            :append-icon="tableSearch ? '' : 'mdi-magnify'"
                            label="Search by name"
                            v-model="tableSearch"
                            data-cy="role-search-input"
                        ></v-text-field>
                    </div>
                    <v-btn color="primary" data-cy="add-role" @click="createNewRole">
                        Add new role
                        <v-icon class="ml-1">mdi-plus</v-icon>
                    </v-btn>
                </div>
            </div>
            <v-card elevation="1">
                <v-data-table
                    :headers="roleHeaders"
                    :items="rolesList"
                    :search="tableSearch"
                    :server-items-length="totalFilteredRoles"
                    :options.sync="tableOptions"
                    :footer-props="{ itemsPerPageOptions: [5, 10] }"
                    class="roles-table"
                >
                    <template v-slot:item="{ item, index }">
                        <tr :data-cy="`role-table-row-${index}`">
                            <td class="text-start" :data-cy="`role-table-row-name-${index}`">
                                {{ item.name }}
                            </td>
                            <td
                                v-if="item.editable"
                                class="text-start"
                                :data-cy="`role-table-row-actions-${index}`"
                            >
                                <v-btn
                                    small
                                    elevation="0"
                                    class="mr-2"
                                    aria-label="edit role"
                                    data-cy="role-edit"
                                    @click="
                                        editRoleDetails({
                                            id: item.id,
                                            name: item.name,
                                            editable: true,
                                        })
                                    "
                                >
                                    <v-icon small>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn
                                    small
                                    elevation="0"
                                    aria-label="delete role"
                                    data-cy="role-delete"
                                    @click="
                                        confirmDeletion({
                                            id: item.id,
                                            name: item.name,
                                            editable: true,
                                        })
                                    "
                                >
                                    <v-icon small>mdi-delete</v-icon>
                                </v-btn>
                            </td>
                            <td v-else />
                        </tr>
                    </template>

                    <template v-slot:no-data>
                        <span class="grey--text text--darken-2">No roles</span>
                    </template>
                    <template v-slot:no-results>
                        <span class="grey--text text--darken-2">No roles found</span>
                    </template>
                </v-data-table>
            </v-card>
        </v-card>
        <v-dialog persistent v-model="roleModal" max-width="500px" v-if="roleToEdit">
            <RoleModal
                :role="roleToEdit"
                :roleExists="roleExists"
                @discard="discardChanged"
                @save="confirmEditRoleDetails"
            ></RoleModal>
        </v-dialog>

        <v-dialog persistent v-model="deleteConfirm" max-width="350px">
            <v-card>
                <v-card-title>Delete role</v-card-title>
                <v-card-text class="grey--text text--darken-3"
                    >Are you sure you would like to delete <strong>{{ roleToDelete?.name }}</strong
                    >?</v-card-text
                >
                <v-card-actions class="px-4 justify-end">
                    <v-btn text data-cy="role-delete-cancel" @click="cancelRoleDeletion">
                        Cancel
                    </v-btn>
                    <v-btn text data-cy="role-delete-ok" color="red darken-2" @click="deleteRole">
                        Yes, delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog persistent v-model="editConfirm" max-width="350px">
            <v-card>
                <v-card-title>Edit role</v-card-title>
                <v-card-text class="grey--text text--darken-3">
                    Are you sure you wish to make changes to
                    <strong> {{ roleToEdit?.name }} </strong>?
                </v-card-text>
                <v-card-actions class="px-4 justify-end">
                    <v-btn text data-cy="role-edit-confirm-cancel" @click="editConfirm = false">
                        Cancel
                    </v-btn>
                    <v-btn
                        text
                        data-cy="role-edit-confirm-ok"
                        color="primary"
                        @click="continueSavingRoleDetails"
                    >
                        Yes, save changes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-tab-item>
</template>

<script lang="ts">
import {
    deleteRole,
    getPaginatedRoles,
    createRole,
    updateRole,
} from "@/api/user-management/UserManagementService";
import Vue from "vue";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";
import { DataOptions, DataTableHeader } from "vuetify";
import { UserRoleListItem } from "@/models/user-management/UserManagement";
import RoleModal from "./RoleModal.vue";
import { throttle } from "underscore";
import { isResultOk } from "@/utils/axios-helpers";
import { AxiosError, AxiosResponse } from "axios";

@Component({
    components: {
        RoleModal,
    },
    computed: {
        userRoleCount(): string {
            const count: number = this.$data.totalRoles;

            if (count === 1) {
                return "1 Role";
            }

            return `${count} Roles`;
        },
    },
})
export default class UserRolesTabItem extends Vue {
    roleHeaders: DataTableHeader[] = [
        { text: "Name", value: "name", sortable: true, align: "start", width: "83%" },
        { text: "Actions", value: "id", sortable: false, align: "start", width: "150px" },
    ];

    rolesList: UserRoleListItem[] = [];

    totalRoles = 0;
    totalFilteredRoles = 0;

    roleExists = false;

    tableSearch = "";
    tableOptions: DataOptions = {
        page: 1,
        itemsPerPage: 10,
        sortBy: [] as string[],
        sortDesc: [] as boolean[],
    } as DataOptions;

    roleModal = false;
    roleToEdit: UserRoleListItem | null = null;

    editConfirm = false;
    roleToSave: UserRoleListItem | null = null;

    deleteConfirm = false;
    roleToDelete: UserRoleListItem | null = null;

    private throttledFetchRoles = throttle(() => {
        this.fetchRolePage();
    }, 500);

    @Watch("tableOptions", { deep: true })
    async tableOptionsChanged() {
        this.throttledFetchRoles();
    }

    @Watch("tableSearch")
    async tableSearchChanged() {
        this.throttledFetchRoles();
    }

    private async fetchRolePage() {
        const { totalRolesCount, totalFilteredRolesCount, roles } = await getPaginatedRoles({
            search: this.tableSearch,
            ...this.tableOptions,
        });

        this.totalRoles = totalRolesCount;
        this.totalFilteredRoles = totalFilteredRolesCount;
        this.rolesList = roles;
    }

    createNewRole() {
        this.roleToEdit = {} as UserRoleListItem;
        this.roleModal = true;
    }

    editRoleDetails(role: UserRoleListItem) {
        if (!role.editable) {
            return;
        }

        this.roleToEdit = role;
        this.roleModal = true;
    }

    confirmEditRoleDetails(role: UserRoleListItem) {
        if (role.id) {
            this.editConfirm = true;
            this.roleToSave = role;

            return;
        }

        this.saveRoleDetails(role);
    }

    discardChanged() {
        this.roleModal = false;
        this.roleExists = false;
        setTimeout(() => {
            this.roleToEdit = null;
        }, 500);
    }

    confirmDeletion(role: UserRoleListItem) {
        this.roleToDelete = role;
        this.deleteConfirm = true;
    }

    cancelRoleDeletion() {
        this.deleteConfirm = false;
        this.roleToDelete = null;
    }

    async deleteRole() {
        if (!this.roleToDelete) {
            return;
        }

        const responseOk = await deleteRole(this.roleToDelete.id);

        if (responseOk) {
            this.deleteConfirm = false;
            this.roleToDelete = null;

            await this.fetchRolePage();
            this.$emit("rolesChanged");

            Vue.$toast.success("Role successfully deleted");
        }
    }

    async continueSavingRoleDetails() {
        if (!this.roleToSave) {
            return;
        }

        this.editConfirm = false;
        await this.saveRoleDetails(this.roleToSave);
        this.roleToSave = null;
    }

    async saveRoleDetails(role: UserRoleListItem) {
        let response = {} as AxiosResponse | AxiosError;

        if (role.id && role.name === "") {
            response.status = 200;
        } else if (role.id && this.roleToEdit?.name !== role.name) {
            response = await updateRole(role.id, role);
        } else {
            response = await createRole(role);
        }

        if (isResultOk(response as AxiosResponse)) {
            this.roleModal = false;
            this.roleExists = false;

            setTimeout(() => {
                this.roleToEdit = null;
            }, 500);

            await this.fetchRolePage();
            this.$emit("rolesChanged");

            Vue.$toast.success("Role successfully saved");
            return;
        } else if ((response as AxiosError).response?.status === 409) {
            this.roleExists = true;
            return;
        } else {
            this.roleModal = false;
            this.roleExists = false;
            setTimeout(() => {
                this.roleToEdit = null;
            }, 500);
            return;
        }
    }
}
</script>
