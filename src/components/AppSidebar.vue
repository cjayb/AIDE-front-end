<template>
    <v-navigation-drawer v-model="drawer" app permanent expand-on-hover clipped mini-variant>
        <v-list dense nav>
            <v-list-item
                v-for="item in items"
                :key="item.title"
                :to="{ name: item.route }"
                :data-cy="item.datacy"
            >
                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";

@Component
export default class AppSidebar extends Vue {
    // Declared as component data
    items = [
        {
            title: "Health Dashboard",
            icon: "mdi-cog",
            route: "AdminHealthDashboard",
            role: "admin",
            datacy: "admin-button",
        },
        {
            title: "Payload Dashboard",
            icon: "mdi-family-tree",
            route: "AdminPayloadDashboard",
            role: "admin",
            datacy: "admin-payload-button",
        },
        {
            title: "Clinical Review",
            icon: "mdi-eye",
            route: "ClinicalReview",
            role: "clinician",
            datacy: "clinician-button",
        },
        {
            title: "Application Repository",
            icon: "mdi-storefront",
            route: "ApplicationRepositoryList",
            role: "deployer",
            datacy: "app-store-button",
        },
        {
            title: "Export Destinations",
            icon: "mdi-application-export",
            route: "AdminExportConfiguration",
            role: "admin",
            datacy: "export-destinations-button",
        },
        {
            title: "User Management",
            icon: "mdi-account",
            route: "UserManagement",
            role: "admin",
            datacy: "user-management-button",
        },
        {
            title: "Workflows",
            icon: "mdi-file-tree",
            route: "Workflows",
            role: "admin",
            datacy: "workflows-button",
        },
    ];
    roles: string[] = [];
    drawer = false;

    created(): void {
        this.roles = Vue.$keycloak.resourceAccess!["aide-app"].roles;
        this.items = this.items.filter((item) => this.roles.includes(item.role));

        EventBus.$on("toggleSidebar", (drawer: boolean) => {
            this.drawer = drawer;
        });
    }
}
</script>

<style scoped>
.v-list-item--active {
    background-color: #61366e;
    color: #fff !important;
}
</style>
