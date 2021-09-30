<template>
    <v-container>
        <v-data-table
            :headers="executionsHeaders"
            :items="items"
            :server-items-length="this.model.stats.executions"
            item-key="name"
            class="elevation-0 pa-0 ma-0"
            :loading="loading"
            loading-text="Loading... Please wait"
            @pagination="updatePagination"
            data-cy="execution-table"
        >
            <!-- eslint-disable-next-line  -->
            <template v-slot:item.date="{ item }">
                {{ item.execution.timestamp.inference_started | formatDate }}
            </template>

            <!-- eslint-disable-next-line  -->
            <template v-slot:item.patient="{ item }">
                {{ item.execution.event.origin.series[0].PatientID }}
            </template>

            <!-- eslint-disable-next-line  -->
            <template v-slot:item.studydescription="{ item }">
                {{ item.execution.event.origin.series[0].StudyDescription }}
            </template>

            <!-- eslint-disable-next-line  -->
            <template v-slot:item.seriesdescription="{ item }">
                {{ item.execution.event.origin.series[0].SeriesDescription }}
            </template>

            <!-- eslint-disable-next-line  -->
            <template v-slot:item.output="{ item }">
                <v-item-group class="v-btn-toggle">
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn
                                v-on="on"
                                x-small
                                :loading="item.downloadLoading"
                                class="x-small-icon"
                            >
                                Download Output
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item
                                v-for="(resource, index) in getModelResources(item.execution)"
                                :key="index"
                                selectable
                                @click="getOutputFile(item, resource.file_path)"
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
                <v-chip :color="getStatusColor(item.execution.result)" dark outlined small>
                    {{ getStatus(item.execution.result) }}
                </v-chip>
            </template>
            <!-- eslint-disable-next-line  -->
            <template v-slot:item.duration="{ item }">
                {{
                    getTimeDifference(
                        item.execution.timestamp.inference_started,
                        item.execution.timestamp.inference_finished,
                    )
                }}
            </template>
            <!-- eslint-disable-next-line  -->
            <template v-slot:item.turnaround="{ item }">
                {{
                    getTimeDifference(
                        item.execution.timestamp.received_at,
                        item.execution.timestamp.inference_finished,
                    )
                }}
            </template>
            <!-- eslint-disable-next-line  -->
            <template v-slot:item.actions="{ item }">
                <v-btn
                    @click.stop="openLogsDialog(item.execution.model.execution_uid)"
                    x-small
                    class="ma-1"
                    data-cy="open-logs"
                    >View Logs</v-btn
                >
                <v-btn
                    @click.stop="
                        openPipelineDialog(
                            item.execution.correlation_id,
                            item.execution.model.model_uid,
                        )
                    "
                    x-small
                    class="ma-1"
                    data-cy="open-pipeline"
                    >View Pipeline</v-btn
                >
            </template>
        </v-data-table>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { EventBus } from "@/event-bus";
import DicomViewer from "../Shared/DicomViewer.vue";
import { getAllModelExecutions, getFile } from "../../api/ExecutionService";
import { Execution } from "@/models/Execution";
import { Model } from "@/models/Model";

@Component({
    components: {
        DicomViewer,
    },
})
export default class ExecutionTable extends Vue {
    // Class properties will be component data
    @Prop() model!: Model;
    loading = true;
    executions: Array<Execution> = [];
    items: Array<any> = [];
    dialog = false;
    downloadLoading = false;
    executionsHeaders = [
        {
            text: "Date",
            align: "start",
            sortable: false,
            value: "date",
        },
        {
            text: "Patient ID",
            align: "start",
            sortable: false,
            value: "patient",
        },
        {
            text: "Study Description",
            align: "start",
            sortable: false,
            value: "studydescription",
        },
        {
            text: "Series Description",
            align: "start",
            sortable: false,
            value: "seriesdescription",
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

    async getOutputFile(item: any, file_path: string): Promise<any> {
        item.downloadLoading = true;
        await getFile(file_path);
        item.downloadLoading = false;
    }

    updatePagination(pagination: any): void {
        if (pagination.pageStart == 0) {
            this.updateExecutions(0, pagination.itemsPerPage);
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

        this.items = this.executions.map((item) => {
            return { execution: item, downloadLoading: false };
        });
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

    openPipelineDialog(correlation_id: string, model_uid: string): void {
        EventBus.$emit("openPipelineDialog", true, correlation_id, model_uid);
    }
}
</script>

<style>
.x-small-icon .v-progress-circular {
    height: 13px !important;
    width: 13px !important;
}
</style>
