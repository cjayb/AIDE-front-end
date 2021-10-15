<template>
    <v-container style="max-width: 100%" fluid>
        <v-row>
            <!-- Series Selector -->
            <v-col cols="2">
                <v-list class="serieslist" style="height: 80vh; overflow-y: auto">
                    <v-header class="serieslist-header"
                        ><v-icon>mdi-chevron-left</v-icon>Series</v-header
                    >
                    <v-list-item-group v-model="selectedItem" color="primary">
                        <v-list-item
                            v-for="(item, i) in series"
                            :key="i"
                            @click="updatedSelectedSeries(item)"
                        >
                            <v-list-item-content>
                                <v-list-item-title>
                                    <v-sheet height="100" width="100" class="mx-auto">
                                        <v-img
                                            v-if="item.MainDicomTags.Modality != 'DOC'"
                                            class="mx-auto"
                                            :src="`${orthanUrl}/instances/${item.Instances[0]}/preview`"
                                        />
                                        <pdf
                                            v-if="item.MainDicomTags.Modality == 'DOC'"
                                            :src="`${orthanUrl}/instances/${item.Instances[0]}/pdf`"
                                        ></pdf>
                                    </v-sheet>
                                </v-list-item-title>
                                <v-list-item-subtitle
                                    >{{ item.MainDicomTags.Modality }} ({{
                                        item.Instances.length
                                    }})</v-list-item-subtitle
                                >
                                <v-list-item-subtitle>{{
                                    item.MainDicomTags.SeriesDescription
                                }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-col>
            <!-- Dicom Viewport -->
            <v-col cols="8" style="color: #fff">
                DICOM Viewport {{ selectedInstance }}
                <v-img
                    v-if="selectedSeries.MainDicomTags.Modality != 'DOC'"
                    class="mx-auto"
                    :src="`${orthanUrl}/instances/${selectedInstance.ID}/preview`"
                />
                <pdf
                    v-if="selectedSeries.MainDicomTags.Modality == 'DOC'"
                    :src="`${orthanUrl}/instances/${selectedInstance.ID}/pdf`"
                ></pdf>
            </v-col>
            <!-- Metadata Viewport -->
            <v-col cols="2" style="color: #fff">
                <v-header class="serieslist-header" style="float: right"
                    >Metadata<v-icon>mdi-chevron-right</v-icon></v-header
                >
                <p style="clear: both">{{ selectedInstanceMetadata }}</p></v-col
            >
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import pdf from "vue-pdf";
import {
    findStudy,
    getStudy,
    getSeries,
    getInstance,
    getInstanceMetadata,
} from "../../api/OrthancService";

@Component({
    components: {
        pdf,
    },
})
export default class CustomDicomViewer extends Vue {
    selectedStudyUrl = "";
    selectedItem = 0;
    selectedSeries: any = {};
    selectedInstance: any = {};
    selectedInstanceMetadata: any = {};
    study: any = {};
    series: Array<any> = [];

    orthanUrl = window.ORTHANC_API_URL;

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
            this.selectedInstance = await getInstance(this.selectedSeries.Instances[0]);
            this.selectedInstanceMetadata = await getInstanceMetadata(
                this.selectedSeries.Instances[0],
            );
        });
    }

    async updatedSelectedSeries(item: any): Promise<void> {
        this.selectedSeries = item;
        this.selectedInstance = await getInstance(this.selectedSeries.Instances[0]);
        this.selectedInstanceMetadata = await getInstanceMetadata(this.selectedSeries.Instances[0]);
    }
}
</script>

<style>
.serieslist {
    background: black !important;
    color: white !important;
}

.serieslist-header .v-icon {
    color: white;
}

.serieslist .v-list-item__subtitle {
    color: #fff !important;
    text-align: center;
}

.serieslist .v-list-item-group .v-list-item--active {
    opacity: 100%;
    border-radius: 10px;
    border: solid 1px white;
}

.serieslist .v-list-item--link:before {
    background-color: #46464680;
    opacity: 100%;
    border-radius: 10px;
    margin: 5px;
}
</style>
