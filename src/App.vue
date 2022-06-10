<template>
    <v-app>
        <!-- Sidebar -->
        <AppSidebar />

        <!-- TopBar -->
        <AppHeader />

        <!-- Main Content -->
        <v-main style="padding: 64px 0px 0px 55px">
            <transition name="fade" mode="out-in">
                <router-view />
            </transition>
        </v-main>
        <LogsDialog />
    </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import AppHeader from "./components/AppHeader.vue";
import AppSidebar from "./components/AppSidebar.vue";
import LogsDialog from "./components/Shared/LogsDialog.vue";

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
        LogsDialog,
    },
});
</script>

<style>
html {
    overflow: auto;
    min-width: 1000px;
}

.section-title {
    font-family: "Bai Jamjuree", sans-serif !important;
    font-weight: 700;
    font-size: 24px;
    line-height: 32px;
}

h1 {
    font-family: "Bai Jamjuree", sans-serif !important;
    font-weight: 700;
    font-size: 30px;
    line-height: 36px;
    color: #000;
}

h2 {
    font-family: "Open Sans", sans-serif !important;
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    color: #000;
}

.no-uppercase {
    text-transform: unset !important;
    letter-spacing: normal;
}

/* .row {
    margin: -12px !important;
} */

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* width */
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

/* Track */
::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #61366e;
    border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #5f2e6e;
}
</style>
