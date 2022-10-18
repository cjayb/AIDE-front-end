<template>
    <v-app-bar app color="#fff" clipped-left class="elevation-1">
        <div class="mr-4" data-cy="logo">
            <v-img
                @click="$router.push({ name: 'Home' })"
                class="mx-auto"
                src="@/assets/nhs.png"
                height="40px"
                width="97px"
            />
        </div>
        <div class="mr-4" data-cy="logo">
            <v-img
                @click="$router.push({ name: 'Home' })"
                class="mx-auto"
                src="@/assets/AI-centre.png"
                height="64px"
                width="97px"
            />
        </div>

        <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon disabled aria-label="notification bell">
            <v-icon>mdi-bell</v-icon>
        </v-btn>

        <v-menu bottom left offset-y offset-overflow :nudge-left="80">
            <template v-slot:activator="{ on, attrs }">
                <v-btn text v-on="on" aria-label="log out button">
                    <v-icon v-bind="attrs" class="mr-2">mdi-account-circle </v-icon>
                    {{ name }}
                    <v-icon class="ml-2">mdi-chevron-down</v-icon>
                </v-btn>
            </template>
            <v-list>
                <v-list dense>
                    <v-list-item-group color="primary">
                        <v-list-item @click="logout()">
                            <v-list-item-icon>
                                <v-icon>mdi-logout</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>Logout</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-list>
        </v-menu>
    </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
import { Watch } from "vue-property-decorator";
import Component from "vue-class-component";

@Component
export default class AppHeader extends Vue {
    // Class properties will be component data
    pageTitle = "Page Title";
    name = "";

    // Methods will be component methods
    mounted(): void {
        this.updatePageTitle();
        if (Vue.prototype.$keycloak.authenticated) {
            this.name = Vue.prototype.$keycloak.tokenParsed?.name;
        } else {
            this.name = "Unauthenticated User";
        }
    }

    updatePageTitle(): void {
        switch (this.$route.name) {
            case "AdminHealthDashboard":
                this.pageTitle = "Admin Health Dashboard";
                break;

            case "AdminPayloadDashboard":
                this.pageTitle = "Admin Payload Dashboard";
                break;

            case "ClinicalReview":
                this.pageTitle = "Model outputs for clinical review";
                break;

            case "ClinicalReviewViewer":
                this.pageTitle = "Model outputs for clinical review";
                break;

            case "ApplicationRepositoryList":
                this.pageTitle = "Application Repository";
                break;

            case "ApplicationRepositoryDetail":
                this.pageTitle = "Application Repository";
                break;

            case "UserManagement":
                this.pageTitle = "User Management";
                break;

            case "Workflows":
                this.pageTitle = "Workflow Management";
                break;

            case "WorkflowEditor":
                this.pageTitle = "Workflow Manager";
                break;

            case "AdminExportConfiguration":
                this.pageTitle = "Export Destination Configuration";
                break;
        }
    }

    logout(): void {
        Vue.prototype.$keycloak.logoutFn({ redirectUri: `${window.location.origin}/#/` });
    }

    @Watch("$route", { immediate: true, deep: true })
    onUrlChange(): void {
        this.updatePageTitle();
    }
}
</script>
