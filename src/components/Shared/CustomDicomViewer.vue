<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-btn-toggle dense group style="float: right">
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
            </v-col>
        </v-row>
        <v-row>
            <!-- Series Selector -->
            <v-col cols="1">
                <v-list>
                    <v-subheader>Series</v-subheader>
                    <v-list-item-group v-model="selectedItem" color="primary">
                        <v-list-item
                            v-for="(item, i) in series"
                            :key="i"
                            @click="selectedSeries = item"
                        >
                            <v-list-item-content>
                                <v-list-item-title>
                                    <v-sheet
                                        color="white"
                                        elevation="3"
                                        height="100"
                                        rounded
                                        width="100"
                                        class="mx-auto"
                                    >
                                        <v-img
                                            v-if="item.MainDicomTags.Modality != 'DOC'"
                                            class="mx-auto"
                                            :src="`https://dev-aide.answerdigital.io:8045/instances/${item.Instances[0]}/preview`"
                                        />
                                        <pdf
                                            v-if="item.MainDicomTags.Modality == 'DOC'"
                                            :src="`https://dev-aide.answerdigital.io:8045/instances/${item.Instances[0]}/pdf`"
                                        ></pdf>
                                    </v-sheet>
                                </v-list-item-title>
                                <v-list-item-subtitle
                                    >{{ item.MainDicomTags.Modality }} - ({{
                                        item.Instances.length
                                    }})</v-list-item-subtitle
                                >
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-col>
            <!-- Dicom Viewport -->
            <v-col cols="11"> DICOM Viewport {{ selectedSeries }}</v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import pdf from "vue-pdf";
import { findStudy, getStudy, getSeries, getInstance } from "../../api/OrthancService";

@Component({
    components: {
        pdf,
    },
})
export default class CustomDicomViewer extends Vue {
    selectedStudyUrl = "";
    studyLoading = false;
    reportLoading = false;
    selectedItem = 0;
    selectedSeries: any = {};
    study: any = {};
    series: Array<any> = [];

    async mounted(): Promise<void> {
        const file_name = this.$route.path.split("/");
        this.selectedStudyUrl = `${window.ORTHANC_API_URL}/stone-webviewer/index.html?study=${
            file_name[file_name.length - 1]
        }`;

        this.study = await findStudy(file_name[file_name.length - 1]);
        this.series = [];
        this.study[0].Series.forEach(async (seriesId: string) => {
            let x = await getSeries(seriesId);
            this.series.push(x);
            this.selectedSeries = this.series[this.selectedItem];
        });
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
