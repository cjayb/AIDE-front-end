<template>
    <v-dialog transition="dialog-bottom-transition" max-width="60vw" v-model="dialog4">
        <template v-slot:default="dialog4">
            <v-card>
                <v-card-title> {{ title }} </v-card-title>
                <div style="margin: 0px 30px 0px 30px">
                    <v-alert dense type="info"> This action will be signed by you </v-alert>
                    <v-select
                        v-if="!approval"
                        v-model="reason"
                        :items="items"
                        filled
                        label="Reason for rejection"
                        dense
                    ></v-select>
                    <v-text-field
                        v-model="description"
                        label="Description(optional)"
                        filled
                    ></v-text-field>

                    <v-checkbox
                        v-model="checkbox"
                        color="#61366E"
                        :label="'I accept that this is signed under my name'"
                    ></v-checkbox>
                    <v-card-actions class="justify-end">
                        <v-col cols="4" style="color: #fff">
                            <v-btn
                                depressed
                                style="margin-right: 8px"
                                @click="dialog4.value = false"
                                >Cancel</v-btn
                            >
                            <v-btn
                                v-if="approval"
                                data-test="accept-btn"
                                color="#4CAF50"
                                dark
                                :loading="loading"
                                @click="acceptReview()"
                            >
                                Accept
                            </v-btn>

                            <v-btn
                                v-else
                                data-test="reject-btn"
                                color="#DC2626"
                                dark
                                :loading="loading"
                                @click="rejectReview()"
                            >
                                Reject
                            </v-btn>
                        </v-col>
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
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import { updateClinicalReview } from "../../api/ExecutionService";

@Component({
    components: { VueJsonPretty },
})
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

    created(): void {
        EventBus.$on(
            "openApprovalDialog",
            async (dialog4: boolean, execution_uid: string, approval: boolean, title: string) => {
                this.dialog4 = dialog4;
                this.executionId = execution_uid;
                this.approval = approval;
                this.title = title;
            },
        );
    }

    async acceptReview() {
        if (this.checkbox) {
            this.loading = true;
            var response = await updateClinicalReview(
                this.executionId,
                "true",
                "",
                this.description,
            );

            if (response.status === true) {
                EventBus.$emit("updateTaskList", this.executionId);
            }
            this.loading = false;
            this.dialog4 = false;
        } else {
            alert("Required fields not filled!");
        }
    }

    async rejectReview() {
        if (this.checkbox && this.reason !== "") {
            this.loading = true;
            var response = await updateClinicalReview(
                this.executionId,
                "false",
                this.reason,
                this.description,
            );
            if (response.status === true) {
                EventBus.$emit("updateTaskList", this.executionId);
            }
            this.loading = false;
            this.dialog4 = false;
        } else {
            alert("Required fields not filled!");
        }
    }
}
</script>
