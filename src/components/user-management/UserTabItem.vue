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
                        <label for="user-filter-role" class="font-weight-bold mr-2">Show</label>
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
                    <v-btn color="primary" data-cy="add-user">
                        Add user
                        <v-icon class="ml-1">mdi-plus</v-icon>
                    </v-btn>
                </div>
            </div>
            <v-card elevation="1">
                <v-data-table :headers="userHeaders" :items="usersFiltered" :search="tableSearch">
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
                                    :color="item.enabled ? 'green' : 'yellow'"
                                    :data-cy="`user-table-row-status-${index}`"
                                    class="lighten-2"
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
                                >
                                    <v-icon small>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn
                                    small
                                    elevation="0"
                                    aria-label="delete user"
                                    data-cy="user-delete"
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
    </v-tab-item>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { DataTableHeader } from "vuetify";
import { getAllUsers } from "@/api/user-management/UserManagementService";
import { UserListItem, UserRoleListItem } from "@/models/user-management/UserManagement";
import { Prop } from "vue-property-decorator";

@Component({
    computed: {
        userCount(): string {
            const count: number = this.$data.users.length;

            if (count === 1) {
                return "1 User";
            }

            return `${count} Users`;
        },
        usersFiltered(): UserListItem[] {
            if (this.$data.selectedRole) {
                return (this.$data.users as UserListItem[]).filter((u) =>
                    u.realmRoles.includes(this.$data.selectedRole),
                );
            }

            return this.$data.users;
        },
    },
    filters: {
        commaSeparated(values: string[]): string {
            return values.join(", ");
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
        { text: "Actions", value: "id", sortable: false },
    ];

    users: UserListItem[] = [];
    tableSearch = "";
    selectedRole = "";

    @Prop({ default: () => [] })
    roles!: UserRoleListItem[];

    async mounted() {
        this.users = await getAllUsers();
    }
}
</script>
