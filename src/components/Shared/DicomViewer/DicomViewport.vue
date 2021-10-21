<template>
    <div
        v-if="selectedSeries.MainDicomTags.Modality != 'DOC'"
        style="
            width: 100%;
            height: 100%;
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
        <v-btn-toggle v-model="icon" dense group style="float: right">
            <v-btn value="left" :href="selectedStudyUrl" target="_blank" style="color: white">
                <v-icon right> mdi-rotate-right </v-icon>
            </v-btn>

            <v-btn value="left" :href="selectedStudyUrl" target="_blank" style="color: white">
                <v-icon right> mdi-swap-vertical </v-icon>
            </v-btn>

            <v-btn value="left" :href="selectedStudyUrl" target="_blank" style="color: white">
                <v-icon right> mdi-pan </v-icon>
            </v-btn>

            <v-btn value="left" :href="selectedStudyUrl" target="_blank" style="color: white">
                <v-icon right> mdi-magnify-plus-outline </v-icon>
            </v-btn>

            <v-btn value="left" :href="selectedStudyUrl" target="_blank" style="color: white">
                <span class="hidden-sm-and-down">Advanced Viewer</span>
                <v-icon right> mdi-launch </v-icon>
            </v-btn>

            <v-btn
                value="left"
                :href="`${orthanUrl}/studies/${selectedStudyId}/archive`"
                target="_blank"
                style="color: white"
            >
                <span class="hidden-sm-and-down">Download Study</span>
                <v-icon right> mdi-download </v-icon>
            </v-btn>
        </v-btn-toggle>
        <div id="dicomImage" style="width: 100%; height: 80vh">
            <span style="position: absolute; bottom: 0; left: 50%"
                >Slice: {{ stack.currentImageIdIndex }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { EventBus } from "@/event-bus";
import { getInstance } from "../../../api/OrthancService";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";
import cornerstoneTools from "cornerstone-tools";
import cornerstoneMath from "cornerstone-math";
import Hammer from "hammerjs";

@Component
export default class DicomViewport extends Vue {
    @Prop() study: any = [];
    selectedStudyId = "";
    selectedSeries: any = {};
    selectedInstance: any = {};
    selectedStudyUrl = "";
    orthanUrl = window.ORTHANC_API_URL;
    stack: any = {};
    imageIds: Array<any> = [];

    async created(): Promise<void> {
        const file_name = this.$route.path.split("/");

        this.selectedStudyUrl = `${window.ORTHANC_API_URL}/stone-webviewer/index.html?study=${
            file_name[file_name.length - 1]
        }`;

        EventBus.$on("updatedSelectedSeries", async (selectedSeries: any) => {
            this.selectedStudyId = this.study[0].ID;
            this.selectedSeries = selectedSeries;
            this.selectedInstance = await getInstance(this.selectedSeries.Instances[0]);

            this.imageIds = this.selectedSeries.Instances.map(
                (seriesImage: any) => `${this.orthanUrl}/instances/${seriesImage}/preview`,
            );

            this.renderImage();
        });
    }

    renderImage(): void {
        const element = document.getElementById("dicomImage");
        // cornerstone.reset(element);
        cornerstone.enable(element);

        cornerstoneWebImageLoader.external.cornerstone = cornerstone;
        cornerstoneTools.external.cornerstone = cornerstone;
        cornerstoneTools.external.Hammer = Hammer;
        cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

        cornerstoneTools.init();

        const WwwcTool = cornerstoneTools.WwwcTool;
        const PanTool = cornerstoneTools.PanTool;
        const ZoomTool = cornerstoneTools.ZoomTool;
        const StackScrollMouseWheelTool = cornerstoneTools.StackScrollMouseWheelTool;

        this.stack = {
            currentImageIdIndex: 0,
            imageIds: this.imageIds,
        };

        const stack = this.stack;

        cornerstone.loadImage(this.imageIds[0]).then(function (image: any) {
            cornerstone.displayImage(element, image);
            cornerstoneTools.addStackStateManager(element, ["stack"]);
            cornerstoneTools.addToolState(element, "stack", stack);

            // Windowing
            cornerstoneTools.addTool(WwwcTool);
            cornerstoneTools.setToolActive("Wwwc", { mouseButtonMask: 1 });

            // Pan
            cornerstoneTools.addTool(PanTool);
            cornerstoneTools.setToolActive("Pan", { mouseButtonMask: 2 });

            // Zoom
            cornerstoneTools.addTool(ZoomTool, {
                // Optional configuration
                configuration: {
                    invert: false,
                    preventZoomOutsideImage: false,
                    minScale: 0.1,
                    maxScale: 20.0,
                },
            });
            cornerstoneTools.setToolActive("Zoom", { mouseButtonMask: 3 });

            // Scroll
            cornerstoneTools.addTool(StackScrollMouseWheelTool);
            cornerstoneTools.setToolActive("StackScrollMouseWheel", {});
        });
    }

    // async getReports(): Promise<void> {
    //     const file_name = this.$route.path.split("/");
    //     this.reportLoading = true;
    //     await findStudy(file_name[file_name.length - 1]).then(async (response: any) => {
    //         response[0].Series.forEach(async (seriesId: string) => {
    //             let series = await getSeries(seriesId);
    //             if (series.Instances.length === 1) {
    //                 window.open(
    //                     `${window.ORTHANC_API_URL}/app/explorer.html#instance?uuid=${series.Instances[0]}`,
    //                     "_blank",
    //                 );
    //             }
    //         });
    //         this.reportLoading = false;
    //     });
    // }
}
</script>

<style></style>
