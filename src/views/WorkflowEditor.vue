<template>
    <v-container fluid class="mt-3 mb-7 px-7">
        <div class="d-flex mb-4 justify-space-between">
            <h2 class="section-title mb-4">Workflow Editor</h2>
        </div>
        <div v-if="workflowErrors.length > 0">
            <ErrorMessageContainer :errorMessages="workflowErrors" />
        </div>
        <div>
            <JSONViewer
                mode="text"
                :content="content"
                :onChange="onChange"
                :readOnly="readOnly"
                :mainMenuBar="false"
            />
        </div>
        <v-col class="text-right">
            <v-btn
                color="secondary"
                class="mx-1 primary--text font-weight-bold"
                data-cy="discard-workflow-changes"
                @click="discardChangesConfirm = true"
            >
                Discard
                <v-icon class="ml-1">mdi-delete</v-icon>
            </v-btn>
            <v-btn
                color="primary"
                class="mx-1 secondary--text"
                :disabled="!validJSON"
                data-cy="save-workflow-changes"
                @click="editConfirm = true"
            >
                Save changes
                <v-icon class="ml-1">mdi-floppy</v-icon>
            </v-btn>
        </v-col>

        <v-dialog persistent v-model="editConfirm" data-cy="save-changes-modal" max-width="350px">
            <v-card>
                <v-card-title>Confirm changes</v-card-title>
                <v-card-text class="grey--text text--darken-3">
                    Are you sure you wish to make these changes to the workflow?
                </v-card-text>
                <v-card-actions class="px-4 justify-end">
                    <v-btn text data-cy="workflow-edit-confirm-cancel" @click="editConfirm = false">
                        Cancel
                        <v-icon class="ml-1">mdi-close</v-icon>
                    </v-btn>
                    <v-btn
                        text
                        data-cy="workflow-edit-confirm-ok"
                        color="primary"
                        @click="saveWorkflowChanges"
                    >
                        Confirm
                        <v-icon class="ml-1">mdi-check-circle-outline</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog
            persistent
            v-model="discardChangesConfirm"
            data-cy="discard-changes-modal"
            max-width="350px"
        >
            <v-card>
                <v-card-title>Discard changes</v-card-title>
                <v-card-text class="grey--text text--darken-3">
                    Are you sure you wish to discard the changes to the workflow?
                </v-card-text>
                <v-card-actions class="px-4 justify-end">
                    <v-btn
                        text
                        data-cy="workflow-discard-confirm-cancel"
                        @click="discardChangesConfirm = false"
                    >
                        Cancel
                        <v-icon class="ml-1">mdi-close</v-icon>
                    </v-btn>
                    <v-btn
                        text
                        data-cy="workflow-discard-confirm-ok"
                        color="primary"
                        @click="routeBackToWorkflows"
                    >
                        Confirm
                        <v-icon class="ml-1">mdi-check-circle-outline</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script lang="ts">
import { createWorkflow, getWorkflow, updateWorkflow } from "@/api/workflows/WorkflowService";
import ErrorMessageContainer from "@/components/Shared/ErrorMessageContainer.vue";
import { MonaiWorkflow, WorkflowError } from "@/models/workflows/Workflow";
import { isResultOk } from "@/utils/axios-helpers";
import { AxiosError, AxiosResponse } from "axios";
import { ContentParseError, ContentValidationErrors, OnChangeStatus } from "vanilla-jsoneditor";
import Vue from "vue";
import Component from "vue-class-component";
import { Dictionary } from "vue-router/types/router";
import JSONViewer from "../components/Shared/JSONViewer.vue";

@Component({
    components: {
        JSONViewer,
        ErrorMessageContainer,
    },
    computed: {
        content() {
            const workflow = this.$data.workflow?.workflow;

            if (workflow) {
                return { json: workflow };
            }

            return { json: {} };
        },
    },
})
export default class WorkflowEditor extends Vue {
    workflow: MonaiWorkflow = {} as MonaiWorkflow;
    workflowToSave = {};
    workflowErrors: string[] = [];

    readOnly = false;
    validJSON = true;

    editConfirm = false;
    discardChangesConfirm = false;

    async mounted() {
        const { workflow_id } = this.$route.params as Dictionary<string>;

        if (workflow_id) {
            this.workflow = await getWorkflow(workflow_id);
        }
    }

    onChange(
        { text }: { text: string },
        _previousContent: { text: string },
        { contentErrors }: OnChangeStatus,
    ) {
        this.validJSON =
            !(contentErrors as ContentParseError).parseError &&
            !((contentErrors as ContentValidationErrors)?.validationErrors ?? []).length;

        if (this.validJSON) {
            this.workflowToSave = JSON.parse(text);
        }
    }

    async saveWorkflowChanges() {
        const { workflow_id } = this.$route.params as Dictionary<string>;

        if (workflow_id) {
            const workflowUpdatedResponse = await updateWorkflow(workflow_id, this.workflowToSave);
            const workflowUpdateSuccess = "Workflow updated successfully";
            this.handleWorkflowSaving(workflowUpdatedResponse, workflowUpdateSuccess);
            return;
        }

        const workflowCreatedResponse = await createWorkflow(this.workflowToSave);
        const workflowCreationSuccess = "Workflow created successfully";
        this.handleWorkflowSaving(workflowCreatedResponse, workflowCreationSuccess);
    }

    handleWorkflowSaving(result: AxiosResponse | AxiosError, toastSuccess: string) {
        if (isResultOk(result as AxiosResponse)) {
            this.routeBackToWorkflows();
            Vue.$toast.success(toastSuccess);
            return;
        } else if ((result as AxiosError).response?.status === 400) {
            this.editConfirm = false;
            this.workflowErrors = this.formatErrorMessages(
                ((result as AxiosError).response?.data as WorkflowError).detail,
            );
            return;
        } else {
            this.editConfirm = false;
            return;
        }
    }

    routeBackToWorkflows() {
        this.$router.push({
            name: "Workflows",
        });
    }

    formatErrorMessages(workflowError: string): string[] {
        return workflowError.split(",");
    }
}
</script>

<style scoped>
.json-editor {
    height: 730px;
}
</style>

<style>
.jse-contents {
    height: inherit;
    overflow-y: scroll;
}

.jse-status-bar-info.svelte-1oo7hnc:nth-child(1),
.jse-status-bar-info.svelte-1oo7hnc:nth-child(2),
.cm-lineNumbers > .cm-activeLineGutter.cm-gutterElement,
div.cm-line,
div.cm-gutterElement {
    color: black;
}

span[title] {
    font-weight: bold;
}

div.jse-message.jse-error.svelte-kvi5ls,
div.jse-button.jse-action.jse-primary.svelte-kvi5ls {
    background: #b51c1c !important;
}

span.ͼq {
    color: #a14600;
}
</style>
