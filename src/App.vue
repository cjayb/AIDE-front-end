<template>
    <v-app>
        <!-- Sidebar -->
        <AppSidebar />

        <!-- TopBar -->
        <AppHeader />

        <!-- Main Content -->
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import AppHeader from "./components/AppHeader.vue";
import AppSidebar from "./components/AppSidebar.vue";

export default Vue.extend({
    name: "App",
    data: () => ({
        drawer: null,
        items: [
            { title: "Menu Item 1", icon: "mdi-view-dashboard" },
            { title: "Menu Item 2", icon: "mdi-image" },
            { title: "Menu Item 3", icon: "mdi-help-box" },
        ],
    }),
    components: {
        AppHeader,
        AppSidebar,
    },
});
</script>

<style>
.row {
    margin: -12px !important;
}
</style>
