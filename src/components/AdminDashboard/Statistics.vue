<template>
    <v-container>
        <v-row>
            <v-col cols="3.5" v-for="item in queues" :key="item.label">
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

import { getExecutionStats } from "../../api/ExecutionService";
import { getQueueMetrics } from "../../api/QueueService";

@Component
export default class Dashboard extends Vue {
    // Class properties will be component data

    executionsStats = {};
    inputQueue = {};
    outputQueue = {};
    pacsQueue = {};

    async created(): Promise<void> {
        this.executionsStats = await getExecutionStats("100");
        this.inputQueue = await getQueueMetrics("input");
        this.outputQueue = await getQueueMetrics("output");
        this.pacsQueue = await getQueueMetrics("pacs");
    }

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
                { label: "Backlog", total: "100" },
                { label: "Added to Queue", total: "100" },
                { label: "Processed", total: "100" },
            ],
        },
        {
            name: "Output Queue",
            stats: [
                { label: "Backlog", total: "100" },
                { label: "Added to Queue", total: "100" },
                { label: "Processed", total: "100" },
            ],
        },
        {
            name: "PACS Output Queue",
            stats: [
                { label: "Backlog", total: "100" },
                { label: "Added to Queue", total: "100" },
                { label: "Processed", total: "100" },
            ],
        },
        {
            name: "Model Status",
            stats: [
                { label: "Active", total: "2" },
                { label: "Stale", total: "0" },
                { label: "Inactive", total: "1" },
            ],
        },
    ];
    // Methods will be component methods
}
</script>
