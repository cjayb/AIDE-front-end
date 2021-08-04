<template>
    <v-dialog transition="dialog-bottom-transition" v-model="dialog3" max-width="60vw">
        <template v-slot:default="dialog3">
            <v-card>
                <v-toolbar color="#61366e" dark v-if="pipelines[0]"
                    >Pipeline - {{ pipelines[0].model.model_name }}</v-toolbar
                >
                <!-- <v-card-text> -->
                <v-timeline align-top dense v-if="pipelines[0]" clipped>
                    <v-timeline-item small>
                        <v-row class="pt-1">
                            <v-col cols="3">
                                <strong>07/12/2021 10:10</strong>
                            </v-col>
                            <v-col>
                                <strong>Input Received </strong>
                                <div class="text-caption">
                                    Input Received :
                                    {{ pipelines[0].timestamp.input_received | formatDate }}
                                </div>
                            </v-col>
                        </v-row>
                    </v-timeline-item>
                    <v-timeline-item
                        v-for="pipeline in pipelines"
                        :key="pipeline.execution_uid"
                        :color="getStatusColor(pipeline.model.result)"
                        small
                    >
                        <v-row class="pt-1">
                            <v-col cols="3">
                                <strong>{{ getStatus(pipeline.model.result) }}</strong>
                            </v-col>
                            <v-col>
                                <strong>{{ pipeline.model.model_name }}</strong>
                                <div class="text-caption">
                                    Input Received :
                                    {{ pipeline.timestamp.input_received | formatDate }}<br />
                                    Inference Started :
                                    {{ pipeline.timestamp.inference_started | formatDate }}<br />
                                    Inference Finished :
                                    {{ pipeline.timestamp.inference_finished | formatDate }}<br />
                                    Output Sent : {{ pipeline.timestamp.output_sent | formatDate
                                    }}<br />
                                </div>
                            </v-col>
                        </v-row>
                    </v-timeline-item>
                    <v-timeline-item small color="grey">
                        <v-row class="pt-1">
                            <v-col cols="3">
                                <strong>Output not sent</strong>
                            </v-col>
                            <v-col>
                                <strong>Output Sent </strong>
                                <div class="text-caption">Output Sent : null</div>
                            </v-col>
                        </v-row>
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
