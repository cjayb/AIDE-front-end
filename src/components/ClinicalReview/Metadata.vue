<template>
    <transition name="fade" mode="out-in">
        <v-container :key="selectedExecutionMetaData">
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="text-h6"> Metadata </v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
            <v-list class="transparent" dense>
                <v-list-item v-for="(item, key, index) in selectedExecutionMetaData" :key="index">
                    <v-list-item-title>{{ key }}</v-list-item-title>

                    <v-list-item-subtitle class="text-right">
                        {{ item }}
                    </v-list-item-subtitle>
                </v-list-item>
            </v-list>
        </v-container>
    </transition>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";

@Component({})
export default class Metadata extends Vue {
    selectedExecutionMetaData = {};

    created(): void {
        EventBus.$on("selectTask", (execution: any) => {
            this.selectedExecutionMetaData = execution.event.origin.series[0];
        });
    }
}
</script>
