<!--
  Copyright 2022 Crown Copyright

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
  -->

<template>
    <v-container>
        <pdf
            :key="selectedInstance.ID"
            style="height: calc(100vh - 253px); overflow-y: auto"
            v-if="
                selectedSeries.MainDicomTags != undefined &&
                selectedSeries.MainDicomTags.Modality == 'DOC'
            "
            :src="`${orthanUrl}/instances/${selectedInstance.ID}/pdf`"
        ></pdf>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { EventBus } from "@/event-bus";
import pdf from "pdfvuer";
import { getInstance } from "../../../api/ClinicalReview/OrthancService";
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
            EventBus.$emit("updateSelectedInstance", this.selectedSeries.Instances[0]);
        });
    }
}
</script>

<style></style>
