<template>
    <v-container>
        <pdf
            style="height: 80vh; overflow-y: auto"
            v-if="selectedSeries.MainDicomTags.Modality == 'DOC'"
            :src="`${orthanUrl}/instances/${selectedInstance.ID}/pdf`"
        ></pdf>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { EventBus } from "@/event-bus";
import pdf from "vue-pdf";
import { getInstance } from "../../../api/OrthancService";
@Component({
    components: {
        pdf,
    },
})
export default class PdfViewport extends Vue {
    selectedSeries: any = {};
    selectedInstance: any = {};
    orthanUrl = window.ORTHANC_API_URL;

    async created(): Promise<void> {
        EventBus.$on("updatedSelectedSeries", async (selectedSeries: any) => {
            this.selectedSeries = selectedSeries;
            this.selectedInstance = await getInstance(this.selectedSeries.Instances[0]);
        });
    }
}
</script>

<style></style>
