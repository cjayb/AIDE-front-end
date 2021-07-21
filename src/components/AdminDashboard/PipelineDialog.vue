<template>
    <v-dialog transition="dialog-bottom-transition" v-model="dialog3">
        <template v-slot:default="dialog3">
            <v-card>
                <v-toolbar color="#61366e" dark>Pipeline Viewer</v-toolbar>
                <!-- <v-card-text> -->
                <v-stepper alt-labels class="mt-12">
                    <v-stepper-header>
                        <v-stepper-step step="1" complete>
                            Dicom Received
                            <small>Wed, 14 Jul 2021 11:15:59 +0000</small>
                        </v-stepper-step>
                        <v-divider></v-divider>

                        <v-stepper-step step="2" complete>
                            Orchestration Engine
                            <small>Wed, 14 Jul 2021 12:15:59 +0000</small>
                        </v-stepper-step>
                        <v-divider></v-divider>

                        <v-stepper-step step="3" complete>
                            Model A
                            <small>Start: Wed, 14 Jul 2021 12:15:59 +0000</small>
                            <small>End: Wed, 14 Jul 2021 13:15:59 +0000</small>
                        </v-stepper-step>
                        <v-divider></v-divider>

                        <v-stepper-step step="4" complete>
                            Orchestration Engine
                            <small>Wed, 14 Jul 2021 12:15:59 +0000</small>
                        </v-stepper-step>
                        <v-divider></v-divider>

                        <v-stepper-step step="5" complete>
                            Model B
                            <small>Start: Wed, 14 Jul 2021 12:15:59 +0000</small>
                            <small>End: Wed, 14 Jul 2021 13:15:59 +0000</small>
                        </v-stepper-step>
                        <v-divider></v-divider>

                        <v-stepper-step step="6" complete>
                            Orchestration Engine
                            <small>Wed, 14 Jul 2021 12:15:59 +0000</small>
                        </v-stepper-step>
                        <v-divider></v-divider>

                        <v-stepper-step step="7" complete>
                            Model C
                            <small>Start: Wed, 14 Jul 2021 12:15:59 +0000</small>
                            <small>End: Wed, 14 Jul 2021 13:15:59 +0000</small>
                        </v-stepper-step>
                    </v-stepper-header>
                </v-stepper>
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

@Component({})
export default class PipelineDialog extends Vue {
    dialog3 = false;

    created(): void {
        EventBus.$on("openPipelineDialog", (dialog3: boolean) => {
            this.dialog3 = dialog3;
        });
    }
}
</script>
