<template>
    <v-container fluid>
        <v-container fluid class="mt-3 mb-7 px-7">
            <div class="d-flex mb-4 justify-space-between">
                <h2 class="section-title mb-4">Workflows</h2>
                <v-btn
                    color="primary"
                    data-cy="add-workflow"
                    @click="navigateToWorkflowEditorCreate"
                >
                    Create new workflow
                    <v-icon class="ml-1">mdi-plus</v-icon>
                </v-btn>
            </div>

            <v-card elevation="1">
                <v-data-table
                    :headers="workflowHeaders"
                    :items="workflowPage.data"
                    :server-items-length="workflowPage.totalRecords"
                    :options.sync="tableOptions"
                    :footer-props="{ itemsPerPageOptions: [5, 10] }"
                >
                    <template v-slot:item="{ item, index }">
                        <tr :data-cy="`workflow-table-row-${index}`">
                            <!-- name -->
                            <td class="text-start" :data-cy="`workflow-table-row-name-${index}`">
                                {{ item.name }}
                            </td>
                            <!-- AeTitle -->
                            <td class="text-start" :data-cy="`workflow-table-row-aetitle-${index}`">
                                {{ item.ae_title }}
                            </td>
                            <!-- Data Origins -->
                            <td class="text-start" :data-cy="`workflow-table-row-data-${index}`">
                                {{ item.data_origins.join(", ") }}
                            </td>
                            <!-- version -->
                            <td class="text-start" :data-cy="`workflow-table-row-version-${index}`">
                                {{ item.version }}
                            </td>
                            <!-- description -->
                            <td
                                class="text-start"
                                :data-cy="`workflow-table-row-description-${index}`"
                            >
                                {{ item.description }}
                            </td>
                            <!-- actions -->
                            <td class="text-start" :data-cy="`workflow-table-row-actions-${index}`">
                                <v-btn
                                    small
                                    elevation="0"
                                    class="mr-2"
                                    aria-label="edit workflow"
                                    data-cy="workflow-edit"
                                    @click.stop="() => navigateToWorkflowEditor(item.workflow_id)"
                                >
                                    <v-icon small>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn
                                    small
                                    elevation="0"
                                    aria-label="delete workflow"
                                    data-cy="workflow-delete"
                                    @click.stop="() => confirmDeletion(item)"
                                >
                                    <v-icon small>mdi-delete</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </template>

                    <template v-slot:no-data>
                        <span class="grey--text text--darken-2"> No workflows found </span>
                    </template>
                    <template v-slot:no-results>
                        <span class="grey--text text--darken-2"> No workflows found </span>
                    </template>
                </v-data-table>
            </v-card>

            <v-dialog persistent v-model="deleteConfirm" max-width="350px">
                <v-card>
                    <v-card-title>Delete workflow</v-card-title>
                    <v-card-text class="grey--text text--darken-3"
                        >Are you sure you would like to delete
                        <strong> {{ workflowToDelete?.name }} </strong>?
                    </v-card-text>
                    <v-card-actions class="px-4 justify-end">
                        <v-btn
                            text
                            data-cy="workflow-delete-cancel"
                            @click="cancelWorkflowDeletion"
                        >
                            Cancel
                        </v-btn>
                        <v-btn
                            text
                            data-cy="workflow-delete-ok"
                            color="red darken-2"
                            @click="deleteWorkflow"
                        >
                            Yes, delete
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-container>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";
import { DataOptions, DataTableHeader } from "vuetify";
import { getAllWorkflows, deleteWorkflow } from "@/api/workflows/WorkflowService";
import { PaginatedWorkflowsResponse, WorkflowListItem } from "@/models/workflows/Workflow";
import { throttle } from "underscore";

@Component
export default class Workflows extends Vue {
    workflowHeaders: DataTableHeader[] = [
        { text: "Name", value: "name", sortable: false, width: "20%" },
        { text: "AeTitle", value: "ae_title", sortable: false, width: "20%" },
        { text: "Data Origins", value: "data_origins", sortable: false, width: "20%" },
        { text: "Version", value: "version", sortable: false, width: "10%" },
        { text: "Description", value: "description", sortable: false, width: "28%" },
        { text: "Actions", value: "id", sortable: false, width: "150px" },
    ];

    workflowPage: PaginatedWorkflowsResponse = {} as PaginatedWorkflowsResponse;
    tableOptions: DataOptions = {
        page: 1,
        itemsPerPage: 10,
    } as DataOptions;

    deleteConfirm = false;
    workflowToDelete: WorkflowListItem | null = null;

    private throttledFetchWorkflows = throttle(() => {
        this.fetchWorkflows();
    }, 500);

    @Watch("tableOptions", { deep: true })
    tableOptionsChanged() {
        this.throttledFetchWorkflows();
    }

    confirmDeletion(workflow: WorkflowListItem) {
        this.workflowToDelete = workflow;
        this.deleteConfirm = true;
    }

    cancelWorkflowDeletion() {
        this.deleteConfirm = false;
        this.workflowToDelete = null;
    }

    navigateToWorkflowEditorCreate() {
        this.$router.push({
            name: "WorkflowEditor",
        });
    }

    navigateToWorkflowEditor(workflow_id: string) {
        this.$router.push({
            name: "WorkflowEditor",
            params: {
                workflow_id: workflow_id,
            },
        });
    }

    async deleteWorkflow() {
        if (!this.workflowToDelete) {
            return;
        }

        const responseOk = await deleteWorkflow(this.workflowToDelete.workflow_id);

        if (responseOk) {
            this.deleteConfirm = false;
            this.workflowToDelete = null;

            await this.fetchWorkflows();

            Vue.$toast.success("Workflow successfully deleted");
        }
    }

    private async fetchWorkflows(): Promise<void> {
        this.workflowPage = await getAllWorkflows({
            ...this.tableOptions,
        });
    }
}
</script>
