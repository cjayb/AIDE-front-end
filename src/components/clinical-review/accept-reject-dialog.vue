<template>
    <v-card>
        <v-card-title class="text-h5" data-cy="accept-reject-modal-title">
            {{ reject ? "Reject" : "Accept" }}
            {{ applicationName }} Result
        </v-card-title>
        <v-divider />
        <div class="px-6 pt-3">
            <v-alert dense type="info">This action will be signed by you</v-alert>

            <v-form ref="form" v-model="requiredFieldsFilled">
                <div v-if="reject">
                    <span class="font-weight-medium mb-2 required">Reason for rejection</span>
                    <v-select
                        outlined
                        dense
                        hidden
                        validate-on-blur
                        return-object
                        data-cy="reject-reason"
                        label="Reason for rejection"
                        v-model="reason"
                        :items="rejectReasons"
                        :rules="rejectValidation"
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
                        :validate-on-blur="false"
                        data-cy="action-description"
                        label="Description"
                        v-model="description"
                        :rules="reason === 'Other' ? rejectValidation : undefined"
                    ></v-text-field>
                </div>

                <v-checkbox data-cy="action-accept" :rules="acceptValidation">
                    <template v-slot:label>
                        <span class="font-weight-medium mb-2 required" style="color: #000"
                            >I accept that this is signed under my name</span
                        >
                    </template></v-checkbox
                >
            </v-form>
        </div>
        <v-divider />
        <v-card-actions class="px-4 justify-end">
            <v-btn text class="secondary-button" data-cy="action-cancel" @click="cancel">
                Cancel
                <v-icon right> mdi-close </v-icon>
            </v-btn>

            <v-btn
                v-if="reject"
                text
                data-cy="action-reject"
                :class="!requiredFieldsFilled ? 'secondary-button' : 'primary-button'"
                :disabled="!requiredFieldsFilled"
                @click="performAction"
            >
                Reject
                <v-icon right> mdi-cancel </v-icon>
            </v-btn>

            <v-btn
                v-else
                text
                data-cy="action-accept"
                :class="!requiredFieldsFilled ? 'secondary-button' : 'primary-button'"
                @click="performAction"
                :disabled="!requiredFieldsFilled"
            >
                Accept
                <v-icon right> mdi-checkbox-marked-circle </v-icon>
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
