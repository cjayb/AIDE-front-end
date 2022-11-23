<template>
    <div class="dicom-thumbnail-canvas-container">
        <div class="dicom-thumbnail-canvas" ref="dicomCanvas" />
        <div class="dicom-thumbnail-overlay"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { init, RenderingEngine, Enums } from "@cornerstonejs/core";
import initCornerstoneWADOImageLoader from "@/utils/cornerstone-wado-image-loader";
import { IStackViewport } from "@cornerstonejs/core/dist/esm/types";

type ComponentData = {
    renderer?: RenderingEngine;
    viewport?: IStackViewport;
};

export default defineComponent({
    props: {
        imageId: { type: String, default: "" },
        seriesUid: { type: String },
    },
    watch: {
        imageId() {
            this.configureDicomViewer();
        },
    },
    methods: {
        async configureDicomViewer() {
            await init();
            initCornerstoneWADOImageLoader(this.$keycloak?.token);

            if (!(this.$refs.dicomCanvas as HTMLDivElement)) {
                return;
            }

            const viewportId = `dicom-thumbnail-viewport-${this.seriesUid}`;

            this.renderer = new RenderingEngine(`dicom-thumbnail-canvas-${this.seriesUid}`);
            this.renderer.enableElement({
                viewportId,
                element: this.$refs.dicomCanvas as HTMLDivElement,
                type: Enums.ViewportType.STACK,
            });

            this.viewport = this.renderer.getViewport(viewportId) as IStackViewport;
            await this.loadImage();
        },
        async loadImage() {
            if (!this.imageId) {
                return;
            }

            await this.viewport?.setStack([this.imageId], 0);
        },
    },
    data(): ComponentData {
        return {
            renderer: undefined,
        };
    },
    mounted() {
        this.configureDicomViewer();
    },
    beforeDestroy() {
        this.renderer?.disableElement(`dicom-thumbnail-viewport-${this.seriesUid}`);
        this.renderer?.destroy();
    },
});
</script>

<style lang="scss" scoped>
.dicom-thumbnail-canvas-container {
    position: relative;
    height: 200px;
    width: 200px;
}

.dicom-thumbnail-overlay,
.dicom-thumbnail-canvas {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>
