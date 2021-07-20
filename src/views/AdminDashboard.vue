<template>
    <v-container>
        <!-- Statistics -->
        <v-row>
            <Statistics />
        </v-row>
        <!-- Models -->
        <v-row>
            <ModelTable />
        </v-row>
        <v-row>
            <DicomViewer />
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Statistics from "../components/AdminDashboard/Statistics.vue";
import ModelTable from "../components/AdminDashboard/ModelTable.vue";

export default Vue.extend({
    name: "AdminDashboard",

    components: {
        Statistics,
        ModelTable,
    },
});
</script>
