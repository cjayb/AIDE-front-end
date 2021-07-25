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

                    <template v-slot:item.errors> 0 </template>

                    <template v-slot:item.successRate="{ item }">
                        {{ getSuccessRate(item.stats) }}
                    </template>

                    <template v-slot:item.duration="{ item }">
                        {{ getTimeFormat(item.stats.average_execution_time) }}
                    </template>

                    <template v-slot:item.turnaround="{ item }">
                        {{ getTimeFormat(item.stats.average_turnaround_time) }}
                    </template>
                    <template v-slot:expanded-item="{ headers, item }">
                        <td :colspan="headers.length" class="elevation-0 pa-0">
                            <ExecutionTable :item="item" />
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
            text: "Warnings",
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
        let tempModels = await getModels();

        tempModels.forEach(async (model: any) => {
            model.stats = await getModelExecutionStats(
                "100",
                model.model_name + "-" + model.model_version,
            );

            this.models.push(model);
        });

        console.log(this.models);
    }

    // Methods will be component methods
    getStatus(status: string): string {
        if (status == "Failure") return "red";
        else return "green";
    }

    getSuccessRate(stats: any): string {
        let result = (stats.failures / stats.executions) * 100;
        return result.toFixed(0) + " %";
    }

    getTimeFormat(time: any): string {
        var minutes = Math.floor(time / 60);
        return minutes + " Minutes";
    }
}
</script>
