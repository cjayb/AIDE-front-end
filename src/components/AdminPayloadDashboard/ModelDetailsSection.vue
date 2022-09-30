<template>
    <v-col style="width: 25%" class="pa-7 model-details">
        <h3 data-cy="selected-node-name">{{ selectedNode.name }}</h3>
        <v-chip
            :class="`mt-2 mb-6 mx-0 status ${selectedNode.status}`"
            :color="selectedNode.status | statusChipBg"
            :text-color="selectedNode.status | statusChipText"
            data-cy="selected-node-status"
        >
            <strong>{{ selectedNode.status }}</strong>
        </v-chip>
        <p data-cy="selected-node-started">
            <strong class="mr-sm-7 mr-lg-0">Execution started: </strong>
            {{ selectedNode.start_date | formatDateString }}
        </p>
        <v-row class="pa-3 mt-1">
            <v-btn
                elevation="0"
                class="my-1 mr-1 no-uppercase white--text"
                color="purple darken-4"
                @click.stop="openLogsDialog(selectedNode.execution_id)"
                data-cy="view-node-logs"
            >
                View Logs
            </v-btn>
            <div class="text-center">
                <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            elevation="0"
                            class="my-1 ml-xl-1 no-uppercase purple--text text--darken-4"
                            color="purple lighten-5"
                            data-cy="download-node-outputs"
                            v-on="on"
                            v-bind="attrs"
                            :disabled="loadingArtifacts"
                        >
                            Download Outputs
                        </v-btn>
                    </template>
                    <v-list dense>
                        <v-list-item link v-for="(value, key) in artifacts" :key="key">
                            <v-list-item-title @click="downloadArtifactByKey(key)">
                                {{ key }}
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </v-row>
    </v-col>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import { Prop, Watch } from "vue-property-decorator";
import { getPayloadExecutionArtifacts } from "@/api/Admin/payloads/PayloadService";
import { EventBus } from "@/event-bus";
import { formatDateString } from "@/utils/date-utilities";

@Component({
    filters: {
        formatDateString,
        statusChipBg: (status: string) => {
            switch (status) {
                case "Succeeded":
                case "succeeded":
                    return "light-green lighten-4";

                case "Failed":
                case "failed":
                    return "red lighten-4";

                default:
                    return "orange lighten-4";
            }
        },
        statusChipText: (status: string) => {
            switch (status) {
                case "Succeeded":
                case "succeeded":
                    return "light-green darken-4";

                case "Failed":
                case "failed":
                    return "red darken-3";

                default:
                    return "orange darken-3";
            }
        },
    },
})
export default class ModelDetailsSection extends Vue {
    @Prop()
    selectedNode: any;

    loadingArtifacts = true;
    artifacts: { [key: string]: string } = {};

    openLogsDialog(execution_id: string): void {
        EventBus.$emit("openLogsDialog", true, execution_id);
    }

    async mounted() {
        await this.getArtifacts();
    }

    @Watch("selectedNode")
    async getArtifacts() {
        this.loadingArtifacts = true;

        this.artifacts = await getPayloadExecutionArtifacts(
            this.selectedNode.workflow_instance_id,
            this.selectedNode.execution_id,
        );

        this.loadingArtifacts = Object.keys(this.artifacts).length === 0;
    }

    downloadArtifactByKey(key: string) {
        window.open(`${window.FRONTEND_API_HOST}/executions/artifact-download?key=${key}`);
    }
}
</script>

<style scoped>
.model-details {
    background: #f7f3f8;
}
</style>
