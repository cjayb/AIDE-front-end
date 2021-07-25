<template>
    <v-dialog transition="dialog-bottom-transition" v-model="dialog3">
        <template v-slot:default="dialog3">
            <v-card>
                <v-toolbar color="#61366e" dark>Pipeline Viewer</v-toolbar>

                {{ pipeline }}

                <!-- <v-card-text> -->
                <v-timeline :dense="$vuetify.breakpoint.smAndDown">
                    <v-timeline-item v-for="pipeline in pipelines" :key="pipeline.execution_uid">
                        <span slot="opposite"
                            >Completed successfully : {{ pipeline.model.result.success }}</span
                        >
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
}
</script>
