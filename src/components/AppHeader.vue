<template>
    <v-app-bar app color="#fff" clipped-left class="elevation-1">
        <div class="mr-4">
            <v-img class="mx-auto" src="@/assets/AI-centre.png" height="64px" width="97px" />
        </div>

        <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon disabled>
            <v-icon>mdi-bell</v-icon>
        </v-btn>

        <v-menu bottom left offset-y offset-overflow :nudge-left="80">
            <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-on="on">
                    <v-icon v-bind="attrs">mdi-account-circle</v-icon>
                </v-btn>
            </template>
            <v-list>
                <v-list dense>
                    <v-list-item-group v-model="selectedItem" color="primary">
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
import { EventBus } from "@/event-bus";

@Component
export default class AppHeader extends Vue {
    // Class properties will be component data
    pageTitle = "Page Title";

    // Methods will be component methods
    created(): void {
        this.updatePageTitle();
    }

    updatePageTitle(): void {
        if (this.$route.name == "AdminDashboard") {
            this.pageTitle = "Admin Dashboard";
        }
        if (this.$route.name == "ClinicalReview") {
            this.pageTitle = "Model outputs for clinical review";
        }
        if (this.$route.name == "ClinicalReviewViewer") {
            this.pageTitle = "Model outputs for clinical review";
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
