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
                v-on:set-active-tool="setActiveTool"
                v-on:reset-view="resetView"
                v-on:toggle-metadata-panel="toggleMetadataPanel"
                v-on:toggle-series-panel="toggleSeriesPanel"
                :showMetadata="showMetadata"
                :showSeries="showSeries"
            />
        </template>

        <template v-slot:footer="{ currentImageIndex, voiRange }">
            <dicom-footer
                :currentSlice="currentImageIndex"
                :totalSlices="imageIds.length"
                :voiRange="voiRange"
            />
        </template>

        <template v-slot:series="{ showSeries }">
            <series-list :showSeries="showSeries" />
        </template>

        <template v-slot:metadata="{ showMetadata }">
            <metadata-list :showMetadata="showMetadata" />
        </template>
    </dicom-canvas>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DicomCanvas from "./viewer/dicom-canvas.vue";
import DicomTools from "./viewer/dicom-tools.vue";
import DicomFooter from "./viewer/dicom-footer.vue";
import MetadataList from "./metadata/metadata-list.vue";
import SeriesList from "./series/series-list.vue";

export default defineComponent({
    components: {
        DicomCanvas,
        DicomTools,
        DicomFooter,
        MetadataList,
        SeriesList,
    },
    computed: {
        imageIds: function (): string[] {
            return this.seriesFiles.map(
                (key) => `wadouri:${window.FRONTEND_API_HOST}/clinical-review/dicom?key=${key}`,
            );
        },
    },
    data() {
        return {
            seriesFiles: ["CT000000.dcm"],
        };
    },
});
</script>

<style lang="scss" scoped>
.dicom-view,
.dicom-wrapper {
    height: 100%;
}
</style>
