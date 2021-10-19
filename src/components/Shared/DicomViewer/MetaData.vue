<template>
    <v-container>
        <v-header class="serieslist-header" style="float: right"
            >Metadata<v-icon>mdi-chevron-right</v-icon></v-header
        >
        <p style="clear: both">{{ selectedInstanceMetadata }}</p>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";
import { Prop } from "vue-property-decorator";
import { getInstanceMetadata } from "../../../api/OrthancService";
@Component
export default class MetaData extends Vue {
    selectedInstanceMetadata: Array<any> = [];

    async created(): Promise<void> {
        EventBus.$on("updatedSelectedSeries", async (selectedSeries: any) => {
            this.selectedInstanceMetadata = await getInstanceMetadata(selectedSeries.Instances[0]);
        });
    }
}
</script>

<style></style>
