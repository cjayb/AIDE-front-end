<template>
    <v-app-bar app color="#fff">
        <!-- <v-app-bar-nav-icon @click="toggleSidebar()"></v-app-bar-nav-icon> -->

        <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon>
            <v-icon>mdi-account-circle</v-icon>
        </v-btn>

        <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
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
    drawer = true;
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
            this.pageTitle = "Clinical Review";
        }
        if (this.$route.name == "ClinicalReviewViewer") {
            this.pageTitle = "Clinical Review";
        }
    }
    toggleSidebar(): void {
        this.drawer = !this.drawer;
        EventBus.$emit("toggleSidebar", this.drawer);
    }
    @Watch("$route", { immediate: true, deep: true })
    onUrlChange(): void {
        this.updatePageTitle();
    }
}
</script>
