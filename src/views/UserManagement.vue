<template>
    <v-container fluid>
        <v-container fluid class="mt-3 mb-7 px-7">
            <v-row>
                <v-col class="col-md-7 col-xl-9">
                    <h2 class="section-title">User Management</h2>
                </v-col>
            </v-row>

            <v-row>
                <v-tabs v-model="currentTab" color="purple darken-1">
                    <v-tab v-for="tab in tabs" :key="tab" :data-cy="`user-management-tab-${tab}`">
                        {{ tab }}
                    </v-tab>

                    <v-tabs-items v-model="currentTab">
                        <UserTabItem :roles="roles" />
                        <UserRolesTabItem @rolesChanged="fetchAllRoles()" />
                    </v-tabs-items>
                </v-tabs>
            </v-row>
        </v-container>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import UserTabItem from "@/components/user-management/UserTabItem.vue";
import UserRolesTabItem from "@/components/user-management/UserRolesTabItem.vue";
import { UserRoleListItem } from "@/models/user-management/UserManagement";
import { getAllRoles } from "@/api/user-management/UserManagementService";

@Component({
    components: {
        UserTabItem,
        UserRolesTabItem,
    },
})
export default class UserManagement extends Vue {
    tabs = ["Users", "Roles"];
    currentTab = "Users";

    roles: UserRoleListItem[] = [];

    async mounted() {
        this.fetchAllRoles();
    }

    async fetchAllRoles() {
        this.roles = await getAllRoles();
    }
}
</script>
