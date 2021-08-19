<template>
    <v-container>
        <v-data-table
            :headers="executionsHeaders"
            :items="executions"
            :server-items-length="this.model.stats.executions"
            item-key="name"
            class="elevation-0 pa-0 ma-0"
            :loading="loading"
            loading-text="Loading... Please wait"
            @pagination="updatePagination"
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
                <v-btn @click.stop="openLogsDialog(item.correlation_id)" x-small disabled
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

        <LogsDialog />
        <PipelineDialog />
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
    @Prop() model!: any;
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

    updatePagination(pagination) {
        if (pagination.pageStart == 0) {
            this.updateExecutions(1, pagination.itemsPerPage);
        } else if (pagination.pageStart == 1) {
            this.updateExecutions(pagination.pageStart, pagination.pageStop);
        } else {
            this.updateExecutions(pagination.pageStart + 1, pagination.pageStop);
        }
    }

    async updateExecutions(page, size) {
        this.loading = true;
        this.executions = await getAllModelExecutions(
            this.model.model_name + "%2F" + this.model.model_version,
            page,
            size,
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

    openLogsDialog(collaboration_uid: string): void {
        EventBus.$emit("openLogsDialog", true, collaboration_uid);
    }

    openPipelineDialog(collaboration_uid: string): void {
        EventBus.$emit("openPipelineDialog", true, collaboration_uid);
    }
}
</script>
