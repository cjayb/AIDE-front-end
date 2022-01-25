<template>
    <v-row
        ><v-col cols="12"
            ><h2 data-cy="intended-use-title">Intended Use</h2>
            <p data-cy="intended-use">
                {{ application.intended_use }}
            </p></v-col
        ></v-row
    >
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { ApplicationDetail } from "@/models/ApplicationResult";

@Component({
    components: {},
})
export default class IntendedUse extends Vue {
    @Prop() application!: ApplicationDetail;
}
</script>
