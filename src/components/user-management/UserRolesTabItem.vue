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
                    <v-btn color="primary" data-cy="add-role">
                        Add new role
                        <v-icon class="ml-1">mdi-plus</v-icon>
                    </v-btn>
                </div>
            </div>
            <v-card elevation="1">
                <v-data-table
                    :headers="roleHeaders"
                    :items="rolesPage.roles"
                    :search="tableSearch"
                    :server-items-length="rolesPage.totalFilteredRolesCount"
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
                                >
                                    <v-icon small>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn
                                    small
                                    elevation="0"
                                    aria-label="delete role"
                                    data-cy="role-delete"
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
    </v-tab-item>
</template>

<script lang="ts">
import { getPaginatedRoles } from "@/api/user-management/UserManagementService";
import { PaginatedRolesResponse } from "@/models/user-management/UserManagement";
import Vue from "vue";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";
import { DataOptions, DataTableHeader } from "vuetify";

@Component({
    computed: {
        userRoleCount(): string {
            const count: number = this.$data.rolesPage.totalRolesCount;

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
        { text: "Actions", value: "id", sortable: false, align: "start", width: "17%" },
    ];

    rolesPage: PaginatedRolesResponse = {} as PaginatedRolesResponse;
    tableSearch = "";
    tableOptions: DataOptions = {
        page: 1,
        itemsPerPage: 10,
        sortBy: [] as string[],
        sortDesc: [] as boolean[],
    } as DataOptions;

    async mounted() {
        await this.fetchRoles();
    }

    @Watch("tableOptions", { deep: true })
    async tableOptionsChanged() {
        await this.fetchRoles();
    }

    @Watch("tableSearch")
    async tableSearchChanged() {
        await this.fetchRoles();
    }

    private async fetchRoles() {
        this.rolesPage = await getPaginatedRoles({
            search: this.tableSearch,
            ...this.tableOptions,
        });
    }
}
</script>
