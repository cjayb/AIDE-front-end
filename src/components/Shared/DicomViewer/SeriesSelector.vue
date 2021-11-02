<template>
    <v-container style="padding: 12px 5px" class="ma-0 pa-0">
        <v-list
            class="serieslist"
            style="height: calc(100vh - 251px); overflow-y: auto; clear: both"
            data-cy="series-selector"
        >
            <v-list-item-group color="primary">
                <v-slide-y-transition class="py-0" group tag="v-list">
                    <v-list-item
                        v-for="item in orderBy(series, 'LastUpdate')"
                        :key="item.ID"
                        @click="updatedSelectedSeries(item)"
                        data-cy="dicom-series"
                    >
                        <v-list-item-content>
                            <v-list-item-subtitle data-cy="modality-length">
                                <span style="float: left">{{ item.MainDicomTags.Modality }}</span>
                                <span style="float: right">({{ item.Instances.length }})</span>
                            </v-list-item-subtitle>
                            <v-list-item-title>
                                <v-sheet height="100" width="100" class="mx-auto">
                                    <v-img
                                        v-if="item.MainDicomTags.Modality != 'DOC'"
                                        class="mx-auto"
                                        :src="`${orthanUrl}/instances/${item.Instances[0]}/preview`"
                                    >
                                        <template v-slot:placeholder>
                                            <v-row
                                                class="fill-height ma-0"
                                                align="center"
                                                justify="center"
                                            >
                                                <v-progress-circular
                                                    indeterminate
                                                    color="grey lighten-5"
                                                ></v-progress-circular>
                                            </v-row>
                                        </template>
                                    </v-img>
                                    <pdf
                                        v-if="item.MainDicomTags.Modality == 'DOC'"
                                        :src="`${orthanUrl}/instances/${item.Instances[0]}/pdf`"
                                    >
                                        <template v-slot:loading>
                                            <v-row
                                                class="fill-height ma-0"
                                                align="center"
                                                justify="center"
                                            >
                                                <v-progress-circular
                                                    indeterminate
                                                    color="grey lighten-5"
                                                ></v-progress-circular>
                                            </v-row>
                                        </template>
                                    </pdf>
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
                </v-slide-y-transition>
            </v-list-item-group>
        </v-list>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";
import pdf from "pdfvuer";
import { Watch, Prop } from "vue-property-decorator";
import Vue2Filters from "vue2-filters";
@Component({
    components: {
        pdf,
    },
    mixins: [Vue2Filters.mixin],
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
    text-align: left;
}

.serieslist .v-list-item-group .v-list-item {
    margin: 5px 5px;
    padding: 5px;
}

.serieslist .v-list-item-group .v-list-item--active {
    opacity: 1;
    border-radius: 10px;
    border: solid 1px white;
}

.serieslist .v-list-item--link:hover {
    background-color: #464646;
    opacity: 1;
    border-radius: 10px;
}

.serieslist .v-list-item--link:before {
    background-color: rgba(70, 70, 70, 0.5);
    opacity: 0.6;
    border-radius: 10px;
    margin: 0px;
}

.list-enter-active,
.list-leave-active {
    transition: all 1s ease;
}
.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>
