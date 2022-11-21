<template>
    <v-card>
        <v-card-title data-cy="accept-reject-modal-title">
            {{ reject ? "Reject" : "Accept" }}
            &nbsp;{{ applicationName }} Result
        </v-card-title>
        <div class="px-6 pt-3">
            <v-alert dense type="info">This action will be signed by you</v-alert>

            <v-form ref="form" v-model="requiredFieldsFilled">
                <v-select
                    dense
                    outlined
                    v-if="reject"
                    data-cy="reject-reason"
                    label="Reason for rejection"
                    v-model="reason"
                    :items="rejectReasons"
                    :rules="rejectValidation"
                />
                <v-textarea
                    dense
                    outlined
                    data-cy="action-description"
                    label="Description"
                    v-model="description"
                />
                <v-checkbox
                    data-cy="action-accept"
                    label="I accept that this is signed under my name"
                    :rules="acceptValidation"
                />
            </v-form>
        </div>
        <v-card-actions class="px-4 justify-end">
            <v-btn data-cy="action-cancel" @click="cancel">Cancel</v-btn>
            <v-btn
                data-cy="action-reject"
                v-if="reject"
                @click="performAction"
                :disabled="!requiredFieldsFilled"
            >
                Reject
            </v-btn>
            <v-btn
                data-cy="action-accept"
                v-else
                @click="performAction"
                :disabled="!requiredFieldsFilled"
            >
                Accept
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { InputValidationRules } from "vuetify";

const rejectReasons = ["Other", "Wrong Diagnosis"];
const rejectValidation: InputValidationRules = [(value) => !!value || "Required"];
const acceptValidation: InputValidationRules = [
    (value) => !!value || "You need to accept before saving",
];

export default defineComponent({
    props: {
        open: { type: Boolean },
        reject: { type: Boolean },
        applicationName: { type: String },
    },
    watch: {
        open() {
            (this.$refs as any).form.reset();
        },
    },
    data() {
        return {
            requiredFieldsFilled: false,
            reason: "",
            description: "",
        };
    },
    emits: ["cancel", "perform-action"],
    methods: {
        cancel() {
            this.$emit("cancel");
        },
        performAction() {
            this.$emit("perform-action", { reason: this.reason, description: this.description });
        },
    },
    setup() {
        return {
            rejectReasons,
            rejectValidation,
            acceptValidation,
        };
    },
});
</script>

<style lang="scss" scoped>
.v-input--selection-controls.v-input--checkbox {
    margin-top: 0;
}
</style>
