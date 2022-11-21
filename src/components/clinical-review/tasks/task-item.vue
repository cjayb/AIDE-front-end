<template>
    <v-list-item :data-cy="patient.patient_id" :value="execution_id">
        <v-list-item-content>
            <v-tooltip bottom open-delay="3000">
                <template v-slot:activator="{ on, attrs }">
                    <v-list-item-title data-cy="patient-name" v-bind="attrs" v-on="on">
                        {{ patient.patient_name }}
                    </v-list-item-title>
                </template>
                <span>
                    {{ patient.patient_name }}
                </span>
            </v-tooltip>

            <v-tooltip bottom open-delay="3000">
                <template v-slot:activator="{ on, attrs }">
                    <v-list-item-subtitle data-cy="patient-id" v-bind="attrs" v-on="on">
                        <strong>Patient ID:</strong>
                        {{ patient.patient_id }}
                    </v-list-item-subtitle>
                </template>
                <span>
                    {{ patient.patient_id }}
                </span>
            </v-tooltip>

            <v-tooltip bottom open-delay="3000">
                <template v-slot:activator="{ on, attrs }">
                    <v-list-item-subtitle data-cy="patient-age" v-bind="attrs" v-on="on">
                        <strong>Age:</strong>
                        {{ patient.patient_age }}
                    </v-list-item-subtitle>
                </template>
                <span>
                    {{ patient.patient_age }}
                </span>
            </v-tooltip>

            <v-tooltip bottom open-delay="3000">
                <template v-slot:activator="{ on, attrs }">
                    <v-list-item-subtitle data-cy="patient-sex" v-bind="attrs" v-on="on">
                        <strong>Sex:</strong>
                        {{ patient.patient_sex }}
                    </v-list-item-subtitle>
                </template>
                <span>
                    {{ patient.patient_sex }}
                </span>
            </v-tooltip>

            <v-tooltip bottom open-delay="3000">
                <template v-slot:activator="{ on, attrs }">
                    <v-list-item-subtitle data-cy="application" v-bind="attrs" v-on="on">
                        <strong>Application:</strong>
                        {{ application.application_name }} - {{ application.application_version }}
                    </v-list-item-subtitle>
                </template>
                <span>
                    {{ application.application_name }} - {{ application.application_version }}
                </span>
            </v-tooltip>

            <v-tooltip bottom open-delay="3000">
                <template v-slot:activator="{ on, attrs }">
                    <v-list-item-subtitle data-cy="mode" v-bind="attrs" v-on="on">
                        <strong>Mode:</strong>
                        {{ application.application_mode }}
                    </v-list-item-subtitle>
                </template>
                <span>
                    {{ application.application_mode }}
                </span>
            </v-tooltip>

            <v-tooltip bottom open-delay="3000">
                <template v-slot:activator="{ on, attrs }">
                    <v-list-item-subtitle data-cy="received" v-bind="attrs" v-on="on">
                        <strong>Received:</strong>
                        {{ received | formatDateTime }}
                    </v-list-item-subtitle>
                </template>
                <span>
                    {{ received | formatDateTime }}
                </span>
            </v-tooltip>
        </v-list-item-content>
    </v-list-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ApplicationMetadata, PatientMetadata } from "@/models/ClinicalReview/ClinicalReviewTask";
import { formatDateTime } from "@/utils/date-utilities";

export default defineComponent({
    filters: {
        formatDateTime,
    },
    props: {
        execution_id: { type: String },
        patient: { type: Object as PropType<PatientMetadata> },
        application: { type: Object as PropType<ApplicationMetadata> },
        received: { type: String },
    },
});
</script>
