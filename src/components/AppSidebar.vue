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
        { title: "Admin", icon: "mdi-cog", route: "AdminDashboard", role: "admin" },
        { title: "Clinical Review", icon: "mdi-eye", route: "ClinicalReview", role: "clinician" },
    ];
    roles: any = [];
    drawer = true;

    created(): void {
        this.roles = Vue.$keycloak.resourceAccess["aide-app"].roles;
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
