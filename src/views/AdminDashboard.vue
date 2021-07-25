<template>
    <v-container style="max-width: 100%">
        <!-- Statistics -->
        <v-row class="text-right">
            <v-container>
                <v-col class="text-right">
                    <v-btn text disabled> Show </v-btn>
                    <v-btn elevation="2" rounded color="#61366e" dark>24 Hours</v-btn>
                    <v-btn elevation="2" rounded>Weekly</v-btn>
                    <v-btn elevation="2" rounded>Monthly</v-btn>
                </v-col>
            </v-container>
        </v-row>
        <!-- Statistics -->
        <v-row>
            <Statistics />
        </v-row>
        <v-row class="text-right">
            <v-container>
                <v-col class="text-right">
                    <v-btn text disabled> View </v-btn>
                    <v-btn elevation="2" rounded color="#61366e" dark>Execution Run Stats</v-btn>
                    <v-btn elevation="2" rounded>Performance</v-btn>
                </v-col>
            </v-container>
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
