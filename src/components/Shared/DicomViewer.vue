<template>
    <div :id="containerId" style="height: 80vh"></div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class DicomViewer extends Vue {
    containerId = "root";

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
                                wadoUriRoot:
                                    "https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/wado",
                                qidoRoot: "https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/rs",
                                wadoRoot: "https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/rs",
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
