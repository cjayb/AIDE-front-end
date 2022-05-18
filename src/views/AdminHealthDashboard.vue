<template>
    <v-container>
        <!-- Overview -->
        <DashboardOverview />

        <v-divider />

        <!-- Issues -->
        <v-row>
            <v-col cols="12">
                <h2 class="mx-auto">Issues</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-skeleton-loader class="mx-auto" type="table"></v-skeleton-loader>
            </v-col>
        </v-row>

        <!-- Models -->
        <v-row>
            <v-col cols="12">
                <h2 class="mx-auto">Models</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="8">
                <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
            </v-col>
            <v-col cols="4">
                <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DashboardOverview from "../components/AdminHealthDashboard/DashboardOverview.vue";

@Component({
    components: {
        DashboardOverview,
    },
})
export default class AdminHealthDashboard extends Vue {
    // Declared as component data
}
</script>
