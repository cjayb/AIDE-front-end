<template>
    <v-container style="max-width: 100%">
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
import Component from "vue-class-component";
import Statistics from "../components/AdminDashboard/Statistics.vue";
import ModelTable from "../components/AdminDashboard/ModelTable.vue";

@Component({
    components: {
        Statistics,
        ModelTable,
    },
})
export default class AdminDashboard extends Vue {}
</script>
