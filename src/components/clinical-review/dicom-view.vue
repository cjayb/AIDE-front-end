<template>
    <dicom-canvas :imageIds="imageIds">
        <template
            v-slot:toolbar="{
                setActiveTool,
                resetView,
                toggleMetadataPanel,
                toggleSeriesPanel,
                showMetadata,
                showSeries,
            }"
        >
            <dicom-tools
                @set-active-tool="setActiveTool"
                @reset-view="resetView"
                @toggle-metadata-panel="toggleMetadataPanel"
                @toggle-series-panel="toggleSeriesPanel"
                :show-tools="!documentView"
                :show-metadata="showMetadata && !documentView"
                :show-series="showSeries"
            />
        </template>

        <template v-slot:footer="{ currentImageIndex, voiRange }">
            <dicom-footer
                v-show="!documentView"
                :current-slice="currentImageIndex"
                :total-slices="imageIds.length"
                :voi-range="voiRange"
            />
        </template>

        <template v-slot:series="{ showSeries }">
            <series-list
                :show-series="showSeries"
                :study="study"
                :selected-series="currentSeries?.series_uid"
                @series-selected="newSeriesSelected"
                @item-selected="itemSelected"
            />
        </template>

        <template v-slot:metadata="{ currentImageIndex, showMetadata }">
            <metadata-list
                :show-metadata="showMetadata && !documentView"
                :current-image-index="currentImageIndex"
                :image-slices="imageSlices"
            />
        </template>

        <template v-slot:pdf-viewer>
            <pdf v-if="documentView" :src="document" :text="false" class="large-pdf-viewer" />
        </template>
    </dicom-canvas>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getStudy } from "@/api/ClinicalReview/ClinicalReviewService";

import pdf from "pdfvuer";
import DicomCanvas from "./viewer/dicom-canvas.vue";
import DicomTools from "./viewer/dicom-tools.vue";
import DicomFooter from "./viewer/dicom-footer.vue";
import MetadataList from "./metadata/metadata-list.vue";
import SeriesList from "./series/series-list.vue";
import { ClinicalReviewSeries } from "@/models/ClinicalReview/ClinicalReviewTask";

type DicomViewData = {
    currentSeries?: ClinicalReviewSeries;
    documentView: boolean;
    document?: { data: Uint8Array };
    study: ClinicalReviewSeries[];
    imageSlices: string[];
};

export default defineComponent({
    components: {
        DicomCanvas,
        DicomTools,
        DicomFooter,
        MetadataList,
        SeriesList,
        pdf,
    },
    props: {
        taskExecutionId: { default: "", type: String },
    },
    emits: ["study-selected"],
    computed: {
        imageIds: function (): string[] {
            return this.imageSlices.map(
                (key) => `wadouri:${window.FRONTEND_API_HOST}/clinical-review/dicom?key=${key}`,
            );
        },
    },
    watch: {
        async taskExecutionId() {
            await getStudy(this.taskExecutionId);
        },
        currentSeries(newSeries?: ClinicalReviewSeries) {
            if (!newSeries || newSeries.modality === "DOC") {
                return;
            }

            this.imageSlices = newSeries.files;
        },
    },
    methods: {
        async getStudy(taskExecutionId: string) {
            const study = await getStudy(taskExecutionId);

            this.study = study.study;
            this.currentSeries = study.study.find((series) => series.modality !== "DOC");
            this.$emit("study-selected", study);
        },
        newSeriesSelected(seriesId: string) {
            this.currentSeries = this.study.find((series) => series.series_uid === seriesId);
        },
        itemSelected(item: { modality: string; document?: { data: Uint8Array } }) {
            this.documentView = item.modality === "DOC";
            this.document = item.document;
        },
    },
    mounted() {
        this.getStudy(this.taskExecutionId);
    },
    data(): DicomViewData {
        return {
            currentSeries: undefined,
            study: [],
            imageSlices: [],
            documentView: false,
            document: undefined,
        };
    },
});
</script>

<style lang="scss" scoped>
.dicom-view,
.dicom-wrapper {
    height: 100%;
}

.large-pdf-viewer {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    overflow: auto;
}

.large-pdf-viewer ::v-deep #viewerContainer {
    padding-top: 60px;
    background-color: #000;

    .page,
    .canvasWrapper,
    canvas {
        width: 100% !important;
        height: auto !important;
    }
}
</style>
