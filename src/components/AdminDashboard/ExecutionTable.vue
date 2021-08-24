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
                <v-item-group class="v-btn-toggle">
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" x-small>Download Output</v-btn>
                        </template>
                        <v-list>
                            <v-list-item
                                v-for="(resource, index) in getModelResources(item)"
                                :key="index"
                                selectable
                                @click="getFile(resource.file_path)"
                            >
                                <v-list-item-title>{{
                                    extractFileName(resource.file_path)
                                }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-item-group>
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
                <v-btn @click.stop="openLogsDialog(item.model.execution_uid)" x-small class="ma-1"
                    >View Logs</v-btn
                >
                <v-btn @click.stop="openPipelineDialog(item.correlation_id)" x-small class="ma-1"
                    >View Pipeline</v-btn
                >
            </template>
        </v-data-table>
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
import { getAllModelExecutions, getFile } from "../../api/ExecutionService";

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

    updatePagination(pagination: any): void {
        if (pagination.pageStart == 0) {
            this.updateExecutions(1, pagination.itemsPerPage);
        } else if (pagination.pageStart == 1) {
            this.updateExecutions(pagination.pageStart, pagination.pageStop);
        } else {
            this.updateExecutions(pagination.pageStart + 1, pagination.pageStop);
        }
    }

    getModelResources(item: any) {
        return item.event.resources.filter(
            (resource: any) => resource.namespace === item.model.model_uid,
        );
    }

    async updateExecutions(page: any, size: any): Promise<void> {
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
            return "#00703c";
        }

        if (result.status == "error") {
            return "#CF5300";
        }

        if (result.status == "failed") {
            return "#d4351c";
        }

        return "#d4351c";
    }

    extractFileName(fileName: string): string {
        const pathItems = fileName.split("/");

        return pathItems[pathItems.length - 1];
    }

    getTimeDifference(start: string, end: string): number {
        var diff = Math.abs(new Date(start).getTime() - new Date(end).getTime());
        var minutes = Math.floor(diff / 1000 / 60);
        return minutes;
    }

    openLogsDialog(execution_uid: string): void {
        EventBus.$emit("openLogsDialog", true, execution_uid);
    }

    openPipelineDialog(correlation_id: string): void {
        EventBus.$emit("openPipelineDialog", true, correlation_id);
    }
}
</script>
