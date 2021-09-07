<template>
    <v-dialog
        transition="dialog-bottom-transition"
        v-model="dialog3"
        max-width="60vw"
        style="overflow-x: hidden"
    >
        <template v-slot:default="dialog3">
            <v-card>
                <div v-show="loading" class="pa-1 pb-2">
                    Please Wait...
                    <v-progress-linear indeterminate color="blue" class=""></v-progress-linear>
                </div>
                <div v-show="!loading">
                    <v-toolbar color="#61366e" dark>
                        Pipeline -
                        <span v-if="pipelines[0]">{{ pipelines[0].model.model_name }}</span>
                    </v-toolbar>
                    <!-- <v-card-text> -->
                    <v-timeline align-top dense v-if="pipelines[0]" clipped>
                        <v-timeline-item small>
                            <v-row class="pt-1">
                                <v-col cols="3">
                                    <strong>Input Received</strong>
                                </v-col>
                                <v-col>
                                    <strong>Dicom Ingestor</strong>
                                    <div class="text-caption">
                                        {{ pipelines[0].timestamp.received_at | formatDate }}
                                    </div>
                                </v-col>
                            </v-row>
                        </v-timeline-item>
                        <v-timeline-item
                            v-for="pipeline in pipelines"
                            :key="pipeline.execution_uid"
                            :color="getStatusColor(pipeline.result)"
                            small
                        >
                            <v-row class="pt-1">
                                <v-col cols="3">
                                    <strong>{{ getStatus(pipeline.result) }}</strong>
                                </v-col>
                                <v-col>
                                    <strong>{{ pipeline.model.model_name }}</strong>
                                    <div class="text-caption">
                                        Inference Started :
                                        {{ pipeline.timestamp.inference_started | formatDate
                                        }}<br />
                                        Inference Finished :
                                        {{ pipeline.timestamp.inference_finished | formatDate }}
                                    </div>
                                </v-col>
                            </v-row>
                        </v-timeline-item>
                    </v-timeline>
                    <v-card-actions class="justify-end">
                        <v-btn text @click="dialog3.value = false">Close</v-btn>
                    </v-card-actions>
                </div>
            </v-card>
        </template>
    </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";
import { getExecutionPipelines } from "../../api/ExecutionService";
import { Execution } from "@/models/Execution";

@Component({})
export default class PipelineDialog extends Vue {
    dialog3 = false;
    pipelines: Array<Execution> = [];
    loading = true;

    created(): void {
        EventBus.$on("openPipelineDialog", (dialog3: boolean, correlation_id: string) => {
            this.dialog3 = dialog3;
            this.pipelines = [];
            this.getPipeline(correlation_id);
        });
    }

    async getPipeline(correlation_id: string): Promise<void> {
        this.loading = true;
        this.pipelines = await getExecutionPipelines(correlation_id);
        this.loading = false;
    }

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
}
</script>
