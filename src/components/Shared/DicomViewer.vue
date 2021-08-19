<template>
    <div :id="containerId" class="dicom-viewer" style="height: 80vh"></div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class DicomViewer extends Vue {
    containerId = "root2";

    mounted(): void {
        const plugin = document.createElement("script");
        plugin.setAttribute("src", "https://unpkg.com/@ohif/viewer@4.9.20/dist/index.umd.js");
        plugin.async = true;
        document.head.appendChild(plugin);

        if (!(window as any).ohifRendered) {
            (window as any).OHIFViewer.installViewer(
                {
                    routerBasename: "/#/clinical-review",
                    showStudyList: false,
                    whiteLabeling: null,
                    servers: {
                        dicomWeb: [
                            {
                                name: "DCM4CHEE",
                                wadoUriRoot: process.env.VUE_APP_WADO_URI_ROOT,
                                qidoRoot: process.env.VUE_APP_QIDO_ROOT,
                                wadoRoot: process.env.VUE_APP_WADO_ROOT,
                                qidoSupportsIncludeField: true,
                                imageRendering: "wadors",
                                thumbnailRendering: "wadors",
                            },
                        ],
                    },
                },
                this.containerId,
                this.componentRenderedOrUpdatedCallback,
            );
        }
    }

    destroyed(): void {
        console.log("OHIF Viewer destroyed");
    }

    componentRenderedOrUpdatedCallback = function () {
        console.log("OHIF Viewer rendered/updated");
    };
}
</script>

<style>
#root2 {
    --default-color: #000 !important;
    --hover-color: #20a5d6 !important;
    --active-color: #20a5d6 !important;

    --left-sidepanel-menu-width: 150px !important;
    --top-bar-height: 10px !important;
}

.entry-header {
    padding: 0px 0px !important;
}

.ImageThumbnail {
    height: auto !important;
    width: 100% !important;
}

.ImageThumbnail canvas {
    height: auto !important;
    width: 100% !important;
}

.study-browser .scrollable-study-thumbnails .thumbnail-container {
    padding-bottom: 0 !important;
}

.toolbar-button .toolbar-button-label {
    font-size: 10px !important;
    font-weight: 500 !important;
}

.dicom-viewer {
    background-color: #fff !important;
}
.study-browser {
    background-color: #fff !important;
}
</style>
