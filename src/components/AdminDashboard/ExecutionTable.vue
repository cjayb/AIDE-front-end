<template>
    <v-container>
        <v-data-table
            :headers="executionsHeaders"
            :items="item.execution"
            item-key="name"
            class="elevation-0"
            dense
        >
            <template v-slot:item.outputs>
                <v-btn @click.stop="dialog = true" x-small>View Output</v-btn>
            </template>

            <template v-slot:item.status="{ item }">
                <v-chip :color="getStatus(item.status)" dark outlined small>
                    {{ item.status }}
                </v-chip>
            </template>

            <template v-slot:item.actions>
                <v-btn @click.stop="dialog2 = true" x-small>View Logs</v-btn>
                <v-btn @click.stop="dialog3 = true" x-small>View Pipeline</v-btn>
            </template>
        </v-data-table>

        <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar color="#61366e" dark>
                    <v-btn icon dark @click="dialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>View output i.e Dicom, Pdf etc.</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn dark text @click="dialog = false"> Close </v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <DicomViewer />
            </v-card>
        </v-dialog>

        <v-dialog transition="dialog-bottom-transition" max-width="600" v-model="dialog2">
            <template v-slot:default="dialog2">
                <v-card>
                    <v-toolbar color="#61366e" dark>Log Viewer</v-toolbar>
                    <v-card-text>
                        <div>logs</div>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn text @click="dialog2.value = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>

        <v-dialog transition="dialog-bottom-transition" v-model="dialog3">
            <template v-slot:default="dialog3">
                <v-card>
                    <v-toolbar color="#61366e" dark>Pipeline Viewer</v-toolbar>
                    <!-- <v-card-text> -->
                    <v-stepper alt-labels class="mt-12">
                        <v-stepper-header>
                            <v-stepper-step step="1" complete>
                                Dicom Received
                                <small>Wed, 14 Jul 2021 11:15:59 +0000</small>
                            </v-stepper-step>
                            <v-divider></v-divider>

                            <v-stepper-step step="2" complete>
                                Orchestration Engine
                                <small>Wed, 14 Jul 2021 12:15:59 +0000</small>
                            </v-stepper-step>
                            <v-divider></v-divider>

                            <v-stepper-step step="3" complete>
                                Model A
                                <small>Start: Wed, 14 Jul 2021 12:15:59 +0000</small>
                                <small>End: Wed, 14 Jul 2021 13:15:59 +0000</small>
                            </v-stepper-step>
                            <v-divider></v-divider>

                            <v-stepper-step step="4" complete>
                                Orchestration Engine
                                <small>Wed, 14 Jul 2021 12:15:59 +0000</small>
                            </v-stepper-step>
                            <v-divider></v-divider>

                            <v-stepper-step step="5" complete>
                                Model B
                                <small>Start: Wed, 14 Jul 2021 12:15:59 +0000</small>
                                <small>End: Wed, 14 Jul 2021 13:15:59 +0000</small>
                            </v-stepper-step>
                            <v-divider></v-divider>

                            <v-stepper-step step="6" complete>
                                Orchestration Engine
                                <small>Wed, 14 Jul 2021 12:15:59 +0000</small>
                            </v-stepper-step>
                            <v-divider></v-divider>

                            <v-stepper-step step="7" complete>
                                Model C
                                <small>Start: Wed, 14 Jul 2021 12:15:59 +0000</small>
                                <small>End: Wed, 14 Jul 2021 13:15:59 +0000</small>
                            </v-stepper-step>
                        </v-stepper-header>
                    </v-stepper>
                    <v-card-actions class="justify-end">
                        <v-btn text @click="dialog3.value = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import DicomViewer from "./DicomViewer.vue";

@Component({
    components: {
        DicomViewer,
    },
})
export default class ExecutionTable extends Vue {
    // Class properties will be component data

    @Prop() item!: any;

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
