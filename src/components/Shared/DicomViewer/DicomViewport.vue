<template>
    <!-- <v-container> -->
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
        <div id="dicomImage" style="width: 100%; height: 80vh"></div>
    </div>
    <!-- </v-container> -->
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
    selectedSeries: any = {};
    selectedInstance: any = {};
    orthanUrl = window.ORTHANC_API_URL;
    imageIds: Array<any> = [];
    async created(): Promise<void> {
        EventBus.$on("updatedSelectedSeries", async (selectedSeries: any) => {
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

        const stack = {
            currentImageIdIndex: 0,
            imageIds: this.imageIds,
        };

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
}
</script>

<style></style>
