<template>
    <v-col style="width: 25%" class="pa-7 model-details">
        <h3 data-cy="selected-node-name">{{ selectedNode.model_name }}</h3>
        <v-chip
            class="mt-2 mb-6 mx-0"
            :color="
                selectedNode.execution_status === 'success'
                    ? 'light-green lighten-4'
                    : 'red lighten-4'
            "
            :text-color="
                selectedNode.execution_status === 'success'
                    ? 'light-green darken-4'
                    : 'red darken-3'
            "
            data-cy="selected-node-status"
        >
            <strong>{{ formatString(selectedNode.execution_status) }}</strong>
        </v-chip>
        <p data-cy="selected-node-started">
            <strong class="mr-sm-7 mr-lg-0">Execution started: </strong>
            {{ formatDate(selectedNode.execution_started) }}
        </p>
        <p data-cy="selected-node-finished">
            <strong class="mr-sm-7 mr-lg-0">Execution finished: </strong>
            {{ formatDate(selectedNode.execution_finished) }}
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
            <v-btn
                elevation="0"
                class="my-1 ml-xl-1 no-uppercase purple--text text--darken-4"
                color="purple lighten-5"
                @click.stop="downloadFile"
                data-cy="download-node-outputs"
                disabled
            >
                Download Outputs
            </v-btn>
        </v-row>
    </v-col>
</template>

<script lang="ts">
import VueTree from "@ssthouse/vue-tree-chart";
import Component from "vue-class-component";
import Vue from "vue";
import { IPayloadExecutionsFormatted } from "@/models/Admin/IPayload";
import { EventBus } from "@/event-bus";
import { Watch } from "vue-property-decorator";
import { capitaliseFirstLetter } from "@/utils/stringFormattingUtils";
import { formatDateAndTimeOfString } from "@/utils/dateFormattingUtils";

Vue.component("vue-tree", VueTree);

const ModelDetailsSectionProps = Vue.extend({
    props: {
        selectedNodeDetails: { type: Object, required: true },
    },
});

@Component({})
export default class ModelDetailsSection extends ModelDetailsSectionProps {
    selectedNode: IPayloadExecutionsFormatted = {
        execution_id: 0,
        payload_id: 0,
        model_name: "",
        execution_status: "",
        execution_started: "",
        execution_finished: "",
        children: [],
    };

    async created(): Promise<void> {
        this.selectedNode = this.selectedNodeDetails;
    }

    @Watch("selectedNodeDetails")
    onSelectedNodeChange(): void {
        this.selectedNode = this.selectedNodeDetails;
    }

    openLogsDialog(execution_id: number): void {
        EventBus.$emit("openLogsDialog", true, execution_id);
    }

    formatString(string: string): string {
        return capitaliseFirstLetter(string);
    }

    formatDate(date: string): string {
        return formatDateAndTimeOfString(date);
    }
}
</script>

<style scoped>
.model-details {
    background: #f7f3f8;
}
</style>
