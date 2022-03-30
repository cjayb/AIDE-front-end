<template>
    <v-row
        ><v-col cols="12"
            ><h2 data-cy="intended-use-title">Intended Use</h2>
            <p data-cy="intended-use">
                {{ versionDetails.intended_use }}
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
export default class IntendedUse extends Vue {
    @Prop() versionDetails!: VersionDetails;
}
</script>
