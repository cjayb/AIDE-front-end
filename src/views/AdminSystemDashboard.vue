<template>
    <v-container fluid>
        <!-- Overview -->
        <!-- <DashboardOverview /> -->

        <!-- <v-divider /> -->

        <!-- Issues -->
        <IssuesTable />

        <!-- <v-divider /> -->

        <!-- Models -->
        <!-- <ModelStatistics /> -->
    </v-container>
</template>

<script lang="ts">
import DashboardOverview from "../components/AdminHealthDashboard/DashboardOverview.vue";
import IssuesTable from "@/components/AdminHealthDashboard/IssuesTable.vue";
import ModelStatistics from "@/components/AdminHealthDashboard/ModelStatistics.vue";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
    metaInfo: {
        title: "System Dashboard",
    },
    components: {
        DashboardOverview,
        IssuesTable,
        ModelStatistics,
    },
})
export default class AdminHealthDashboard extends Vue {}
</script>
