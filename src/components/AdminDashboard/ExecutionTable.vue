<template>
    <v-container>
        <v-data-table
            :headers="executionsHeaders"
            :items="executions"
            item-key="name"
            class="elevation-0"
            dense
        >
            <template v-slot:item.outputs>
                <v-btn @click.stop="dialog = true" x-small>View Output</v-btn>
            </template>

            <template v-slot:item.status="{ item }">
                <v-chip color="green" dark outlined small>
                    {{ getStatus(item.model.result) }}
                </v-chip>
            </template>

            <template v-slot:item.actions>
                <v-btn @click.stop="openLogsDialog()" x-small>View Logs</v-btn>
                <v-btn @click.stop="openPipelineDialog()" x-small>View Pipeline</v-btn>
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
import { getModelExecutions } from "../../api/ExecutionService";

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

    executions = [];

    async created(): Promise<void> {
        this.executions = await getModelExecutions("model-1.0.0", "1", "10", "false");
    }

    dialog = false;
    executionsHeaders = [
        {
            text: "Date",
            align: "start",
            sortable: false,
            value: "timestamp.input_received",
        },
        {
            text: "Outputs",
            value: "output",
        },
        {
            text: "Status",
            value: "status",
        },
        {
            text: "Duration",
            value: "timestamp",
        },
        {
            text: "Turnaround",
            value: "timestamp",
        },
        {
            text: "Actions",
            value: "actions",
        },
    ];

    // Methods will be component methods
    getStatus(result: any): string {
        if (result.success && result.clinical_review_completed && result.approval_given) {
            return "Approved";
        }

        if (result.success && result.clinical_review_completed && !result.approval_given) {
            return "Rejected";
        }

        if (result.success && !result.clinical_review_completed) {
            return "Awaiting Clinical Review";
        }

        if (!result.success) {
            return "Failure";
        }

        return "Unknown";
    }

    openLogsDialog(): void {
        EventBus.$emit("openLogsDialog", true);
    }

    openPipelineDialog(): void {
        EventBus.$emit("openPipelineDialog", true);
    }
}
</script>
