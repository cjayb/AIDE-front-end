<template>
    <v-container style="max-width: 100%; height: calc(100vh - 164px); overflow-y: hidden" fluid>
        <v-row>
            <v-col cols="2">
                <v-btn
                    dark
                    text
                    class="serieslist-header"
                    style="float: left"
                    v-if="seriesDisplay == true"
                    @click.stop="seriesDisplay = !seriesDisplay"
                >
                    <v-icon>mdi-chevron-left</v-icon>Hide Series
                </v-btn>
                <v-btn
                    dark
                    text
                    class="serieslist-header"
                    style="float: left"
                    v-if="seriesDisplay == false"
                    @click.stop="seriesDisplay = !seriesDisplay"
                >
                    Show Series<v-icon>mdi-chevron-right</v-icon>
                </v-btn></v-col
            >
            <v-col cols="8" class="text-xs-center">
                <v-layout justify-center>
                    <v-btn-toggle
                        v-model="toggle_tool"
                        dense
                        dark
                        v-if="
                            selectedSeries.MainDicomTags != undefined &&
                            selectedSeries.MainDicomTags.Modality != 'DOC'
                        "
                    >
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
                                    data-cy="length-tool"
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
                    <v-btn-toggle dense dark>
                        <v-btn
                            :href="`${orthanUrl}/studies/${selectedStudyId}/archive`"
                            target="_blank"
                            style="color: white"
                        >
                            <span class="hidden-sm-and-down">Download Study</span>
                            <v-icon right> mdi-download </v-icon>
                        </v-btn>
                    </v-btn-toggle>
                </v-layout>
            </v-col>
            <v-col cols="2">
                <v-btn
                    dark
                    text
                    class="metadatalist-header"
                    style="float: right"
                    v-if="metadataDisplay == true"
                    @click.stop="metadataDisplay = !metadataDisplay"
                >
                    Hide Metadata<v-icon>mdi-chevron-right</v-icon>
                </v-btn>
                <v-btn
                    dark
                    text
                    class="metadatalist-header"
                    style="float: right"
                    v-if="metadataDisplay == false"
                    @click.stop="metadataDisplay = !metadataDisplay"
                >
                    <v-icon>mdi-chevron-left</v-icon>Show Metadata
                </v-btn></v-col
            >
        </v-row>
        <v-row>
            <v-col :cols="12" style="color: #fff">
                <v-card style="background: none !important; overflow: hidden" class="ma-0 pa-0">
                    <v-navigation-drawer
                        absolute
                        temporary
                        :stateless="true"
                        left
                        v-model="seriesDisplay"
                        hide-overlay
                        width="140px"
                        class="ma-0 pa-0"
                        style="background: none !important; opacity: 0.8"
                        ><SeriesSelector :series="series"></SeriesSelector
                    ></v-navigation-drawer>
                    <DicomViewport :study="study" data-cy="dicom-viewport"></DicomViewport>
                    <PdfViewport data-cy="pdf-viewport"></PdfViewport>
                    <v-navigation-drawer
                        absolute
                        :stateless="true"
                        temporary
                        right
                        v-model="metadataDisplay"
                        hide-overlay
                        class="ma-0 pa-0"
                        style="background: none !important; opacity: 0.8"
                        ><MetaData data-cy="dicom-metadata"></MetaData
                    ></v-navigation-drawer>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";
import SeriesSelector from "../../ClinicalReview/DicomViewer/SeriesSelector.vue";
import MetaData from "../../ClinicalReview/DicomViewer/MetaData.vue";
import DicomViewport from "../../ClinicalReview/DicomViewer/DicomViewport.vue";
import PdfViewport from "../../ClinicalReview/DicomViewer/PdfViewport.vue";
import { findStudy, getSeries } from "../../../api/ClinicalReview/OrthancService";
import moment from "moment";

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
    selectedSeries: any = {};
    study: any = {};
    series: Array<any> = [];

    seriesDisplay = true;
    metadataDisplay = true;

    toggle_tool = 0;

    orthanUrl = window.ORTHANC_API_URL;

    async mounted(): Promise<void> {
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
            if (this.series.length == this.study[0].Series.length) {
                this.series = this.series.sort((a, b) => {
                    return moment(a.LastUpdate).unix() - moment(b.LastUpdate).unix();
                });
                EventBus.$emit("updatedSelectedSeries", this.series[this.selectedItem]);
            }
        });

        EventBus.$on("updatedSelectedSeries", async (selectedSeries: any) => {
            this.selectedSeries = selectedSeries;
            if (this.selectedSeries.MainDicomTags.Modality == "DOC") {
                this.seriesDisplay = false;
                this.metadataDisplay = false;
            }
        });
    }

    updateSelectedTool(tool: string): void {
        EventBus.$emit("updateSelectedTool", tool);
    }
}
</script>

<style>
.serieslist-header {
    color: white;
}

.serieslist-header .v-icon {
    color: white;
}

.metadatalist-header {
    color: white;
}

.metadatalist-header .v-icon {
    color: white;
}
</style>
