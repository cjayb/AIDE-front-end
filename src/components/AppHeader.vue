<template>
    <v-app-bar app color="#fff" clipped-left class="elevation-1">
        <div class="mr-4">
            <v-img class="mx-auto" src="@/assets/AI-centre.png" height="64px" width="97px" />
        </div>

        <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
            <v-icon>mdi-bell</v-icon>
        </v-btn>
        <v-btn icon>
            <v-icon>mdi-account-circle</v-icon>
        </v-btn>
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

    @Watch("$route", { immediate: true, deep: true })
    onUrlChange(): void {
        this.updatePageTitle();
    }
}
</script>
