<template>
    <v-container style="max-width: 100%; height: 80vh; overflow-y: hidden" fluid>
        <v-row>
            <v-col cols="2" xl="2"
                ><v-header class="serieslist-header" style="float: left"
                    ><v-icon @click="toggleSeries()">{{ seriesIcon }}</v-icon
                    >Series</v-header
                ></v-col
            >
            <v-col cols="6" xl="8">
                <v-btn-toggle dense dark style="float: right">
                    <v-btn
                        :href="`${orthanUrl}/studies/${selectedStudyId}/archive`"
                        target="_blank"
                        style="color: white"
                    >
                        <span class="hidden-sm-and-down">Download Study</span>
                        <v-icon right> mdi-download </v-icon>
                    </v-btn>
                </v-btn-toggle>
                <v-btn-toggle v-model="toggle_exclusive" dense dark style="float: right">
                    <v-tooltip bottom open-delay="1000">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                style="color: white"
                                v-bind="attrs"
                                v-on="on"
                                @click="updateSelectedTool('wwwc')"
                            >
                                <v-icon right> mdi-decagram </v-icon>
                            </v-btn>
                        </template>
                        <span>Change windowing</span>
                    </v-tooltip>

                    <v-tooltip bottom open-delay="1000">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                style="color: white"
                                v-bind="attrs"
                                v-on="on"
                                @click="updateSelectedTool('rotate')"
                            >
                                <v-icon right> mdi-rotate-right </v-icon>
                            </v-btn>
                        </template>
                        <span>Rotate</span>
                    </v-tooltip>

                    <v-tooltip bottom open-delay="1000">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                style="color: white"
                                v-bind="attrs"
                                v-on="on"
                                @click="updateSelectedTool('pan')"
                            >
                                <v-icon right> mdi-pan </v-icon>
                            </v-btn>
                        </template>
                        <span>Pan</span>
                    </v-tooltip>

                    <v-tooltip bottom open-delay="1000">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                style="color: white"
                                v-bind="attrs"
                                v-on="on"
                                @click="updateSelectedTool('zoom')"
                            >
                                <v-icon right> mdi-magnify-plus-outline </v-icon>
                            </v-btn>
                        </template>
                        <span>Zoom</span>
                    </v-tooltip>

                    <v-tooltip bottom open-delay="1000">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                style="color: white"
                                v-bind="attrs"
                                v-on="on"
                                @click="updateSelectedTool('length')"
                            >
                                <v-icon right> mdi-arrow-expand-horizontal </v-icon>
                            </v-btn>
                        </template>
                        <span>Measure length</span>
                    </v-tooltip>

                    <v-tooltip bottom open-delay="1000">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                style="color: white"
                                v-bind="attrs"
                                v-on="on"
                                @click="updateSelectedTool('angle')"
                            >
                                <v-icon right> mdi-angle-acute </v-icon>
                            </v-btn>
                        </template>
                        <span>Measure angle</span>
                    </v-tooltip>
                </v-btn-toggle>
            </v-col>
            <v-col cols="4" xl="2"
                ><v-header class="metadatalist-header" style="float: right"
                    >Metadata<v-icon @click="toggleMetadata()">{{ metadataIcon }}</v-icon></v-header
                ></v-col
            >
        </v-row>
        <v-row>
            <!-- Series Selector -->
            <v-col
                :cols="seriesWidth"
                :xl="seriesWidth"
                v-show="seriesDisplay"
                data-cy="series-selector"
                style="padding: 12px 0px"
            >
                <SeriesSelector :series="series" :key="series"></SeriesSelector>
            </v-col>
            <!-- Dicom Viewport -->
            <v-col :cols="viewportWidth" :xl="viewportWidth + 2" style="color: #fff">
                <DicomViewport :study="study" data-cy="dicom-viewport"></DicomViewport>

                <PdfViewport data-cy="pdf-viewport"></PdfViewport>
            </v-col>
            <!-- Metadata Viewport -->
            <v-col
                :cols="metadataWidth"
                :xl="metadataWidth - 2"
                v-show="metadataDisplay"
                style="color: #fff; height: 80vh; overflow-y: hidden"
            >
                <MetaData data-cy="dicom-metadata"></MetaData
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
import { findStudy, getSeries } from "../../api/OrthancService";

@Component({
    components: {
        SeriesSelector,
        MetaData,
        DicomViewport,
        PdfViewport,
    },
})
export default class CustomDicomViewer extends Vue {
    selectedStudyUrl = "";
    selectedStudyId = "";
    selectedItem = 0;
    study: any = {};
    series: Array<any> = [];

    seriesDisplay = true;
    seriesIcon = "mdi-chevron-left";
    metadataDisplay = true;
    metadataIcon = "mdi-chevron-right";

    seriesWidth = 2;
    viewportWidth = 6;
    metadataWidth = 4;

    toggle_exclusive = 0;

    orthanUrl = window.ORTHANC_API_URL;

    async created(): Promise<void> {
        const file_name = this.$route.path.split("/");

        this.selectedStudyUrl = `${window.ORTHANC_API_URL}/stone-webviewer/index.html?study=${
            file_name[file_name.length - 1]
        }`;

        this.study = await findStudy(file_name[file_name.length - 1]);
        this.selectedStudyId = this.study[0].ID;
        this.series = [];
        this.study[0].Series.forEach(async (seriesId: string) => {
            let x = await getSeries(seriesId);
            this.series.push(x);
            if (this.series.length == 1) {
                // TODO figure out why tools aren't attached on first render, so that we can remove the double call below
                EventBus.$emit("updatedSelectedSeries", this.series[this.selectedItem]);
                EventBus.$emit("updatedSelectedSeries", this.series[this.selectedItem]);
            }
        });
    }

    toggleSeries(): void {
        this.seriesDisplay = !this.seriesDisplay;
        if (this.seriesDisplay) {
            this.seriesIcon = "mdi-chevron-left";
            this.seriesWidth = 2;
            this.viewportWidth = this.viewportWidth - 2;
        } else {
            this.seriesIcon = "mdi-chevron-right";
            this.seriesWidth = 0;
            this.viewportWidth = this.viewportWidth + 2;
        }
    }

    toggleMetadata(): void {
        this.metadataDisplay = !this.metadataDisplay;
        if (this.metadataDisplay) {
            this.metadataIcon = "mdi-chevron-right";
            this.metadataWidth = 4;
            this.viewportWidth = this.viewportWidth - 2;
        } else {
            this.metadataIcon = "mdi-chevron-left";
            this.metadataWidth = 0;
            this.viewportWidth = this.viewportWidth + 2;
        }
    }

    updateSelectedTool(tool: string): void {
        EventBus.$emit("updateSelectedTool", tool);
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
