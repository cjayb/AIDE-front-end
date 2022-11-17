<template>
    <v-list-item :value="series.series_id" class="mb-2" data-cy="series-item" @click="selectItem">
        <v-list-item-content>
            <v-list-item-title data-cy="series-title" style="margin-bottom: 5px">
                {{ series.modality }} ({{ series.files.length }})
            </v-list-item-title>
            <pdf
                v-if="series.modality === 'DOC' && document"
                class="pdf-thumbnail"
                :src="document"
                :text="false"
            />
            <DicomThumbnail v-else-if="series.modality !== 'DOC'" :imageId="imageId" />
        </v-list-item-content>
    </v-list-item>
</template>

<script lang="ts">
import { ClinicalReviewSeries } from "@/models/ClinicalReview/ClinicalReviewTask";
import { defineComponent, PropType } from "vue";
import pdf from "pdfvuer";
import DicomThumbnail from "./series-dicom-thumbnail.vue";
import { getDicomFile } from "@/api/ClinicalReview/ClinicalReviewService";
import { parseEncapsulatedPdf } from "@/utils/dicom-metadata-parser";

export default defineComponent({
    components: {
        pdf,
        DicomThumbnail,
    },
    props: {
        series: {
            type: Object as PropType<ClinicalReviewSeries>,
        },
    },
    watch: {
        series() {
            this.getDicomFile();
        },
    },
    computed: {
        imageId(): string {
            return `wadouri:${window.FRONTEND_API_HOST}/clinical-review/dicom?key=${this.series?.files[0]}`;
        },
    },
    emits: ["item-selected"],
    data() {
        return {
            document: undefined as any,
        };
    },
    methods: {
        async getDicomFile() {
            if (!this.series) {
                return;
            }

            if (this.series.modality === "DOC") {
                const buffer = await getDicomFile(this.series!.files[0]);

                const data = parseEncapsulatedPdf(new Uint8Array(buffer));

                if (!data) {
                    return;
                }

                this.document = { data };
            }
        },
        selectItem() {
            this.$emit("item-selected", {
                document: this.document,
                modality: this.series?.modality,
            });
        },
    },
    mounted() {
        this.getDicomFile();
    },
});
</script>

<style lang="scss" scoped>
.slice-thumbnail,
.pdf-thumbnail {
    width: 200px;
    height: 200px;
    overflow: hidden;
}

::v-deep #viewerContainer {
    .page,
    canvas {
        width: 200px !important;
        height: auto !important;
    }
}
</style>
