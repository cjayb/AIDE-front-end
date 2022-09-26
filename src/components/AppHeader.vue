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
    created(): void {
        this.updatePageTitle();
        if (Vue.$keycloak.authenticated) {
            this.name = Vue.$keycloak.tokenParsed?.name;
        } else {
            this.name = "Unauthenticated User";
        }
    }

    updatePageTitle(): void {
        if (this.$route.name == "AdminHealthDashboard") {
            this.pageTitle = "Admin Dashboard";
        }
        if (this.$route.name == "ClinicalReview") {
            this.pageTitle = "Model outputs for clinical review";
        }
        if (this.$route.name == "ClinicalReviewViewer") {
            this.pageTitle = "Model outputs for clinical review";
        }
        if (this.$route.name == "ApplicationRepositoryList") {
            this.pageTitle = "Application Repository";
        }
        if (this.$route.name == "ApplicationRepositoryDetail") {
            this.pageTitle = "Application Repository";
        }
        if (this.$route.name == "UserManagement") {
            this.pageTitle = "User Management";
        }
        if (this.$route.name == "Workflows") {
            this.pageTitle = "Workflow Management";
        }
    }

    logout(): void {
        Vue.$keycloak.logout({ redirectUri: `${window.location.origin}/#/` });
    }

    @Watch("$route", { immediate: true, deep: true })
    onUrlChange(): void {
        this.updatePageTitle();
    }
}
</script>
