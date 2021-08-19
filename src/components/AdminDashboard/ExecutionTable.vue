<template>
    <v-container>
        <v-data-table
            :headers="executionsHeaders"
            :items="executions"
            item-key="name"
            class="elevation-0 pa-0 ma-0"
            :loading="loading"
            loading-text="Loading... Please wait"
        >
            <!-- eslint-disable-next-line  -->
            <template v-slot:item.date="{ item }">
                {{ item.timestamp.received_at | formatDate }}
            </template>
            <!-- eslint-disable-next-line  -->
            <template v-slot:item.output="{ item }">
                <v-btn @click.stop="dialog = true" x-small disabled>View Output</v-btn>
            </template>
            <!-- eslint-disable-next-line  -->
            <template v-slot:item.status="{ item }">
                <v-chip :color="getStatusColor(item.result)" dark outlined small>
                    {{ getStatus(item.result) }}
                </v-chip>
            </template>
            <!-- eslint-disable-next-line  -->
            <template v-slot:item.duration="{ item }">
                {{
                    getTimeDifference(
                        item.timestamp.inference_started,
                        item.timestamp.inference_finished,
                    )
                }}
            </template>
            <!-- eslint-disable-next-line  -->
            <template v-slot:item.turnaround="{ item }">
                {{
                    getTimeDifference(item.timestamp.received_at, item.timestamp.inference_finished)
                }}
            </template>
            <!-- eslint-disable-next-line  -->
            <template v-slot:item.actions="{ item }">
                <v-btn @click.stop="openLogsDialog(item.model.execution_uid)" x-small
                    >View Logs</v-btn
                >
                <v-btn @click.stop="openPipelineDialog(item.correlation_id)" x-small
                    >View Pipeline</v-btn
                >
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

        <LogsDialog :dialog2="dialog2" />
        <PipelineDialog :dialog3="dialog3" />
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { EventBus } from "@/event-bus";
import DicomViewer from "../Shared/DicomViewer.vue";
import LogsDialog from "../AdminDashboard/LogsDialog.vue";
import PipelineDialog from "../AdminDashboard/PipelineDialog.vue";
import { getAllModelExecutions } from "../../api/ExecutionService";

@Component({
    components: {
        DicomViewer,
        LogsDialog,
        PipelineDialog,
    },
})
export default class ExecutionTable extends Vue {
    // Class properties will be component data
    @Prop() item!: any;
    loading = true;
    executions = [];
    dialog = false;
    executionsHeaders = [
        {
            text: "Date",
            align: "start",
            sortable: false,
            value: "date",
        },
        {
            text: "Outputs",
            sortable: false,
            value: "output",
        },
        {
            text: "Status",
            sortable: false,
            value: "status",
        },
        {
            text: "Duration (Minutes)",
            value: "duration",
            sortable: false,
        },
        {
            text: "Turnaround (Minutes)",
            value: "turnaround",
            sortable: false,
        },
        {
            text: "Actions",
            sortable: false,
            value: "actions",
        },
    ];

    async created(): Promise<void> {
        this.loading = true;
        this.executions = await getAllModelExecutions(
            this.item.model_name + "%2F" + this.item.model_version,
            "1",
            "10",
        );
        this.loading = false;
    }

    // Methods will be component methods
    getStatus(result: any): string {
        if (result.status == "success") {
            return "Success";
        }

        if (result.status == "error") {
            return "Error";
        }

        if (result.status == "failed") {
            return "Failed";
        }

        return "Unknown";
    }

    getStatusColor(result: any): string {
        if (result.status == "success") {
            return "green";
        }

        if (result.status == "error") {
            return "amber";
        }

        if (result.status == "failed") {
            return "red";
        }

        return "red";
    }

    getTimeDifference(start: string, end: string): number {
        var diff = Math.abs(new Date(start).getTime() - new Date(end).getTime());
        var minutes = Math.floor(diff / 1000 / 60);
        return minutes;
    }

    openLogsDialog(execution_uid: string): void {
        EventBus.$emit("openLogsDialog", true, execution_uid);
    }

    openPipelineDialog(collaboration_uid: string): void {
        EventBus.$emit("openPipelineDialog", true, collaboration_uid);
    }
}
</script>
