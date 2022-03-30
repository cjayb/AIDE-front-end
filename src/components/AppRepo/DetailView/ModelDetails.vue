<template>
    <v-row
        ><v-col cols="12"
            ><h2 data-cy="model-details-title">Model Details</h2>
            <p data-cy="model-details">
                {{ versionDetails.long_desc }}
            </p></v-col
        ></v-row
    >
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { VersionDetails } from "@/models/Application";

@Component({
    components: {},
})
export default class ModelDetails extends Vue {
    @Prop() versionDetails!: VersionDetails;
}
</script>
