<template>
    <v-container style="padding: 12px 5px" class="ma-0 pa-0">
        <v-list
            class="serieslist"
            style="height: calc(100vh - 251px); overflow-y: auto; clear: both"
        >
            <v-list-item-group v-model="selectedItem" color="primary">
                <v-list-item
                    v-for="item in series"
                    :key="item.ID"
                    @click="updatedSelectedSeries(item)"
                    data-cy="dicom-series"
                >
                    <v-list-item-content>
                        <v-list-item-subtitle data-cy="modality-length"
                            >{{ item.MainDicomTags.Modality }} ({{
                                item.Instances.length
                            }})</v-list-item-subtitle
                        >
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

                        <v-tooltip bottom open-delay="500">
                            <template v-slot:activator="{ on, attrs }">
                                <v-list-item-subtitle
                                    v-bind="attrs"
                                    v-on="on"
                                    data-cy="series-description"
                                    >{{
                                        item.MainDicomTags.SeriesDescription
                                    }}</v-list-item-subtitle
                                >
                            </template>
                            <span>{{ item.MainDicomTags.SeriesDescription }}</span>
                        </v-tooltip>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";
import pdf from "vue-pdf";
import { Prop } from "vue-property-decorator";
@Component({
    components: {
        pdf,
    },
})
export default class SeriesSelector extends Vue {
    @Prop() series: Array<any> = [];
    orthanUrl = window.ORTHANC_API_URL;
    selectedItem: any = 0;

    async updatedSelectedSeries(selectedSeries: any): Promise<void> {
        EventBus.$emit("updatedSelectedSeries", selectedSeries);
    }

    toggleSeries(): void {
        EventBus.$emit("toggleSeries");
    }
}
</script>

<style scoped>
.serieslist {
    background: black !important;
    color: white !important;
}

.serieslist .v-list-item__subtitle {
    color: #fff !important;
    text-align: center;
}

.serieslist .v-list-item-group .v-list-item {
    margin: 5px 0px;
    padding: 5px;
}

.serieslist .v-list-item-group .v-list-item--active {
    opacity: 1;
    border-radius: 10px;
    border: solid 1px white;
}

.serieslist .v-list-item--link:before {
    background-color: #464646;
    opacity: 0.6;
    border-radius: 10px;
    margin: 0px;
}
</style>
