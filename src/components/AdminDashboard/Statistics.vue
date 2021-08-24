<template>
    <v-container>
        <v-row>
            <!-- Model Statistics -->
            <v-col cols="4">
                <v-card class="pa-3">
                    <v-card-title>Execution Summary</v-card-title>
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
                                {{ getSuccessRate(executionsStats) }}
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>

            <!-- Input -->
            <v-col cols="4">
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
            <!-- <v-col cols="3">
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
            </v-col> -->

            <!-- Model Status-->
            <v-col cols="4">
                <v-card class="pa-3">
                    <v-card-title>Model Status</v-card-title>
                    <v-list class="transparent">
                        <v-list-item>
                            <v-list-item-title>Active</v-list-item-title>
                            <v-list-item-subtitle class="text-right">
                                {{ active }}
                            </v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-title>Stale</v-list-item-title>
                            <v-list-item-subtitle class="text-right">
                                {{ stale }}
                            </v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-title>Inactive</v-list-item-title>
                            <v-list-item-subtitle class="text-right">
                                {{ inactive }}
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { getModels } from "@/api/ModelService";
import Vue from "vue";
import Component from "vue-class-component";

import { getExecutionStats, getModelExecutionStats } from "../../api/ExecutionService";
import { getQueueMetrics } from "../../api/QueueService";

@Component
export default class Dashboard extends Vue {
    // Class properties will be component data

    executionsStats = {};
    inputQueue = {};
    outputQueue = {};
    pacsQueue = {};
    models: any = [];
    stale = 0;
    counter = 0;
    active = 0;
    inactive = 0;

    async created(): Promise<void> {
        this.executionsStats = await getExecutionStats(this.$store.state.days);
        this.inputQueue = await getQueueMetrics("input");
        this.models = await getModels();

        const active_models = this.models.filter((model: any) => model.active);
        this.inactive = this.models.filter((model: any) => !model.active).length;
        const promises = await active_models.map(async (model: any) => {
            const model_executions = await getModelExecutionStats(
                "1",
                `${model.model_name}%2F${model.model_version}`,
            );
            if (model_executions.executions === 0) {
                this.counter = this.counter + 1;
            }
        });

        await Promise.all(promises);

        this.stale = this.counter;

        this.active = active_models.length - this.stale;

        // this.outputQueue = await getQueueMetrics("output");
        // this.pacsQueue = await getQueueMetrics("pacs");
    }

    getSuccessRate(stats: any): string {
        let result = (100 * (stats.executions - stats.failures)) / stats.executions;
        return result.toFixed(0) + " %";
    }
}
</script>
