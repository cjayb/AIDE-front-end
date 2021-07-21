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

    // Methods will be component methods
    getStatus(status: string): string {
        if (status == "Failure") return "red";
        else return "green";
    }

    openLogsDialog(): void {
        EventBus.$emit("openLogsDialog", true);
    }

    openPipelineDialog(): void {
        EventBus.$emit("openPipelineDialog", true);
    }
}
</script>
