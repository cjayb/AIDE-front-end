<template>
    <v-dialog transition="dialog-bottom-transition" max-width="30vw" v-model="dialog4">
        <template>
            <v-card>
                <v-card-title> {{ title }} </v-card-title>
                <div style="margin: 0px 30px 0px 30px">
                    <v-form v-model="requiredFieldsFilled" ref="form">
                        <v-alert> This action will be signed by you </v-alert>
                        <div v-if="!approval">
                            <span class="font-weight-medium mb-2 required"
                                >Reason for rejection</span
                            >
                            <v-select
                                outlined
                                dense
                                hidden
                                filled
                                validate-on-blur
                                return-object
                                data-cy="reject-reason"
                                label="Reason for rejection"
                                v-model="reason"
                                :items="items"
                                :rules="requiredRules"
                            ></v-select>
                        </div>
                        <div>
                            <span
                                class="font-weight-medium mb-2"
                                :class="reason === 'Other' ? 'required' : ''"
                                >Description</span
                            >
                            <v-text-field
                                outlined
                                dense
                                filled
                                :validate-on-blur="false"
                                data-cy="modal-description"
                                v-model="description"
                                :rules="reason === 'Other' ? requiredRules : undefined"
                            ></v-text-field>
                        </div>
                        <v-checkbox
                            v-model="checkbox"
                            color="#61366E"
                            :label="'I accept that this is signed under my name'"
                            data-cy="modal-checkbox"
                            :rules="requiredCheckboxRules"
                        ></v-checkbox>
                    </v-form>
                    <v-divider />

                    <v-card-actions class="px-4 justify-end">
                        <v-btn
                            text
                            class="secondary-button"
                            data-cy="user-modal-discard"
                            @click="closeDialog()"
                        >
                            Cancel
                            <v-icon right> mdi-close </v-icon>
                        </v-btn>

                        <v-btn
                            v-if="approval"
                            text
                            data-cy="modal-accept-btn"
                            :class="!requiredFieldsFilled ? 'secondary-button' : 'primary-button'"
                            @click="acceptReview()"
                            :disabled="!requiredFieldsFilled"
                        >
                            Accept
                            <v-icon right> mdi-checkbox-marked-circle </v-icon>
                        </v-btn>

                        <v-btn
                            v-else
                            text
                            data-cy="modal-reject-btn"
                            :class="!requiredFieldsFilled ? 'secondary-button' : 'primary-button'"
                            :disabled="!requiredFieldsFilled"
                            @click="rejectReview()"
                        >
                            Reject
                            <v-icon right> mdi-cancel </v-icon>
                        </v-btn>
                    </v-card-actions>
                </div>
            </v-card>
        </template>
    </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";
import { InputValidationRules } from "vuetify";
import { updateClinicalReview } from "../../api/ClinicalReview/ExecutionService";

@Component
export default class ApprovalDialog extends Vue {
    dialog4 = false;
    executionId = "";
    approval = false;
    model_name = "";
    title = "";
    items = ["Other", "Wrong Diagnosis"];
    checkbox = false;
    reason = "";
    description = "";
    loading = false;

    requiredRules: InputValidationRules = [(value) => !!value || "Required"];
    requiredCheckboxRules: InputValidationRules = [(value) => !!value || ""];
    requiredFieldsFilled = false;

    created(): void {
        EventBus.$on(
            "openApprovalDialog",
            async (dialog4: boolean, execution_uid: string, approval: boolean, title: string) => {
                this.dialog4 = dialog4;
                this.clearData();
                this.executionId = execution_uid;
                this.approval = approval;
                this.title = title;
            },
        );
    }

    updateEventsAndClose(response?: any) {
        if (response.success === true) {
            EventBus.$emit("updateTaskList", this.executionId);
        }
        this.loading = false;
        this.closeDialog();
    }

    async acceptReview() {
        if (this.checkbox) {
            this.loading = true;
            const responseOk = await updateClinicalReview(
                this.executionId,
                "true",
                "",
                this.description,
            );

            if (responseOk) {
                this.updateEventsAndClose(responseOk);
                Vue.$toast.success("Clinical Review has been accepted");
            }
        } else {
            Vue.$toast.warning("Something unexpected went wrong. Please try again.");
            this.loading = false;
        }
    }

    async rejectReview() {
        if (this.checkbox && this.reason !== "") {
            this.loading = true;
            const responseOk = await updateClinicalReview(
                this.executionId,
                "false",
                "",
                this.description,
            );

            if (responseOk) {
                this.updateEventsAndClose(responseOk);
                Vue.$toast.error("Clinical Review has been rejected");
            }
        } else {
            Vue.$toast.warning("Something unexpected went wrong. Please try again.");
            this.loading = false;
        }
    }

    clearData() {
        this.description = "";
        this.approval = false;
        this.reason = "";
        this.checkbox = false;
    }

    closeDialog() {
        this.dialog4 = false;
        this.resetForm();
    }

    resetForm() {
        (this.$refs.form as any)?.form.reset();
        (this.$refs.form as any)?.form.resetValidation();
    }
}
</script>
