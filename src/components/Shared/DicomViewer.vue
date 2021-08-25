<template>
    <v-container>
        <v-btn-toggle v-model="icon" dense group style="float: right">
            <v-btn value="left" @click="downloadCurrentStudy()">
                <span class="hidden-sm-and-down">Download Study</span>
                <v-icon right> mdi-download </v-icon>
            </v-btn>
        </v-btn-toggle>
        <div :id="containerId" class="dicom-viewer" style="height: 80vh"></div>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { findStudy, downloadStudy } from "../../api/OrthancService";

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
                                wadoUriRoot: window.WADO_URI_ROOT,
                                qidoRoot: window.QIDO_ROOT,
                                wadoRoot: window.WADO_ROOT,
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

    async downloadCurrentStudy(): Promise<void> {
        const file_name = this.$route.path.split("/");
        await findStudy(file_name[file_name.length - 1]).then(async (response) => {
            console.log(response);
            await downloadStudy(response[0].ID);
        });
    }
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
