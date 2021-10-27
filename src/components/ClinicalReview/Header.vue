<template>
    <transition name="fade" mode="out-in">
        <v-row style="background: #fbfbfb">
            <v-col data-cy="patient-name" cols="2">
                <span class="headerLabel">Patient Name:</span>
                <span class="headerValue">{{ selectedExecutionMetaData.PatientName }}</span>
            </v-col>
            <v-divider class="my-3" vertical></v-divider>
            <v-col data-cy="patient-dob" cols="2" v-if="selectedExecutionMetaData.PatientAge">
                <span class="headerLabel">Age:</span>
                <span class="headerValue">{{ selectedExecutionMetaData.PatientAge }}</span>
            </v-col>
            <v-col data-cy="patient-dob" cols="2" else>
                <span class="headerLabel">DoB:</span>
                <span class="headerValue">{{
                    selectedExecutionMetaData.PatientBirthDate | formatAge
                }}</span>
            </v-col>
            <v-divider class="my-3" vertical></v-divider>
            <v-col data-cy="patient-id" cols="2" v-if="selectedExecutionMetaData.HospitalID">
                <span class="headerLabel">HospitalID:</span>
                <span class="headerValue">{{ selectedExecutionMetaData.HospitalID }}</span>
            </v-col>
            <v-col data-cy="patient-id" cols="2" else>
                <span class="headerLabel">PatientID:</span>
                <span class="headerValue">{{ selectedExecutionMetaData.PatientID }}</span>
            </v-col>
            <v-divider class="my-3" vertical></v-divider>
            <v-col data-cy="patient-sex" cols="2">
                <span class="headerLabel">Gender:</span>
                <span class="headerValue">{{ selectedExecutionMetaData.PatientSex }}</span>
            </v-col>
            <v-divider class="my-3" vertical></v-divider>
            <v-col data-cy="patient-sex" cols="2">
                <span class="headerLabel">Study Date:</span>
                <span class="headerValue">{{
                    selectedExecutionMetaData.StudyDate | formatAge
                }}</span>
            </v-col>
            <v-divider class="my-3" vertical></v-divider>
            <v-col data-cy="patient-sex" cols="2">
                <v-btn
                    data-test="open-pipeline"
                    text
                    class="ma-1"
                    @click="openPipelineDialog(correlation_id, selectedModel.model_uid)"
                >
                    Open Pipeline
                </v-btn>
                <v-btn
                    data-cy="accept-btn"
                    color="#0072CE"
                    style="margin-right: 8px"
                    dark
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
                    data-cy="reject-btn"
                    color="#DA291C"
                    dark
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

        <!-- <v-card style="width: 100%" :key="selectedModel" v-if="loaded">
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
                                @click="openPipelineDialog(correlation_id, selectedModel.model_uid)"
                            >
                                Open Pipeline
                            </v-btn>
                            <PipelineDialog />
                        </v-col>
                        <v-col cols="2" style="background: #f5f5f5; color: #fff">
                            <v-btn
                                data-cy="accept-btn"
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
                                data-cy="reject-btn"
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
                        <v-col data-cy="patient-name" cols="3">
                            Name: {{ selectedExecutionMetaData.PatientName }}
                        </v-col>
                        <v-col
                            data-cy="patient-dob"
                            cols="3"
                            v-if="selectedExecutionMetaData.PatientAge"
                        >
                            Age: {{ selectedExecutionMetaData.PatientAge }}
                        </v-col>
                        <v-col data-cy="patient-dob" cols="3" else>
                            Birth Date: {{ selectedExecutionMetaData.PatientBirthDate | formatAge }}
                        </v-col>
                        <v-col data-cy="patient-id" cols="3">
                            Patient Id: {{ selectedExecutionMetaData.PatientID }}
                        </v-col>
                        <v-col data-cy="patient-sex" cols="3">
                            Sex: {{ selectedExecutionMetaData.PatientSex }}
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </v-list-item>
        </v-card> -->
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

    openPipelineDialog(correlation_id: string, model_uid: string): void {
        EventBus.$emit("openPipelineDialog", true, correlation_id, model_uid);
    }
}
</script>
<style scoped>
.headerLabel {
    color: #61366e;
    font-weight: bold;
    line-height: 44px;
    vertical-align: middle;
}

.headerValue {
    font-weight: bold;
    line-height: 44px;
    vertical-align: middle;
}
</style>
