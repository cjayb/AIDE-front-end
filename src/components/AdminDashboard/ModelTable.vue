<template>
    <v-container>
        <v-row>
            <v-col cols="12" sm="12">
                <v-data-table
                    :headers="modelsHeaders"
                    :items="models"
                    :single-expand="singleExpand"
                    :expanded.sync="expanded"
                    :hide-default-footer="true"
                    :disable-pagination="true"
                    :search="search"
                    :sort-by="['model_name']"
                    item-key="id"
                    show-expand
                    class="elevation-1"
                    :loading="loading"
                    @click:row="expandRow"
                    loading-text="Loading... Please wait"
                    data-cy="model-table"
                >
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title>Models</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-text-field
                                v-model="search"
                                append-icon="mdi-magnify"
                                label="Search"
                                single-line
                                hide-details
                                data-cy="model-search"
                            ></v-text-field>
                        </v-toolbar>
                    </template>
                    <!-- eslint-disable-next-line  -->
                    <template v-slot:item.successRate="{ item }">
                        {{ getSuccessRate(item.stats) }}
                    </template>
                    <!-- eslint-disable-next-line  -->
                    <template v-slot:item.duration="{ item }">
                        {{ getTimeFormat(item.stats.average_execution_time) }}
                    </template>
                    <!-- eslint-disable-next-line  -->
                    <template v-slot:item.turnaround="{ item }">
                        {{ getTimeFormat(item.stats.average_turnaround_time) }}
                    </template>
                    <template v-slot:expanded-item="{ headers, item }">
                        <td :colspan="headers.length" class="elevation-0 pa-0">
                            <ExecutionTable :model="item" :key="item" />
                            <LogsDialog />
                            <PipelineDialog />
                        </td>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ExecutionTable from "./ExecutionTable.vue";
import LogsDialog from "../AdminDashboard/LogsDialog.vue";
import PipelineDialog from "../AdminDashboard/PipelineDialog.vue";
import { getModels } from "../../api/ModelService";
import { getModelExecutionStats } from "../../api/ExecutionService";
import { Model } from "@/models/Model";
import { ExecutionStat } from "@/models/ExecutionStat";
import { DataTableHeader } from "vuetify";

@Component({
    components: {
        ExecutionTable,
        LogsDialog,
        PipelineDialog,
    },
})
export default class Models extends Vue {
    // Class properties will be component data
    expanded: Array<any> = [];
    singleExpand = true;
    search = "";
    loading = true;
    modelsHeaders: DataTableHeader[] = [
        {
            text: "Model Name",
            align: "start",
            sortable: false,
            value: "model_name",
        },
        {
            text: "Executions",
            value: "stats.executions",
            sortable: true,
        },
        {
            text: "Failures",
            value: "stats.failures",
        },
        {
            text: "Errors",
            value: "stats.errors",
        },
        {
            text: "Success Rate",
            value: "successRate",
            sortable: false,
        },
        {
            text: "Avg. Duration (Minutes)",
            value: "duration",
            sortable: false,
        },
        {
            text: "Avg. Turnaround (Minutes)",
            value: "turnaround",
            sortable: false,
        },
        {
            text: "",
            value: "data-table-expand",
        },
    ];
    models: Array<Model> = [];

    async created(): Promise<void> {
        this.loading = true;

        let tempModels = await getModels();

        for (const model of tempModels) {
            let failed = false;
            await getModelExecutionStats("1000", model.model_name + "%2F" + model.model_version)
                .then((stat) => {
                    model.stats = stat;
                    model.stats.executions =
                        model.stats.executions + model.stats.failures + model.stats.errors;
                })
                .catch((err) => {
                    this.loading = false;
                    failed = true;
                });
            if (failed) break;
        }

        this.models = tempModels;

        this.loading = false;
    }

    // Methods will be component methods
    getSuccessRate(stats: ExecutionStat): string {
        let result = (100 * (stats.executions - stats.failures)) / stats.executions;
        if (Number.isNaN(result)) {
            return 0 + " %";
        } else {
            return result.toFixed(0) + " %";
        }
    }

    getTimeFormat(time: number): number {
        var minutes = Math.floor(time / 60);
        return minutes;
    }

    expandRow(value: any) {
        if (this.expanded.includes(value)) {
            this.expanded = [];
        } else {
            this.expanded = [value];
        }
    }
}
</script>
