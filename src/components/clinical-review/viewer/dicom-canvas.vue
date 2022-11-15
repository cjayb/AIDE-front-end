<template>
    <div class="dicom-canvas-wrapper">
        <div
            oncontextmenu="return false"
            unselectable="on"
            onselectstart="return false;"
            onmousedown="return false"
            class="dicom-canvas"
            ref="dicomCanvas"
        />

        <slot
            name="toolbar"
            v-bind="{
                setActiveTool,
                resetView,
                toggleMetadataPanel,
                toggleSeriesPanel,
                showMetadata,
                showSeries,
            }"
        />

        <slot name="footer" v-bind="{ currentImageIndex, voiRange }" />

        <slot name="metadata" v-bind="{ showMetadata }" />

        <slot name="series" v-bind="{ showSeries }" />

        <v-overlay :value="loading" :absolute="true" color="#cecece" z-index="10">
            <v-progress-circular size="100" color="primary" indeterminate />
        </v-overlay>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { init, RenderingEngine, Enums, eventTarget } from "@cornerstonejs/core";
import {
    init as initTools,
    addTool,
    ToolGroupManager,
    ZoomTool,
    PanTool,
    StackScrollMouseWheelTool,
    WindowLevelTool,
    TrackballRotateTool,
} from "@cornerstonejs/tools";
import { IToolGroup } from "@cornerstonejs/tools/dist/esm/types";
import { MouseBindings } from "@cornerstonejs/tools/dist/esm/enums";
import { IStackViewport, EventTypes, ICamera, VOIRange } from "@cornerstonejs/core/dist/esm/types";
import initCornerstoneWADOImageLoader from "@/utils/cornerstone-wado-image-loader";
import { debounce } from "underscore";

const dicomCanvas = ref<HTMLDivElement>();

type ComponentData = {
    renderer?: RenderingEngine;
    viewport?: IStackViewport;
    tools?: IToolGroup;
    voiRange?: VOIRange;
    defaultCamera?: ICamera;
    currentImageId?: string;
    currentImageIndex: number;
    loading: boolean;
    showMetadata: boolean;
    showSeries: boolean;
};

export default defineComponent({
    data(): ComponentData {
        return {
            renderer: undefined,
            viewport: undefined,
            tools: undefined,
            voiRange: undefined,
            loading: true,
            currentImageIndex: 0,
            showMetadata: true,
            showSeries: true,
        };
    },
    props: {
        activeTool: { default: PanTool.toolName as string },
        imageIds: { default: () => [] as string[] },
    },
    watch: {
        imageIds() {
            this.loadImages();
        },
    },
    methods: {
        async configureCornerstone() {
            if (!this.dicomCanvas) {
                return;
            }

            await init();
            initCornerstoneWADOImageLoader(this.$keycloak?.token);
            initTools();

            const startLoading = debounce(() => {
                this.loading = true;
            }, 250);

            const stopLoading = debounce(() => {
                this.loading = false;
            }, 250);

            const updateCurrentImage = debounce((ev: any) => {
                const { imageId, newImageIdIndex } = (ev as EventTypes.StackViewportScrollEvent)
                    .detail;
                this.currentImageId = imageId;
                this.currentImageIndex = newImageIdIndex;
            }, 250);

            const resizeCanvas = debounce(() => {
                this.renderer?.resize(true);
                this.viewport?.resize();
            }, 100);

            eventTarget.addEventListener(Enums.Events.IMAGE_LOAD_PROGRESS, startLoading);
            eventTarget.addEventListener(Enums.Events.IMAGE_LOADED, stopLoading);
            eventTarget.addEventListener(Enums.Events.STACK_VIEWPORT_NEW_STACK, () => {
                this.defaultCamera = this.viewport?.getCamera();
            });

            this.dicomCanvas.addEventListener(Enums.Events.VOI_MODIFIED, (ev) => {
                const { detail } = ev as EventTypes.VoiModifiedEvent;

                this.voiRange = detail.range;
            });

            this.dicomCanvas.addEventListener(
                Enums.Events.STACK_VIEWPORT_SCROLL,
                updateCurrentImage,
            );

            window.addEventListener("resize", resizeCanvas);

            this.tools = ToolGroupManager.createToolGroup("dicom-tools");
            this.renderer = new RenderingEngine("dicom-canvas");
            this.renderer.enableElement({
                viewportId: "dicom-viewport",
                element: this.dicomCanvas,
                type: Enums.ViewportType.STACK,
            });

            this.viewport = this.renderer.getViewport("dicom-viewport") as IStackViewport;

            this.configureCornerstoneTools();
            this.tools?.addViewport("dicom-viewport", "dicom-canvas");
            await this.loadImages();
        },
        configureCornerstoneTools() {
            try {
                addTool(ZoomTool);
                addTool(PanTool);
                addTool(StackScrollMouseWheelTool);
                addTool(WindowLevelTool);
                addTool(TrackballRotateTool);
            } catch {
                // do nothing
            }

            this.tools?.addTool(ZoomTool.toolName, {
                configuration: {
                    invert: false,
                    preventZoomOutsideImage: false,
                    minScale: 0.1,
                    maxScale: 20.0,
                },
            });
            this.tools?.addTool(PanTool.toolName);
            this.tools?.addTool(StackScrollMouseWheelTool.toolName);
            this.tools?.addTool(WindowLevelTool.toolName);
            this.tools?.addTool(TrackballRotateTool.toolName);

            this.tools?.setToolActive(WindowLevelTool.toolName, {
                bindings: [
                    {
                        mouseButton: MouseBindings.Primary_And_Secondary,
                    },
                ],
            });
            this.tools?.setToolActive(ZoomTool.toolName, {
                bindings: [
                    {
                        mouseButton: MouseBindings.Secondary,
                    },
                ],
            });
            this.tools?.setToolActive(PanTool.toolName, {
                bindings: [
                    {
                        mouseButton: MouseBindings.Primary,
                    },
                ],
            });
            this.tools?.setToolActive(StackScrollMouseWheelTool.toolName);
            this.tools?.setToolActive(TrackballRotateTool.toolName);
        },
        setActiveTool(toolName: string) {
            const currentPrimaryTool = this.tools?.getActivePrimaryMouseButtonTool();

            if (currentPrimaryTool) {
                this.tools?.setToolDisabled(currentPrimaryTool);
            }

            this.tools?.setToolActive(toolName, {
                bindings: [
                    {
                        mouseButton: MouseBindings.Primary,
                    },
                ],
            });
        },
        resetView() {
            if (this.defaultCamera) {
                this.viewport?.setCamera(this.defaultCamera);
            }

            this.viewport?.resetCamera(true, true);
            this.viewport?.resetProperties();
            this.viewport?.setProperties({ rotation: 0 }, true);
            this.viewport?.render();
            this.setActiveTool(PanTool.toolName);
        },
        async loadImages() {
            await this.viewport?.setStack(this.imageIds, 0);
            this.imageIds.forEach((_, index) => this.viewport?.setImageIdIndex(index));
            await this.viewport?.setImageIdIndex(0);
        },
        toggleMetadataPanel() {
            this.showMetadata = !this.showMetadata;
        },
        toggleSeriesPanel() {
            this.showSeries = !this.showSeries;
        },
    },
    mounted() {
        this.configureCornerstone();
    },
    setup() {
        return {
            dicomCanvas,
        };
    },
});
</script>

<style lang="scss" scoped>
.dicom-canvas-wrapper,
.dicom-canvas {
    height: 100%;
    position: relative;
    overflow: hidden;
}
</style>
