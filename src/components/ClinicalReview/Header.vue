<template>
    <v-container>Header</v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";

@Component({})
export default class Header extends Vue {
    selectedExecutionMetaData = {};

    created(): void {
        EventBus.$on("selectTask", (execution: any) => {
            this.selectedExecutionMetaData =
                execution.output.destinations[0].study.series[0].metadata;
        });
    }
}
</script>
