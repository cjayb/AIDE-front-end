<template>
    <v-card :loading="loading" elevation="0" class="my-0">
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title class="text-h6">Work List</v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <v-radio-group
            data-cy="radio-buttons"
            column
            class="my-0 mx-4"
            v-model="searchParameter"
            label="Search by"
        >
            <v-radio
                class="radio-btn"
                label="Patient ID"
                data-cy="patient-id-radiobtn"
                value="patientId"
            />
            <v-radio
                class="radio-btn"
                label="Patient Name"
                data-cy="patient-name-radiobtn"
                value="patientName"
            />
            <v-radio
                class="radio-btn"
                label="Application Name"
                data-cy="application-name-radiobtn"
                value="applicationName"
            />
        </v-radio-group>

        <v-text-field
            outlined
            dense
            class="px-2"
            label="Search Tasks"
            placeholder="Search Tasks"
            v-model="search"
            clearable
            @click:clear="clearSearch"
            data-cy="worklist-search"
        />

        <v-list dense nav style="height: calc(100vh - 460px); overflow-y: scroll">
            <v-list-item-group v-model="selectedItem">
                <transition-group name="list" tag="v-list-item">
                    <v-list-item
                        v-for="item in tasks"
                        :key="item.clinical_review_message.execution_id"
                        @click="selectTask(item)"
                        :active="false"
                        :data-cy="item.clinical_review_message.patient_metadata.patient_id"
                        class="list-item"
                    >
                        <clinical-review-list-item
                            :patient_name="
                                item.clinical_review_message.patient_metadata.patient_name
                            "
                            :patient_id="item.clinical_review_message.patient_metadata.patient_id"
                            :patient_age="item.clinical_review_message.patient_metadata.patient_Age"
                            :patient_sex="item.clinical_review_message.patient_metadata.patient_sex"
                            :application_name="
                                item.clinical_review_message.application_metadata.application_name
                            "
                            :application_version="
                                item.clinical_review_message.application_metadata
                                    .application_version
                            "
                            :application_mode="
                                item.clinical_review_message.application_metadata.application_mode
                            "
                            :received="item.received"
                        />
                    </v-list-item>
                </transition-group>
            </v-list-item-group>
        </v-list>
        <v-pagination
            class="mt-1"
            :total-visible="5"
            :length="totalPages"
            v-model="currentPage"
            :disabled="totalPages <= 1 && currentPage == 1"
            @input="handlePageChange"
            data-cy="pagination"
        />
    </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { ClinicalReviewTask } from "@/models/ClinicalReview/ClinicalReviewTask";
import { Watch } from "vue-property-decorator";
import { EventBus } from "@/event-bus";
import { throttle } from "underscore";
import { formatDateAndTimeOfArray } from "@/utils/date-utilities";
import ClinicalReviewListItem from "./ClinicalReviewListItem.vue";
import { getClinicalReviewTasks } from "@/api/ClinicalReview/ClinicalReviewService";

@Component({
    components: { ClinicalReviewListItem },
})
export default class Tasks extends Vue {
    tasks: Array<ClinicalReviewTask> = [];
    search = "";
    selectedItem = 0;
    currentPage = 1;
    totalPages = 1;
    allTasks = 0;
    loading = false;
    searchParameter = "patientId";

    private throttledFetchTasks = throttle(() => {
        this.getTasks();
    }, 500);

    async mounted(): Promise<void> {
        this.throttledFetchTasks();
    }

    @Watch("search")
    async tableSearchChanged() {
        this.throttledFetchTasks();
    }

    @Watch("searchParameter")
    async tableSearchParameterChanged() {
        this.throttledFetchTasks();
    }

    selectTask(execution: ClinicalReviewTask | null): void {
        EventBus.$emit("selectTask", execution);
    }

    clearSearch() {
        this.search = "";
    }

    async getTasks() {
        this.loading = true;
        getClinicalReviewTasks({
            pageNumber: this.currentPage,
            pageSize: 10,
            patientName: this.searchParameter === "patientName" ? this.search : "",
            patientId: this.searchParameter === "patientId" ? this.search : "",
            applicationName: this.searchParameter === "applicationName" ? this.search : "",
        })
            .then((response) => {
                this.tasks = response.data;

                const tasksNotEmpty = this.tasks.length > 0;
                EventBus.$emit("tasksNotEmpty", tasksNotEmpty);

                formatDateAndTimeOfArray(this.tasks, "received", false);
                this.allTasks = response.totalRecords;
                this.totalPages = response.totalPages;
                const taskToSelect = tasksNotEmpty ? this.tasks[0] : null;
                this.selectTask(taskToSelect);
            })
            .catch(() => EventBus.$emit("tasksNotEmpty", false))
            .finally(() => (this.loading = false));
    }

    async handlePageChange(value: number) {
        this.currentPage = value;
        await this.getTasks();
    }
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
    transition: all 100ms;
}

.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateX(30px);
}

.radio-btn >>> label {
    font-size: 14px !important;
}
</style>
