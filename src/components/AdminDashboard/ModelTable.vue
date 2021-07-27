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
                    :search="search"
                    item-key="model_name"
                    show-expand
                    class="elevation-1"
                    :loading="loading"
                    loading-text="Loading... Please wait"
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
                            ></v-text-field>
                        </v-toolbar>
                    </template>
                    <!-- eslint-disable-next-line  -->
                    <template v-slot:item.errors> 0 </template>
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
                            <ExecutionTable :item="item" :key="item" />
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
import { getModels } from "../../api/ModelService";
import { getModelExecutionStats } from "../../api/ExecutionService";

@Component({
    components: {
        ExecutionTable,
    },
})
export default class Models extends Vue {
    // Class properties will be component data
    expanded = [];
    singleExpand = true;
    search = "";
    loading = true;
    modelsHeaders = [
        {
            text: "Model Name",
            align: "start",
            sortable: false,
            value: "model_name",
        },
        {
            text: "Executions",
            value: "stats.executions",
        },
        {
            text: "Failures",
            value: "stats.failures",
        },
        {
            text: "Errors",
            value: "errors",
        },
        {
            text: "Success Rate",
            value: "successRate",
        },
        {
            text: "Avg. Duration",
            value: "duration",
        },
        {
            text: "Avg. Turnaround",
            value: "turnaround",
        },
        // {
        //     text: "Clinical Acceptance",
        //     value: "clinicalAcceptance",
        // },
        {
            text: "",
            value: "data-table-expand",
        },
    ];
    models: Array<any> = [];

    async created(): Promise<void> {
        this.loading = true;

        let tempModels = await getModels();

        tempModels.forEach(async (model: any) => {
            model.stats = await getModelExecutionStats(
                this.$store.state.days,
                model.model_name + "-" + model.model_version,
            );

            this.models.push(model);
        });

        this.loading = false;
    }

    // Methods will be component methods
    getStatus(status: string): string {
        if (status == "Failure") return "red";
        else return "green";
    }

    getSuccessRate(stats: any): string {
        let result = (100 * (stats.executions - stats.failures)) / stats.executions;
        return result.toFixed(0) + " %";
    }

    getTimeFormat(time: any): string {
        var minutes = Math.floor(time / 60);
        return minutes + " Minutes";
    }
}
</script>
