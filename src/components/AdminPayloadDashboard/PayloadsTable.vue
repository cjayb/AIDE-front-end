<template>
    <v-container class="mt-3 mb-7">
        <v-row class="mb-5">
            <v-col class="col-sm-8 col-xl-9">
                <h2 class="mx-auto section-title">Payloads/Inputs</h2>
            </v-col>
        </v-row>
        <v-row v-if="!loading && payloads !== undefined">
            <v-layout child-flex>
                <v-card>
                    <v-card-title>
                        <v-spacer />
                        <v-spacer />
                        <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Search"
                            single-line
                            hide-details
                            data-cy="search-payloads-table"
                        ></v-text-field>
                    </v-card-title>
                    <v-data-table
                        :headers="headers"
                        :items="payloads"
                        :search="search"
                        :items-per-page="5"
                        show-expand
                        single-expand
                        item-key="payload_id"
                        class="elevation-1"
                        data-cy="payload"
                    >
                        <template v-slot:no-data>
                            <span class="grey--text text--darken-3">No data available</span>
                        </template>
                        <template v-slot:no-results>
                            <span class="grey--text text--darken-3">No results found</span>
                        </template>
                        <template v-slot:[`item.patient_name`]="{ item }">
                            <strong data-cy="patient-name-payload">
                                {{ item.patient_name }}
                            </strong>
                        </template>
                        <template v-slot:[`item.patient_id`]="{ item }">
                            <span data-cy="patient-id-payload">
                                {{ item.patient_id }}
                            </span>
                        </template>
                        <template v-slot:[`item.payload_id`]="{ item }">
                            <span data-cy="payload-id">
                                {{ item.payload_id }}
                            </span>
                        </template>
                        <template v-slot:[`item.payload_received`]="{ item }">
                            <span data-cy="payload-received">
                                {{ item.payload_received }}
                            </span>
                        </template>
                        <template v-slot:[`expanded-item`]="{ item }">
                            <td :colspan="5">
                                <ExecutionTree :payload_id="item.payload_id" />
                            </td>
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
import { getPayloads } from "@/api/Admin/AdminStatisticsService";
import { IPayload } from "@/models/Admin/IPayload";
import ExecutionTree from "@/components/AdminPayloadDashboard/ExecutionTree.vue";
import { formatDateAndTimeOfArray } from "@/utils/dateFormattingUtils";

@Component({
    components: {
        ExecutionTree,
    },
})
export default class PayloadsTable extends Vue {
    loading = false;
    search = "";
    payloads: IPayload[] = [];

    headers = [
        { text: "Patient Name", value: "patient_name" },
        { text: "Patient ID", value: "patient_id" },
        { text: "Payload ID", value: "payload_id" },
        { text: "Payload Received", value: "payload_received" },
    ];

    async created(): Promise<void> {
        this.getAllPayloads();
    }

    async getAllPayloads(): Promise<void> {
        this.loading = true;
        await getPayloads()
            .then((allPayloads) => {
                formatDateAndTimeOfArray(allPayloads, "payload_received");
                this.payloads = allPayloads;
            })
            .catch((err) => {
                this.loading = false;
                console.log(err);
            });
        this.loading = false;
    }
}
</script>
