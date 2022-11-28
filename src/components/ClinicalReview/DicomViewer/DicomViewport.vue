<!--
  Copyright 2022 Crown Copyright

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
  -->

<template>
    <div
        v-if="
            selectedSeries.MainDicomTags != undefined &&
            selectedSeries.MainDicomTags.Modality != 'DOC'
        "
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
        <div id="dicomImage" style="width: 100%; height: calc(100vh - 263px)">
            <v-layout justify-center>
                <v-btn-toggle dense dark style="position: absolute; bottom: 0">
                    <v-btn style="color: white" disabled>
                        <span class="hidden-sm-and-down"
                            >Slice: {{ stack.currentImageIdIndex + 1 }}</span
                        >
                    </v-btn>
                </v-btn-toggle>
            </v-layout>
            <v-layout justify-center>
                <v-progress-circular
                    style="position: absolute; bottom: 50%"
                    v-show="loading"
                    :size="100"
                    color="#61366e"
                    indeterminate
                ></v-progress-circular>
            </v-layout>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { EventBus } from "@/event-bus";
import { getSeriesOrderedSlices } from "../../../api/ClinicalReview/OrthancService";
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
    selectedSeriesSlices: any = {};
    selectedStudyUrl = "";
    orthanUrl = window.ORTHANC_API_URL;
    stack: any = {};
    imageIds: Array<any> = [];
    timeout: any;
    loading = false;

    async mounted(): Promise<void> {
        console.log("viewport mounted");
        const file_name = this.$route.path.split("/");

        this.selectedStudyUrl = `${window.ORTHANC_API_URL}/stone-webviewer/index.html?study=${
            file_name[file_name.length - 1]
        }`;

        EventBus.$on("updatedSelectedSeries", async (selectedSeries: any) => {
            console.log("viewport updatedSelectedSeries event triggered");
            this.selectedStudyId = this.study[0].ID;
            this.selectedSeries = selectedSeries;
            this.selectedSeriesSlices = await getSeriesOrderedSlices(this.selectedSeries.ID);

            this.imageIds = this.selectedSeriesSlices.Dicom.map((seriesImage: any) =>
                `${this.orthanUrl}${seriesImage}`.replace("file", "preview"),
            );

            this.renderImage();

            const currentInstanceId = this.imageIds[this.stack.currentImageIdIndex]
                .split("/instances/")[1]
                .split("/preview")[0];
            EventBus.$emit("updateSelectedInstance", currentInstanceId);
        });

        EventBus.$on("updateSelectedTool", async (tool: any) => {
            if (tool == "wwwc") {
                cornerstoneTools.setToolActive("Wwwc", { mouseButtonMask: 1 });
            }

            if (tool == "rotate") {
                cornerstoneTools.setToolActive("Rotate", { mouseButtonMask: 1 });
            }

            if (tool == "pan") {
                cornerstoneTools.setToolActive("Pan", { mouseButtonMask: 1 });
            }

            if (tool == "zoom") {
                cornerstoneTools.setToolActive("Zoom", { mouseButtonMask: 1 });
            }

            if (tool == "length") {
                cornerstoneTools.setToolActive("Length", { mouseButtonMask: 1 });
            }

            if (tool == "angle") {
                cornerstoneTools.setToolActive("Angle", { mouseButtonMask: 1 });
            }
        });
    }

    beforeDestroy() {
        console.log("viewport destroyed");
        EventBus.$off("updatedSelectedSeries");
    }

    @Watch("stack.currentImageIdIndex")
    onStackChanged(currentImageIdIndex: any, oldImageIdIndex: any) {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            const currentInstanceId = this.imageIds[this.stack.currentImageIdIndex]
                .split("/instances/")[1]
                .split("/preview")[0];
            EventBus.$emit("updateSelectedInstance", currentInstanceId);
        }, 200); // delay
    }

    renderImage(): void {
        cornerstoneWebImageLoader.external.cornerstone = cornerstone;
        cornerstoneTools.external.cornerstone = cornerstone;
        cornerstoneTools.external.Hammer = Hammer;
        cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

        cornerstoneTools.init();

        const WwwcTool = cornerstoneTools.WwwcTool;
        const RotateTool = cornerstoneTools.RotateTool;
        const PanTool = cornerstoneTools.PanTool;
        const ZoomTool = cornerstoneTools.ZoomTool;
        const LengthTool = cornerstoneTools.LengthTool;
        const AngleTool = cornerstoneTools.AngleTool;
        const StackScrollMouseWheelTool = cornerstoneTools.StackScrollMouseWheelTool;

        this.stack = {
            currentImageIdIndex: 0,
            imageIds: this.imageIds,
        };

        const stack = this.stack;

        const element = document.getElementById("dicomImage");
        cornerstone.enable(element);

        element!.addEventListener("cornerstonetoolsstackprefetchimageloaded", this.startLoading);

        element!.addEventListener("cornerstonetoolsstackprefetchdone", this.stopLoading);

        cornerstone.loadImage(this.imageIds[0]).then(function (image: any) {
            cornerstone.displayImage(element, image);
            cornerstoneTools.addStackStateManager(element, ["stack"]);
            cornerstoneTools.addToolState(element, "stack", stack);
            cornerstoneTools.stackPrefetch.enable(element);

            cornerstoneTools.addTool(WwwcTool);
            cornerstoneTools.addTool(RotateTool);
            cornerstoneTools.addTool(ZoomTool, {
                // Optional configuration
                configuration: {
                    invert: false,
                    preventZoomOutsideImage: false,
                    minScale: 0.1,
                    maxScale: 20.0,
                },
            });
            cornerstoneTools.addTool(PanTool);
            cornerstoneTools.addTool(LengthTool);
            cornerstoneTools.addTool(AngleTool);
            cornerstoneTools.addTool(StackScrollMouseWheelTool);

            // Windowing
            cornerstoneTools.setToolActive("Wwwc", { mouseButtonMask: 1 });

            // Zoom
            cornerstoneTools.setToolActive("Zoom", { mouseButtonMask: 2 });

            // Pan
            cornerstoneTools.setToolActive("Pan", { mouseButtonMask: 3 });

            // Scroll
            cornerstoneTools.setToolActive("StackScrollMouseWheel", {});
        });
    }

    startLoading(): void {
        this.loading = true;
    }

    stopLoading(): void {
        this.loading = false;
    }
}
</script>

<style></style>
