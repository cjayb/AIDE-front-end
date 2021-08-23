<template>
    <transition name="fade" mode="out-in">
        <v-container :key="selectedExecutionMetaData">
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="text-h6"> Metadata </v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list dense nav style="height: 75vh; overflow-y: scroll">
                <v-list-item
                    v-for="(item, key, index) in selectedExecutionMetaData"
                    :key="index"
                    link
                    data-test="work-list-item"
                >
                    <v-list-item-content>
                        <v-tooltip bottom open-delay="1000">
                            <template v-slot:activator="{ on, attrs }">
                                <v-list-item-title v-bind="attrs" v-on="on">
                                    {{ key }}</v-list-item-title
                                >
                            </template>
                            <span>{{ key }}</span>
                        </v-tooltip>
                        <v-tooltip bottom open-delay="1000">
                            <template v-slot:activator="{ on, attrs }">
                                <v-list-item-subtitle v-bind="attrs" v-on="on">{{
                                    item
                                }}</v-list-item-subtitle>
                            </template>
                            <span>{{ item }}</span>
                        </v-tooltip>
                    </v-list-item-content>
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
