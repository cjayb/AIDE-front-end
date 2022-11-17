<template>
    <transition name="fade" mode="out-in">
        <v-toolbar align class="ma-0 pa-0" flat style="background: #fbfbfb" dense>
            <span class="ml-4" data-cy="patient-name">
                <span class="headerLabel">Patient: </span>
                <span class="headerValue">{{
                    selectedExecutionMetaData.clinical_review_message.patient_metadata.patient_name
                }}</span>
            </span>

            <v-spacer />
            <v-divider class="mx-1" vertical />
            <v-spacer />

            <span
                data-cy="patient-dob"
                v-if="
                    selectedExecutionMetaData.clinical_review_message.patient_metadata.patient_Age
                "
            >
                <span class="headerLabel">Age: </span>
                <span class="headerValue">{{
                    selectedExecutionMetaData.clinical_review_message.patient_metadata.patient_Age
                }}</span>
            </span>
            <span data-cy="patient-dob" v-else>
                <span class="headerLabel"> DoB: </span>
                <span class="headerValue">{{
                    selectedExecutionMetaData.clinical_review_message.patient_metadata.patient_Dob
                }}</span>
            </span>

            <v-spacer />
            <v-divider class="mx-1" vertical />
            <v-spacer />

            <span data-cy="patient-id">
                <span class="headerLabel">Patient ID: </span>
                <span class="headerValue">{{
                    selectedExecutionMetaData.clinical_review_message.patient_metadata.patient_id
                }}</span>
            </span>

            <v-spacer />
            <v-divider class="mx-1" vertical />
            <v-spacer />

            <span data-cy="patient-sex">
                <span class="headerLabel">Sex: </span>
                <span class="headerValue">{{
                    selectedExecutionMetaData.clinical_review_message.patient_metadata.patient_sex
                }}</span>
            </span>

            <v-spacer />
            <v-divider class="mx-1" vertical />
            <v-spacer />

            <span data-cy="study-date">
                <span class="headerLabel">Study Date: </span>
                <span class="headerValue">{{ selectedExecutionMetaData.received }}</span>
            </span>

            <v-spacer />
            <v-divider class="mx-1" vertical />
            <v-spacer />

            <span class="task-actions" data-cy="task-actions">
                <v-btn
                    data-cy="accept-btn"
                    color="#0072CE"
                    style="margin-right: 8px"
                    dark
                    class="ma-1"
                    :disabled="!tasksNotEmpty"
                    @click.stop="
                        openApprovalDialog(
                            selectedModel.execution_id,
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
                    :disabled="!tasksNotEmpty"
                    @click.stop="
                        openApprovalDialog(
                            selectedModel.execution_id,
                            false,
                            `Reject '${selectedModel.model_name}' result`,
                        )
                    "
                >
                    Reject
                </v-btn>
            </span>
        </v-toolbar>
    </transition>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import PipelineDialog from "./PipelineDialog.vue";
import { EventBus } from "@/event-bus";
import { ClinicalReviewTask } from "@/models/ClinicalReview/ClinicalReviewTask";

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
    tasksNotEmpty = true;

    mounted(): void {
        EventBus.$on("selectTask", (execution: ClinicalReviewTask) => {
            this.selectedExecutionMetaData = execution ? execution : {};
            this.selectedModel = execution
                ? execution.clinical_review_message.application_metadata
                : {};
            this.correlation_id = execution ? execution.clinical_review_message.correlation_id : "";

            this.loaded = true;
        });

        EventBus.$on("tasksNotEmpty", (tasksEmpty: boolean) => {
            this.tasksNotEmpty = tasksEmpty;
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
    color: #424242;
    font-weight: bold;
    line-height: 24px;
    vertical-align: middle;
}

.headerValue {
    font-weight: normal;
    line-height: 20px;
    vertical-align: middle;
}

.task-actions {
    width: 300px;
}
</style>
