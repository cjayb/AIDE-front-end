<template>
    <v-container>
        <v-btn-toggle v-model="icon" dense group style="float: right">
            <v-btn value="left" :href="selectedStudyUrl" target="_blank">
                <span class="hidden-sm-and-down">Open in Advanced Viewer</span>
                <v-icon right> mdi-launch </v-icon>
            </v-btn>
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
    studyLoading = false;
    reportLoading = false;
    selectedStudyUrl = "";

    mounted(): void {
        const file_name = this.$route.path.split("/");
        this.selectedStudyUrl = `${window.ORTHANC_API_URL}/stone-webviewer/index.html?study=${
            file_name[file_name.length - 1]
        }`;
    }

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

<style></style>
