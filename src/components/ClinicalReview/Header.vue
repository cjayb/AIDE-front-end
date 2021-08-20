<template>
    <transition name="fade" mode="out-in">
        <v-card style="width: 100%" :key="selectedModel">
            <v-list-item style="background: #607d8b; color: #fff">
                <v-list-item-content>
                    <v-row>
                        <v-col data-test="header-mode" cols="9">
                            Mode: {{ this.selectedModel.mode }}
                        </v-col>
                        <v-col cols="3" style="color: #fff">
                            <v-btn
                                data-test="accept-btn"
                                dark
                                x-small
                                class="ma-1"
                                @click="openPipelineDialog(correlation_id)"
                            >
                                Open Pipeline
                            </v-btn>
                            <PipelineDialog />
                            <v-btn data-test="accept-btn" color="#4CAF50" dark x-small class="ma-1">
                                Accept
                            </v-btn>
                            <v-btn data-test="reject-btn" color="#D11515" dark x-small class="ma-1">
                                Reject
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </v-list-item>
            <v-list-item style="background: #f5f5f5; color: #fff">
                <v-list-item-content>
                    <v-row style="background: #f5f5f5">
                        <v-col data-test="patient-name" cols="3">
                            Name: {{ selectedExecutionMetaData.PatientName }}
                        </v-col>
                        <v-col data-test="patient-age" cols="3">
                            Age: {{ selectedExecutionMetaData.PatientAge }}
                        </v-col>
                        <v-col data-test="patient-id" cols="3">
                            Patient Id: {{ selectedExecutionMetaData.PatientID }}
                        </v-col>
                        <v-col data-test="patient-sex" cols="3">
                            Sex: {{ selectedExecutionMetaData.PatientSex }}
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </v-list-item>
        </v-card>
    </transition>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import PipelineDialog from "../AdminDashboard/PipelineDialog.vue";
import { EventBus } from "@/event-bus";

@Component({
    components: {
        PipelineDialog,
    },
})
export default class Header extends Vue {
    selectedExecutionMetaData = {};
    selectedModel = {};
    correlation_id = "";

    created(): void {
        EventBus.$on("selectTask", (execution: any) => {
            this.selectedExecutionMetaData = execution.event.origin.series[0];
            this.selectedModel = execution.model;
            this.correlation_id = execution.correlation_id;
        });
    }

    openPipelineDialog(correlation_id: string): void {
        EventBus.$emit("openPipelineDialog", true, correlation_id);
    }
}
</script>
