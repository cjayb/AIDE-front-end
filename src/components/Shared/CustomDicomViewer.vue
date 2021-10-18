<template>
    <v-container style="max-width: 100%; height: 80vh; overflow-y: hidden" fluid>
        <v-row>
            <!-- Series Selector -->
            <v-col cols="2" data-cy="series-selector">
                <v-list class="serieslist" style="height: 80vh; overflow-y: auto">
                    <v-header class="serieslist-header"
                        ><v-icon>mdi-chevron-left</v-icon>Series</v-header
                    >
                    <v-list-item-group v-model="selectedItem" color="primary">
                        <v-list-item
                            v-for="(item, i) in series"
                            :key="i"
                            @click="updatedSelectedSeries(item)"
                            data-cy="dicom-series"
                        >
                            <v-list-item-content>
                                <v-list-item-title>
                                    <v-sheet height="100" width="100" class="mx-auto">
                                        <v-img
                                            v-if="item.MainDicomTags.Modality != 'DOC'"
                                            class="mx-auto"
                                            :src="`${orthanUrl}/instances/${item.Instances[0]}/preview`"
                                        />
                                        <pdf
                                            v-if="item.MainDicomTags.Modality == 'DOC'"
                                            :src="`${orthanUrl}/instances/${item.Instances[0]}/pdf`"
                                        ></pdf>
                                    </v-sheet>
                                </v-list-item-title>
                                <v-list-item-subtitle data-cy="modality-length"
                                    >{{ item.MainDicomTags.Modality }} ({{
                                        item.Instances.length
                                    }})</v-list-item-subtitle
                                >
                                <v-list-item-subtitle data-cy="series-description">{{
                                    item.MainDicomTags.SeriesDescription
                                }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-col>
            <!-- Dicom Viewport -->
            <v-col cols="8" style="color: #fff">
                <div
                    v-if="selectedSeries.MainDicomTags.Modality != 'DOC'"
                    style="
                        width: 100%;
                        height: 100%;
                        position: relative;
                        color: white;
                        display: inline-block;
                        border-style: solid;
                        border-color: black;
                    "
                    oncontextmenu="return false"
                    class="disable-selection noIbar"
                    unselectable="on"
                    onselectstart="return false;"
                    onmousedown="return false;"
                >
                    <div id="dicomImage" style="width: 100%; height: 100%"></div>
                </div>

                <pdf
                    style="height: 80vh; overflow-y: auto"
                    v-if="selectedSeries.MainDicomTags.Modality == 'DOC'"
                    :src="`${orthanUrl}/instances/${selectedInstance.ID}/pdf`"
                ></pdf>
            </v-col>
            <!-- Metadata Viewport -->
            <v-col cols="2" style="color: #fff; height: 80vh; overflow-y: auto">
                <v-header class="serieslist-header" style="float: right"
                    >Metadata<v-icon>mdi-chevron-right</v-icon></v-header
                >
                <p style="clear: both">{{ selectedInstanceMetadata }}</p></v-col
            >
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import pdf from "vue-pdf";

import * as cornerstone from "cornerstone-core";
import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";
import cornerstoneTools from "cornerstone-tools";
import cornerstoneMath from "cornerstone-math";
import Hammer from "hammerjs";

import {
    findStudy,
    getStudy,
    getSeries,
    getInstance,
    getInstanceMetadata,
} from "../../api/OrthancService";

@Component({
    components: {
        pdf,
    },
})
export default class CustomDicomViewer extends Vue {
    selectedStudyUrl = "";
    selectedItem = 0;
    selectedSeries: any = {};
    selectedInstance: any = {};
    selectedInstanceMetadata: any = {};
    study: any = {};
    series: Array<any> = [];

    orthanUrl = window.ORTHANC_API_URL;

    exampleImageId =
        "https://dev-aide.answerdigital.io:8045/instances/accd3105-52315bdc-6e577e7e-7af4a839-69c1803c/preview";

    async mounted(): Promise<void> {
        const file_name = this.$route.path.split("/");

        this.selectedStudyUrl = `${window.ORTHANC_API_URL}/stone-webviewer/index.html?study=${
            file_name[file_name.length - 1]
        }`;

        this.study = await findStudy(file_name[file_name.length - 1]);
        this.series = [];
        this.study[0].Series.forEach(async (seriesId: string) => {
            let x = await getSeries(seriesId);
            this.series.push(x);
            this.selectedSeries = this.series[this.selectedItem];
            this.selectedInstance = await getInstance(this.selectedSeries.Instances[0]);
            this.selectedInstanceMetadata = await getInstanceMetadata(
                this.selectedSeries.Instances[0],
            );
            // display cornerstone
            this.renderImage();
        });
    }

    async updatedSelectedSeries(item: any): Promise<void> {
        this.selectedSeries = item;
        this.selectedInstance = await getInstance(this.selectedSeries.Instances[0]);
        this.selectedInstanceMetadata = await getInstanceMetadata(this.selectedSeries.Instances[0]);

        this.renderImage();
    }

    renderImage(): void {
        cornerstoneWebImageLoader.external.cornerstone = cornerstone;
        cornerstoneTools.external.cornerstone = cornerstone;
        cornerstoneTools.external.Hammer = Hammer;
        cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

        cornerstoneTools.init();

        const WwwcTool = cornerstoneTools.WwwcTool;

        const element = document.getElementById("dicomImage");
        cornerstone.enable(element);
        cornerstone
            .loadImage(`${this.orthanUrl}/instances/${this.selectedInstance.ID}/preview`)
            .then(function (image: any) {
                cornerstone.displayImage(element, image);
                cornerstoneTools.addTool(WwwcTool);
                cornerstoneTools.setToolActive("Wwwc", { mouseButtonMask: 1 });
            });
    }
}
</script>

<style>
.serieslist {
    background: black !important;
    color: white !important;
}

.serieslist-header .v-icon {
    color: white;
}

.serieslist .v-list-item__subtitle {
    color: #fff !important;
    text-align: center;
}

.serieslist .v-list-item-group .v-list-item {
    margin: 5px 5px;
}

.serieslist .v-list-item-group .v-list-item--active {
    opacity: 100%;
    border-radius: 10px;
    border: solid 1px white;
}

.serieslist .v-list-item--link:before {
    background-color: #46464680;
    opacity: 100%;
    border-radius: 10px;
    margin: 0px;
}

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
