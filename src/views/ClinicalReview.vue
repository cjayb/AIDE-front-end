<template>
    <v-container fluid class="clinical-review-container">
        <patient-header
            v-if="taskCount > 0 && currentTaskClinicalReviewMessage"
            :patient-metadata="currentTaskClinicalReviewMessage.patient_metadata"
            :study-date="studyDate"
            @task-accepted="acceptTask"
            @task-rejected="rejectTask"
        />
        <v-row class="clinical-review">
            <v-col class="task-list">
                <clinical-review-task-list
                    @task-selected="taskSelected"
                    @tasks-count-updated="taskCountUpdated"
                >
                    <template v-slot="{ throttledFetchTasks }">
                        <v-dialog :value="actionModal" persistent max-width="500px">
                            <accept-reject-dialog
                                v-if="currentTaskClinicalReviewMessage"
                                :open="actionModal"
                                :reject="reject"
                                :application-name="
                                    currentTaskClinicalReviewMessage.application_metadata
                                        .application_name
                                "
                                @cancel="actionModal = false"
                                @perform-action="(data) => performAction(data, throttledFetchTasks)"
                            />
                        </v-dialog>
                    </template>
                </clinical-review-task-list>
            </v-col>
            <v-col class="dicom-view">
                <dicom-view
                    v-if="currentTaskExecutionId"
                    :task-execution-id="currentTaskExecutionId"
                    @study-selected="studySelected"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { defineComponent } from "vue";
import DicomView from "@/components/clinical-review/dicom-view.vue";
import ClinicalReviewTaskList from "@/components/clinical-review/tasks/task-list.vue";
import { updateClinicalReview } from "../api/ClinicalReview/ClinicalReviewService";
import PatientHeader from "@/components/clinical-review/patient-header.vue";
import AcceptRejectDialog from "@/components/clinical-review/accept-reject-dialog.vue";
import {
    ClinicalReviewTask,
    ClinicalReviewTaskDetail,
    ClinicalReviewTaskDetails,
} from "@/models/ClinicalReview/ClinicalReviewTask";

type ClinicalReviewData = {
    currentTaskExecutionId?: string;
    currentTaskClinicalReviewMessage?: ClinicalReviewTaskDetails;
    taskCount: number;
    actionModal: boolean;
    reject: boolean;
    studyDate?: string;
};

export default defineComponent({
    metaInfo: {
        title: "Clinical Review",
    },
    components: {
        DicomView,
        ClinicalReviewTaskList,
        PatientHeader,
        AcceptRejectDialog,
    },
    data(): ClinicalReviewData {
        return {
            currentTaskExecutionId: "",
            currentTaskClinicalReviewMessage: undefined,
            studyDate: "",
            taskCount: 0,
            actionModal: false,
            reject: false,
        };
    },
    methods: {
        taskSelected(execution_id: string, task: ClinicalReviewTask) {
            this.currentTaskExecutionId = execution_id;
            this.currentTaskClinicalReviewMessage = task.clinical_review_message;
        },
        taskCountUpdated(count: number) {
            this.taskCount = count;
        },
        studySelected(study: ClinicalReviewTaskDetail) {
            this.studyDate = study.study_date;
        },
        acceptTask() {
            this.actionModal = true;
            this.reject = false;
        },
        rejectTask() {
            this.actionModal = true;
            this.reject = true;
        },
        async performAction(
            data: { reason: string | undefined; description: string },
            fetchTasks: () => void,
        ) {
            console.log(data);
            this.actionModal = false;

            let executionId = "";
            if (typeof this.currentTaskExecutionId === "string") {
                executionId = this.currentTaskExecutionId;
            }

            const accepted = data.reason === "";
            if (accepted) {
                const responseOk = await updateClinicalReview(
                    executionId,
                    "true",
                    "",
                    data.description,
                );

                if (responseOk) {
                    Vue.$toast.success("Clinical Review has been accepted");
                } else {
                    Vue.$toast.warning("Something unexpected went wrong. Please try again.");
                }
            } else {
                let reason = "";
                if (typeof data.reason === "string") {
                    reason = data.reason;
                }

                const responseOk = await updateClinicalReview(
                    executionId,
                    "false",
                    reason,
                    data.description,
                );

                if (responseOk) {
                    Vue.$toast.error("Clinical Review has been rejected");
                } else {
                    Vue.$toast.warning("Something unexpected went wrong. Please try again.");
                }
            }

            fetchTasks();
        },
    },
});
</script>

<style lang="scss" scoped>
.headerLabel {
    color: #424242;
    font-weight: bold;
    line-height: 24px;
    vertical-align: middle;
}

.clinical-review-container {
    height: 100%;
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    > .row {
        margin: 0;
    }
}

.patient-header {
    background-color: #fbfbfb;
    height: 80px;
}

.clinical-review {
    margin: 0;
    height: 100%;
    min-width: 1000px;

    > .col {
        padding: 0;
    }

    .task-list {
        width: 350px;
        flex: initial;
        display: flex;
    }
}
</style>
