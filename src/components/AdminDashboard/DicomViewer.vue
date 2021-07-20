<template>
    <v-container style="max-width: 100%">
        <v-row><v-col cols="12">Header</v-col></v-row>
        <v-row>
            <v-col cols="2">List</v-col>
            <v-col cols="8"><div id="root" style="height: 80vh"></div></v-col>
            <v-col cols="2">Metadata</v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";

@Component
export default class DicomViewer extends Vue {
    // Declared as component data
    mounted(): void {
        var containerId = "root";
        if (!(window as any).ohifRendered) {
            (window as any).OHIFViewer.installViewer(
                {
                    // routerBasename: '/',
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
                containerId,
                this.componentRenderedOrUpdatedCallback,
            );
        }
    }

    componentRenderedOrUpdatedCallback = function () {
        console.log("OHIF Viewer rendered/updated");
    };
}
</script>
