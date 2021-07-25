<template>
    <v-container>
        <v-row>
            <!-- Model Statistics -->
            <v-col cols="3">
                <v-card class="pa-3">
                    <v-card-title>Overall Model Statistics</v-card-title>
                    <v-list class="transparent">
                        <v-list-item>
                            <v-list-item-title>Model Executions</v-list-item-title>
                            <v-list-item-subtitle class="text-right">
                                {{ executionsStats.executions }}
                            </v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-title>Execution Failures</v-list-item-title>
                            <v-list-item-subtitle class="text-right">
                                {{ executionsStats.failures }}
                            </v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-title>Success Rate</v-list-item-title>
                            <v-list-item-subtitle class="text-right">
                                {{ executionsStats.executions }}
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>

            <!-- Input -->
            <v-col cols="3">
                <v-card class="pa-3">
                    <v-card-title>Input Queue</v-card-title>
                    <v-list class="transparent">
                        <v-list-item>
                            <v-list-item-title>Backlog</v-list-item-title>
                            <v-list-item-subtitle class="text-right">
                                {{ inputQueue.message_count }}
                            </v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-title>Added to Queue</v-list-item-title>
                            <v-list-item-subtitle class="text-right">
                                {{ inputQueue.delivered }}
                            </v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-title>Processed</v-list-item-title>
                            <v-list-item-subtitle class="text-right">
                                {{ inputQueue.published }}
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>

            <!-- Output -->
            <v-col cols="3">
                <v-card class="pa-3">
                    <v-card-title>Output Queue</v-card-title>
                    <v-list class="transparent">
                        <v-list-item>
                            <v-list-item-title>Backlog</v-list-item-title>
                            <v-list-item-subtitle class="text-right">
                                {{ outputQueue.message_count }}
                            </v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-title>Added to Queue</v-list-item-title>
                            <v-list-item-subtitle class="text-right">
                                {{ outputQueue.delivered }}
                            </v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-title>Processed</v-list-item-title>
                            <v-list-item-subtitle class="text-right">
                                {{ outputQueue.published }}
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>

            <!-- Model Status-->
            <v-col cols="3">
                <v-card class="pa-3">
                    <v-card-title>Model Status</v-card-title>
                    <v-list class="transparent">
                        <v-list-item>
                            <v-list-item-title>Active</v-list-item-title>
                            <v-list-item-subtitle class="text-right"> 1 </v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-title>Stale</v-list-item-title>
                            <v-list-item-subtitle class="text-right"> 0 </v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-title>Inactive</v-list-item-title>
                            <v-list-item-subtitle class="text-right"> 0 </v-list-item-subtitle>
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

        this.queues.push();

        // this.pacsQueue = await getQueueMetrics("pacs");
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
            name: "Model Status",
            stats: [
                { label: "Active", total: "1" },
                { label: "Stale", total: "0" },
                { label: "Inactive", total: "0" },
            ],
        },
    ];
    // Methods will be component methods
}
</script>
