<template>
    <v-dialog transition="dialog-bottom-transition" v-model="dialog3" max-width="60vw">
        <template v-slot:default="dialog3">
            <v-card>
                <v-toolbar color="#61366e" dark>Pipeline Viewer</v-toolbar>
                <!-- <v-card-text> -->
                <v-timeline :dense="$vuetify.breakpoint.smAndDown" class="pa-4">
                    <v-timeline-item>
                        <span slot="opposite">07/12/2021 10:10</span>
                        <v-card class="elevation-2">
                            <v-card-title class="text-h5"> Input Received </v-card-title>
                            <v-card-text v-if="pipelines[0]">
                                Input Received :
                                {{ pipelines[0].timestamp.input_received | formatDate }}
                            </v-card-text>
                        </v-card>
                    </v-timeline-item>

                    <v-timeline-item
                        v-for="pipeline in pipelines"
                        :key="pipeline.execution_uid"
                        :color="getStatusColor(pipeline.model.result)"
                    >
                        <span slot="opposite">{{ getStatus(pipeline.model.result) }}</span>
                        <v-card class="elevation-2">
                            <v-card-title class="text-h5">
                                {{ pipeline.model.model_name }}
                            </v-card-title>
                            <v-card-text>
                                Input Received : {{ pipeline.timestamp.input_received | formatDate
                                }}<br />
                                Inference Started :
                                {{ pipeline.timestamp.inference_started | formatDate }}<br />
                                Inference Finished :
                                {{ pipeline.timestamp.inference_finished | formatDate }}<br />
                                Output Sent : {{ pipeline.timestamp.output_sent | formatDate
                                }}<br />
                            </v-card-text>
                        </v-card>
                    </v-timeline-item>

                    <v-timeline-item color="grey">
                        <span slot="opposite">Output not sent</span>
                        <v-card class="elevation-2">
                            <v-card-title class="text-h5"> Output Sent </v-card-title>
                            <v-card-text> Output Sent : null</v-card-text>
                        </v-card>
                    </v-timeline-item>
                </v-timeline>

                <v-card-actions class="justify-end">
                    <v-btn text @click="dialog3.value = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";
import { getExecutionPipelines } from "../../api/ExecutionService";

@Component({})
export default class PipelineDialog extends Vue {
    dialog3 = false;
    pipelines = [];

    created(): void {
        EventBus.$on("openPipelineDialog", (dialog3: boolean, collaboration_uid: string) => {
            this.dialog3 = dialog3;
            console.log(collaboration_uid);
            this.getPipeline(collaboration_uid);
        });
    }

    async getPipeline(collaboration_uid: string): Promise<void> {
        this.pipelines = await getExecutionPipelines(collaboration_uid);
    }

    getStatus(result: any): string {
        console.log(result);
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

    getStatusColor(result: any): string {
        if (result.success && result.clinical_review_completed && result.approval_given) {
            return "green";
        }

        if (result.success && result.clinical_review_completed && !result.approval_given) {
            return "red";
        }

        if (result.success && !result.clinical_review_completed) {
            return "amber";
        }

        if (!result.success) {
            return "red";
        }

        return "red";
    }
}
</script>
