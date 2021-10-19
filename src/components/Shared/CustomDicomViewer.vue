<template>
    <v-container style="max-width: 100%; height: 80vh; overflow-y: hidden" fluid>
        <v-row>
            <!-- Series Selector -->
            <v-col cols="2" data-cy="series-selector">
                <SeriesSelector :series="series" :key="series"></SeriesSelector>
            </v-col>
            <!-- Dicom Viewport -->
            <v-col cols="8" style="color: #fff">
                <DicomViewport></DicomViewport>

                <PdfViewport></PdfViewport>
            </v-col>
            <!-- Metadata Viewport -->
            <v-col cols="2" style="color: #fff; height: 80vh; overflow-y: auto">
                <MetaData></MetaData
            ></v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";
import SeriesSelector from "./DicomViewer/SeriesSelector.vue";
import MetaData from "./DicomViewer/MetaData.vue";
import DicomViewport from "./DicomViewer/DicomViewport.vue";
import PdfViewport from "./DicomViewer/PdfViewport.vue";

import pdf from "vue-pdf";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";
import cornerstoneTools from "cornerstone-tools";
import cornerstoneMath from "cornerstone-math";
import Hammer from "hammerjs";

import { findStudy, getSeries, getInstance, getInstanceMetadata } from "../../api/OrthancService";

@Component({
    components: {
        pdf,
        SeriesSelector,
        MetaData,
        DicomViewport,
        PdfViewport,
    },
})
export default class CustomDicomViewer extends Vue {
    selectedStudyUrl = "";
    selectedItem = 0;
    study: any = {};
    series: Array<any> = [];

    orthanUrl = window.ORTHANC_API_URL;

    async created(): Promise<void> {
        const file_name = this.$route.path.split("/");

        this.selectedStudyUrl = `${window.ORTHANC_API_URL}/stone-webviewer/index.html?study=${
            file_name[file_name.length - 1]
        }`;

        this.study = await findStudy(file_name[file_name.length - 1]);
        this.series = [];
        this.study[0].Series.forEach(async (seriesId: string) => {
            let x = await getSeries(seriesId);
            this.series.push(x);
            EventBus.$emit("updatedSelectedSeries", this.series[this.selectedItem]);
        });
    }
}
</script>

<style>
/* width */
::-webkit-scrollbar {
    width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #61366e;
    border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #5f2e6e;
}
</style>
