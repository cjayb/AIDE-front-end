<template>
    <v-container fluid class="mt-3 mb-7 px-7">
        <v-row>
            <v-col class="col-sm-8 col-xl-9">
                <h2 class="mx-auto section-title">Issues</h2>
            </v-col>
        </v-row>
        <v-row v-if="!loading && issues !== undefined">
            <v-layout child-flex>
                <v-card>
                    <v-card-title>
                        <v-btn
                            elevation="0"
                            class="ma-1 no-uppercase purple--text text--darken-4"
                            color="white"
                            @click="deleteItem(item)"
                            :disabled="selectedTasks.length === 0"
                            data-cy="dismiss-selected"
                        >
                            Dismiss selected
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Search"
                            single-line
                            hide-details
                            data-cy="search-issues-table"
                        ></v-text-field>
                    </v-card-title>
                    <v-data-table
                        :headers="headers"
                        :items="issues"
                        :search="search"
                        :items-per-page="5"
                        v-model="selectedTasks"
                        show-select
                        item-key="task_id"
                        class="elevation-1"
                        data-cy="task"
                    >
                        <template v-slot:[`item.task_id`]="{ item }">
                            <strong data-cy="task-id">
                                {{ item.task_id }}
                            </strong>
                        </template>
                        <template v-slot:[`item.status`]="{ item }">
                            <v-chip
                                class="my-2"
                                color="red lighten-5"
                                text-color="red darken-3"
                                data-cy="status"
                            >
                                <strong>{{ item.status }}</strong>
                            </v-chip>
                        </template>
                        <template v-slot:[`item.model_name`]="{ item }">
                            <span data-cy="model-name">
                                {{ item.model_name }}
                            </span>
                        </template>
                        <template v-slot:[`item.patient_name`]="{ item }">
                            <span data-cy="patient-name">
                                {{ item.patient_name }}
                            </span>
                        </template>
                        <template v-slot:[`item.patient_id`]="{ item }">
                            <span data-cy="patient-id">
                                {{ item.patient_id }}
                            </span>
                        </template>
                        <template v-slot:[`item.execution_time`]="{ item }">
                            <span data-cy="execution-date-time">
                                {{ item.execution_time }}
                            </span>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-btn
                                elevation="0"
                                class="my-1 mr-1 no-uppercase purple--text text--darken-4"
                                color="purple lighten-5"
                                @click.stop="openLogsDialog(item.task_id)"
                                data-cy="view-logs-button"
                            >
                                View Logs
                            </v-btn>
                            <v-btn
                                elevation="0"
                                outlined
                                class="my-1 ml-md-0 ml-1 no-uppercase grey--text text--darken-3"
                                color="grey lighten-1"
                                @click="deleteItem(item)"
                                data-cy="dismiss-button"
                            >
                                Dismiss
                                <v-icon right> mdi-close </v-icon>
                            </v-btn>

                            <v-dialog
                                v-model="dialogDelete"
                                max-width="500px"
                                :retain-focus="false"
                            >
                                <v-card>
                                    <v-card-title class="text-h5">
                                        Are you sure you want to dismiss?
                                    </v-card-title>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            color="blue darken-1"
                                            text
                                            @click="closeDelete"
                                            data-cy="validation-cancel"
                                        >
                                            Cancel
                                        </v-btn>
                                        <v-btn
                                            color="blue darken-1"
                                            text
                                            @click="deleteItemConfirm"
                                            data-cy="validation-ok"
                                        >
                                            OK
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </template>
                    </v-data-table>
                </v-card>
            </v-layout>
        </v-row>
        <v-row v-else>
            <v-col cols="12">
                <v-skeleton-loader class="mx-auto" type="table"></v-skeleton-loader>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { dismissTasks, getModelExecutionIssues } from "@/api/AdminServices/AdminStatisticsService";
import { Watch } from "vue-property-decorator";
import { formatDateAndTime } from "@/utils/dateFormattingUtils";
import { EventBus } from "@/event-bus";
import { IIssue } from "@/models/AdminStatistics/IIssue";

@Component({
    components: {},
})
export default class IssuesTable extends Vue {
    loading = false;
    search = "";
    selectedTasks: IIssue[] = [];
    itemsToDismiss: number[] = [];
    issues: IIssue[] = [];
    dialogDelete = false;
    headers = [
        { text: "Task ID", value: "task_id" },
        { text: "Status", value: "status" },
        { text: "Model", value: "model_name" },
        { text: "Patient", value: "patient_name" },
        { text: "Patient ID", value: "patient_id" },
        { text: "Time", value: "execution_time" },
        { text: "Actions", value: "actions" },
    ];

    async created(): Promise<void> {
        this.getExecutionIssues();
    }

    @Watch("dialogDelete", { immediate: true }) onDialogDeleteChanged(value: boolean) {
        value || this.closeDelete();
    }

    async getExecutionIssues(): Promise<void> {
        this.loading = true;
        await getModelExecutionIssues()
            .then((executionIssues) => {
                formatDateAndTime(executionIssues, "execution_time");
                this.issues = executionIssues;
            })
            .catch((err) => {
                this.loading = false;
                console.log(err);
            });
        this.loading = false;
    }

    async dismissItems(taskIDs: number[]): Promise<void> {
        await dismissTasks(taskIDs).catch((err) => {
            console.log(err);
        });
        this.loading = false;
    }

    deleteItem(item?: IIssue): void {
        if (typeof item !== "undefined") {
            this.itemsToDismiss.push(this.issues.indexOf(item));
        } else {
            this.selectedTasks.forEach((selectedItem: IIssue) =>
                this.itemsToDismiss.push(this.issues.indexOf(selectedItem)),
            );
        }
        this.dialogDelete = true;
    }

    deleteItemConfirm(): void {
        this.dismissItems(this.itemsToDismiss);

        if (this.selectedTasks.length !== 0) {
            this.selectedTasks.forEach((task: IIssue) => {
                const indexOfTask = this.issues.indexOf(task);
                this.issues.splice(indexOfTask, 1);
            });
        } else {
            this.issues.splice(this.itemsToDismiss[0], 1);
        }
        this.closeDelete();

        this.$nextTick(() => {
            this.itemsToDismiss = [];
            this.selectedTasks = [];
        });
    }

    closeDelete(): void {
        this.dialogDelete = false;

        this.$nextTick(() => {
            this.itemsToDismiss = [];
        });
    }

    openLogsDialog(task_id: number): void {
        EventBus.$emit("openLogsDialog", true, task_id);
    }
}
</script>
