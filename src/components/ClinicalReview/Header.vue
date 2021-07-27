<template>
    <v-container style="max-width: 100%">
        <v-row>
            <v-col cols="6" style="background: #8d1b60; color: #fff">Patient: </v-col>
            <v-col cols="4" style="background: #607d8b; color: #fff">Mode: </v-col>
            <v-col cols="2" style="background: #607d8b; color: #fff"
                ><v-btn color="#4CAF50" dark x-small>Accept</v-btn>
                <v-btn color="#D11515" dark x-small>Reject</v-btn></v-col
            >
        </v-row>
        <v-row style="background: #fff5fb">
            <v-col cols="3">Age: </v-col>
            <v-col cols="3">Patient Id: </v-col>
            <v-col cols="3">Gender: </v-col>
            <v-col cols="3">Model: </v-col>
        </v-row>
    </v-container>
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
