<template>
    <v-navigation-drawer v-model="drawer" app permanent expand-on-hover clipped>
        <v-list dense nav>
            <v-list-item v-for="item in items" :key="item.title" link :to="{ name: item.route }">
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
        { title: "Admin", icon: "mdi-cog", route: "AdminDashboard" },
        { title: "Clinical Review", icon: "mdi-eye", route: "ClinicalReview" },
    ];
    drawer = true;

    created(): void {
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
