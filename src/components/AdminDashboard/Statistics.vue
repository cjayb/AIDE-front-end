<template>
    <v-container>
        <v-row>
            <v-col cols="12" sm="3" v-for="item in queues" :key="item.label">
                <v-card class="pa-3">
                    <v-card-title>{{ item.name }}</v-card-title>
                    <v-list class="transparent">
                        <v-list-item v-for="item in item.stats" :key="item.label">
                            <v-list-item-title>{{ item.label }}</v-list-item-title>

                            <v-list-item-subtitle class="text-right">
                                {{ item.total }}
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class Dashboard extends Vue {
    // Class properties will be component data
    queues = [
        {
            name: "Overall Model Statistics",
            stats: [
                { label: "Model Executions", total: "100" },
                { label: "Execution Failures", total: "10" },
                { label: "Success Rate", total: "90%" },
            ],
        },
        {
            name: "Input Queue",
            stats: [
                { label: "Total awaiting processing", total: "100" },
                { label: "Total inputs processed", total: "100" },
                { label: "avg. time spent on queue", total: "5 minutes" },
            ],
        },
        {
            name: "Output Queue",
            stats: [
                { label: "Total awaiting processing", total: "100" },
                { label: "Total outputs processed", total: "100" },
                { label: "avg. time spent on queue", total: "5 minutes" },
            ],
        },
        {
            name: "PACS Output Queue",
            stats: [
                { label: "Total awaiting processing", total: "100" },
                { label: "Total outputs processed", total: "100" },
                { label: "avg. time spent on queue", total: "5 minutes" },
            ],
        },
    ];
    // Methods will be component methods
}
</script>
