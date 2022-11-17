<template>
    <div class="dicom-thumbnail-canvas-container">
        <div class="dicom-thumbnail-canvas" ref="dicomCanvas" />
        <div class="dicom-thumbnail-overlay"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { init, RenderingEngine, Enums } from "@cornerstonejs/core";
import initCornerstoneWADOImageLoader from "@/utils/cornerstone-wado-image-loader";
import { IStackViewport } from "@cornerstonejs/core/dist/esm/types";

type ComponentData = {
    renderer?: RenderingEngine;
    viewport?: IStackViewport;
};

const dicomCanvas = ref<HTMLDivElement>();

export default defineComponent({
    props: {
        imageId: { type: String, default: "" },
    },
    watch: {
        imageId() {
            this.loadImage();
        },
    },
    methods: {
        async configureDicomViewer() {
            await init();
            initCornerstoneWADOImageLoader(this.$keycloak?.token);

            if (!this.dicomCanvas) {
                return;
            }

            this.renderer = new RenderingEngine("dicom-thumbnail-canvas");
            this.renderer.enableElement({
                viewportId: "dicom-thumbnail-viewport",
                element: this.dicomCanvas,
                type: Enums.ViewportType.STACK,
            });

            this.viewport = this.renderer.getViewport("dicom-thumbnail-viewport") as IStackViewport;
            await this.loadImage();
        },
        async loadImage() {
            await this.viewport?.setStack([this.imageId], 0);
        },
    },
    data(): ComponentData {
        return {
            renderer: undefined,
        };
    },
    setup() {
        return {
            dicomCanvas,
        };
    },
    mounted() {
        this.configureDicomViewer();
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
