<template>
    <v-container fluid>
        <DicomExportConfiguration />
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DicomExportConfiguration from "@/components/admin-destination-configuration/DicomExportConfiguration.vue";

@Component({
    metaInfo: {
        title: "DICOM Configuration",
    },
    components: {
        DicomExportConfiguration,
    },
})
export default class AdminDicomConfiguration extends Vue {}
</script>
