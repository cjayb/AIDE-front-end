<template>
    <transition name="fade" mode="out-in">
        <v-card style="width: 100%" :key="selectedModel" v-if="loaded">
            <v-list-item style="background: #455a64; color: #fff" class="pr-0">
                <v-list-item-content>
                    <v-row>
                        <v-col
                            data-test="header-mode"
                            cols="8"
                            style="
                                color: #fff;
                                display: flex;
                                justify-content: center;
                                align-content: center;
                                flex-direction: column;
                            "
                        >
                            Mode: {{ this.selectedModel.mode }}
                        </v-col>
                        <v-col cols="2">
                            <v-btn
                                data-test="open-pipeline"
                                dark
                                x-small
                                text
                                class="ma-1"
                                @click="openPipelineDialog(correlation_id)"
                            >
                                Open Pipeline
                            </v-btn>
                            <PipelineDialog />
                        </v-col>
                        <v-col cols="2" style="background: #f5f5f5; color: #fff">
                            <v-btn
                                data-test="accept-btn"
                                color="#4CAF50"
                                style="margin-right: 8px"
                                dark
                                x-small
                                class="ma-1"
                                @click.stop="
                                    openApprovalDialog(
                                        selectedModel.execution_uid,
                                        true,
                                        `Accept '${selectedModel.model_name}' result`,
                                    )
                                "
                            >
                                Accept
                            </v-btn>
                            <v-btn
                                data-test="reject-btn"
                                color="#D11515"
                                dark
                                x-small
                                class="ma-1"
                                @click.stop="
                                    openApprovalDialog(
                                        selectedModel.execution_uid,
                                        false,
                                        `Reject '${selectedModel.model_name}' result`,
                                    )
                                "
                            >
                                Reject
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </v-list-item>
            <v-list-item style="background: #fff">
                <v-list-item-content>
                    <v-row style="background: #fff">
                        <v-col data-test="patient-name" cols="3">
                            Name: {{ selectedExecutionMetaData.PatientName }}
                        </v-col>
                        <v-col
                            data-test="patient-age"
                            cols="3"
                            v-if="selectedExecutionMetaData.PatientAge"
                        >
                            Age: {{ selectedExecutionMetaData.PatientAge }}
                        </v-col>
                        <v-col data-test="patient-age" cols="3" else>
                            Birth Date: {{ selectedExecutionMetaData.PatientBirthDate | formatAge }}
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
    loaded = false;

    created(): void {
        EventBus.$on("selectTask", (execution: any) => {
            this.selectedExecutionMetaData = execution.event.origin.series[0];
            this.selectedModel = execution.model;
            this.correlation_id = execution.correlation_id;
            if (this.selectedModel) {
                this.loaded = true;
            }
        });
    }

    openApprovalDialog(execution_uid: string, approval: boolean, title: string): void {
        EventBus.$emit("openApprovalDialog", true, execution_uid, approval, title);
    }

    openPipelineDialog(correlation_id: string): void {
        EventBus.$emit("openPipelineDialog", true, correlation_id);
    }
}
</script>
