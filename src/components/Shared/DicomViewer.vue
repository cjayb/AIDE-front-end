<template>
    <v-container>
        <v-btn-toggle v-model="icon" dense group style="float: right">
            <v-btn value="left" @click="getReports()" :loading="reportLoading">
                <span class="hidden-sm-and-down">Open Report</span>
                <v-icon right> mdi-download </v-icon>
            </v-btn>
            <v-btn value="left" @click="OpenInOrthanc()" :loading="studyLoading">
                <span class="hidden-sm-and-down">Open in Orthanc</span>
                <v-icon right> mdi-download </v-icon>
            </v-btn>
        </v-btn-toggle>
        <iframe :src="selectedStudyUrl" width="100%" style="height: 80vh" frameborder="0"> </iframe>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { findStudy, downloadStudy, getSeries } from "../../api/OrthancService";

@Component
export default class DicomViewer extends Vue {
    containerId = "root2";
    studyLoading = false;
    reportLoading = false;
    selectedStudyUrl = "";

    mounted(): void {
        const file_name = this.$route.path.split("/");
        this.selectedStudyUrl = `${window.ORTHANC_API_URL}/stone-webviewer/index.html?study=${
            file_name[file_name.length - 1]
        }`;
    }

    destroyed(): void {
        console.log("OHIF Viewer destroyed");
    }

    componentRenderedOrUpdatedCallback = function () {
        console.log("OHIF Viewer rendered/updated");
    };

    async OpenInOrthanc(): Promise<void> {
        const file_name = this.$route.path.split("/");
        this.studyLoading = true;
        await findStudy(file_name[file_name.length - 1]).then(async (response) => {
            window.open(
                `${window.ORTHANC_API_URL}/app/explorer.html#study?uuid=${response[0].ID}`,
                "_blank",
            );
            this.studyLoading = false;
        });
    }

    async getReports(): Promise<void> {
        const file_name = this.$route.path.split("/");
        this.reportLoading = true;
        await findStudy(file_name[file_name.length - 1]).then(async (response: any) => {
            response[0].Series.forEach(async (seriesId: string) => {
                let series = await getSeries(seriesId);
                if (series.Instances.length === 1) {
                    window.open(
                        `${window.ORTHANC_API_URL}/app/explorer.html#instance?uuid=${series.Instances[0]}`,
                        "_blank",
                    );
                }
            });
            this.reportLoading = false;
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
