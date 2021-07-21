<template>
    <v-container
        ><v-list-item>
            <v-list-item-content>
                <v-list-item-title class="text-h6"> Metadata </v-list-item-title>
                <v-list-item-subtitle> subtext </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>
        <v-list class="transparent" dense>
            <v-list-item v-for="item in metadata" :key="item.label">
                <v-list-item-title>{{ item.label }}</v-list-item-title>

                <v-list-item-subtitle class="text-right">
                    {{ item.total }}
                </v-list-item-subtitle>
            </v-list-item>
        </v-list></v-container
    >
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
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
}
</script>
