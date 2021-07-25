<template>
    <v-container {{selectedExecutionMetaData}}
        ><v-list-item>
            <v-list-item-content>
                <v-list-item-title class="text-h6"> Metadata </v-list-item-title>
                <!-- <v-list-item-subtitle> subtext </v-list-item-subtitle> -->
            </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>
        <v-list class="transparent" dense>
            <v-list-item>
                <v-list-item-title>Modality</v-list-item-title>

                <v-list-item-subtitle class="text-right">
                    {{ selectedExecutionMetaData.Modality }}
                </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
                <v-list-item-title>InstitutionName</v-list-item-title>

                <v-list-item-subtitle class="text-right">
                    {{ selectedExecutionMetaData.InstitutionName }}
                </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
                <v-list-item-title>PatientsName</v-list-item-title>

                <v-list-item-subtitle class="text-right">
                    {{ selectedExecutionMetaData.PatientsName }}
                </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
                <v-list-item-title>PatientID</v-list-item-title>

                <v-list-item-subtitle class="text-right">
                    {{ selectedExecutionMetaData.PatientID }}
                </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
                <v-list-item-title>PatientsSex</v-list-item-title>

                <v-list-item-subtitle class="text-right">
                    {{ selectedExecutionMetaData.PatientsSex }}
                </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
                <v-list-item-title>PatientsAge</v-list-item-title>

                <v-list-item-subtitle class="text-right">
                    {{ selectedExecutionMetaData.PatientsAge }}
                </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
                <v-list-item-title>PatientsWeight</v-list-item-title>

                <v-list-item-subtitle class="text-right">
                    {{ selectedExecutionMetaData.PatientsWeight }}
                </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
                <v-list-item-title>ContrastBolusAgent</v-list-item-title>

                <v-list-item-subtitle class="text-right">
                    {{ selectedExecutionMetaData.ContrastBolusAgent }}
                </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
                <v-list-item-title>SliceThickness</v-list-item-title>

                <v-list-item-subtitle class="text-right">
                    {{ selectedExecutionMetaData.SliceThickness }}
                </v-list-item-subtitle>
            </v-list-item>
        </v-list></v-container
    >
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";

@Component({})
export default class Metadata extends Vue {
    metadata = [
        { label: "Modality", total: "CT" },
        { label: "InstitutionName", total: "JFK IMAGING CENTER" },
        { label: "PatientsName", total: "Example Value" },
        { label: "PatientID", total: "1CT1" },
        { label: "PatientsSex", total: "O" },
        { label: "PatientsAge", total: "000Y" },
        { label: "PatientsWeight", total: "0.0" },
        { label: "ContrastBolusAgent", total: "ISOVUE300/100" },
        { label: "SliceThickness", total: "5.0" },
        { label: "KVP", total: "120.0" },
        { label: "SpacingBetweenSlices", total: "5.0" },
        { label: "DataCollectionDiameter", total: "480.0" },
    ];

    selectedExecutionMetaData = {};

    created(): void {
        EventBus.$on("selectTask", (execution: any) => {
            this.selectedExecutionMetaData =
                execution.output.destinations[0].study.series[0].metadata;
        });
    }
}
</script>
