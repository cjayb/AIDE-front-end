<template>
    <v-container>
        <v-row>
            <v-col :key="n" cols="12" sm="12">
                <v-data-table
                    :headers="modelsHeaders"
                    :items="models"
                    :single-expand="singleExpand"
                    :expanded.sync="expanded"
                    :hide-default-footer="true"
                    :search="search"
                    item-key="modelName"
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
    items = ["Dicom", "Pdf", "Other"];
    dialog = false;
    dialog2 = false;
    dialog3 = false;
    modelsHeaders = [
        {
            text: "Model Name",
            align: "start",
            sortable: false,
            value: "modelName",
        },
        {
            text: "Executions",
            value: "executions",
        },
        {
            text: "Failures",
            value: "failures",
        },
        {
            text: "Success Rate",
            value: "successRate",
        },
        {
            text: "Clinical Acceptance",
            value: "clinicalAcceptance",
        },
        {
            text: "Awaiting Processing",
            value: "awaitingProcessing",
        },
        {
            text: "avg. Time Spent On Queue",
            value: "avgOnQueue",
        },
        {
            text: "Avg. Duration",
            value: "avgDuration",
        },
        {
            text: "Avg. Turnaround",
            value: "avgTurnaround",
        },
        {
            text: "",
            value: "data-table-expand",
        },
    ];
    executionsHeaders = [
        {
            text: "Date",
            align: "start",
            sortable: false,
            value: "date",
        },
        {
            text: "Outputs",
            value: "outputs",
        },
        {
            text: "Status",
            value: "status",
        },
        {
            text: "Duration",
            value: "duration",
        },
        {
            text: "Turnaround",
            value: "turnaround",
        },
        {
            text: "Actions",
            value: "actions",
        },
    ];
    models = [
        {
            modelName: "Model 1",
            executions: 100,
            failures: 10,
            successRate: "90%",
            clinicalAcceptance: "70%",
            awaitingProcessing: "100",
            avgOnQueue: "5 minutes",
            avgDuration: "120 seconds",
            avgTurnaround: "5 hours",
            execution: [
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Success",
                    duration: "12 seconds",
                    turnaround: "32 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Failure",
                    duration: "79 seconds",
                    turnaround: "23 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Success",
                    duration: "4 seconds",
                    turnaround: "23 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Success",
                    duration: "54 seconds",
                    turnaround: "23 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Failure",
                    duration: "56 seconds",
                    turnaround: "76 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Success",
                    duration: "45 seconds",
                    turnaround: "46 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Success",
                    duration: "89 seconds",
                    turnaround: "89 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Failure",
                    duration: "1 seconds",
                    turnaround: "5 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Success",
                    duration: "15 seconds",
                    turnaround: "45 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Success",
                    duration: "45 seconds",
                    turnaround: "63 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Failure",
                    duration: "12 seconds",
                    turnaround: "45 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Success",
                    duration: "45 seconds",
                    turnaround: "13 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Success",
                    duration: "16 seconds",
                    turnaround: "16 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Failure",
                    duration: "15 seconds",
                    turnaround: "13 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Success",
                    duration: "14 seconds",
                    turnaround: "96 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Failure",
                    duration: "14 seconds",
                    turnaround: "14 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Success",
                    duration: "19 seconds",
                    turnaround: "13 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Success",
                    duration: "97 seconds",
                    turnaround: "97 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Failure",
                    duration: "7 seconds",
                    turnaround: "7 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Success",
                    duration: "2 seconds",
                    turnaround: "2 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Failure",
                    duration: "1 seconds",
                    turnaround: "1 minutes",
                    actions: "View Log, View Pipeline",
                },
            ],
        },
        {
            modelName: "Model 2",
            executions: 100,
            failures: 20,
            successRate: "80%",
            clinicalAcceptance: "90%",
            awaitingProcessing: "1",
            avgOnQueue: "1 minutes",
            avgDuration: "240 seconds",
            avgTurnaround: "1 hours",
            execution: [
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Success",
                    duration: "5 seconds",
                    turnaround: "10 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Success",
                    duration: "69 seconds",
                    turnaround: "1 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Success",
                    duration: "7 seconds",
                    turnaround: "96 minutes",
                    actions: "View Log, View Pipeline",
                },
            ],
        },
        {
            modelName: "Model 3",
            executions: 100,
            failures: 30,
            successRate: "70%",
            clinicalAcceptance: "80%",
            awaitingProcessing: "10",
            avgOnQueue: "2 minutes",
            avgDuration: "24 seconds",
            avgTurnaround: "2 hours",
            execution: [
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Success",
                    duration: "5 seconds",
                    turnaround: "10 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Success",
                    duration: "69 seconds",
                    turnaround: "1 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Success",
                    duration: "7 seconds",
                    turnaround: "96 minutes",
                    actions: "View Log, View Pipeline",
                },
            ],
        },
        {
            modelName: "Model 4",
            executions: 200,
            failures: 20,
            successRate: "90%",
            clinicalAcceptance: "90%",
            awaitingProcessing: "1000",
            avgOnQueue: "10 minutes",
            avgDuration: "20 seconds",
            avgTurnaround: "1 hours",
            execution: [
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Success",
                    duration: "5 seconds",
                    turnaround: "10 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Success",
                    duration: "69 seconds",
                    turnaround: "1 minutes",
                    actions: "View Log, View Pipeline",
                },
                {
                    date: "10/06/2012 - 1:14.36",
                    outputs: "outputs",
                    status: "Success",
                    duration: "7 seconds",
                    turnaround: "96 minutes",
                    actions: "View Log, View Pipeline",
                },
            ],
        },
    ];

    // Methods will be component methods
    getStatus(status: string): string {
        if (status == "Failure") return "red";
        else return "green";
    }
}
</script>
