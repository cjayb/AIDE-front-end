<template>
    <v-list-item-content :data-cy="patient_id" class="pa-3">
        <v-tooltip bottom open-delay="3000">
            <template v-slot:activator="{ on, attrs }">
                <v-list-item-title data-cy="patient-name" class="pb-1" v-bind="attrs" v-on="on">
                    <strong>{{ patient_name }}</strong>
                </v-list-item-title>
            </template>
            <span>{{ patient_name }}</span>
        </v-tooltip>

        <v-tooltip bottom open-delay="3000">
            <template v-slot:activator="{ on, attrs }">
                <v-list-item-subtitle data-cy="patient-id" class="pb-1" v-bind="attrs" v-on="on">
                    <strong>Patient ID:</strong>
                    {{ patient_id }}
                </v-list-item-subtitle>
            </template>
            <span>{{ patient_id }}</span>
        </v-tooltip>

        <v-tooltip bottom open-delay="3000">
            <template v-slot:activator="{ on, attrs }">
                <v-list-item-subtitle data-cy="patient-age" class="pb-1" v-bind="attrs" v-on="on">
                    <strong>Age:</strong>
                    {{ patient_age }}
                </v-list-item-subtitle>
            </template>
            <span>{{ patient_age }}</span>
        </v-tooltip>

        <v-tooltip bottom open-delay="3000">
            <template v-slot:activator="{ on, attrs }">
                <v-list-item-subtitle data-cy="patient-sex" class="pb-1" v-bind="attrs" v-on="on">
                    <strong>Sex:</strong>
                    {{ patient_sex }}
                </v-list-item-subtitle>
            </template>
            <span>{{ patient_sex }}</span>
        </v-tooltip>

        <v-tooltip bottom open-delay="3000">
            <template v-slot:activator="{ on, attrs }">
                <v-list-item-subtitle data-cy="application" class="pb-1" v-bind="attrs" v-on="on">
                    <strong>Application:</strong>
                    {{ application_name }}
                    -
                    {{ application_version }}
                </v-list-item-subtitle>
            </template>
            <span>
                {{ application_name }}
                -
                {{ application_version }}
            </span>
        </v-tooltip>

        <v-tooltip bottom open-delay="3000">
            <template v-slot:activator="{ on, attrs }">
                <v-list-item-subtitle data-cy="mode" class="pb-1" v-bind="attrs" v-on="on">
                    <strong>Mode:</strong>
                    {{ application_mode }}
                </v-list-item-subtitle>
            </template>
            <span>{{ application_mode }}</span>
        </v-tooltip>

        <v-tooltip bottom open-delay="3000">
            <template v-slot:activator="{ on, attrs }">
                <v-list-item-subtitle data-cy="received" class="pb-1" v-bind="attrs" v-on="on">
                    <strong>Received:</strong>
                    {{ received }}
                </v-list-item-subtitle>
            </template>
            <span>{{ received }}</span>
        </v-tooltip>
    </v-list-item-content>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "ClinicalReviewListItem",
    props: {
        patient_name: { default: "", type: String },
        patient_id: { default: "", type: String },
        patient_age: { default: "", type: String },
        patient_sex: { default: "", type: String },
        application_name: { default: "", type: String },
        application_version: { default: "", type: String },
        application_mode: { default: "", type: String },
        received: { default: "", type: String },
    },
});
</script>
