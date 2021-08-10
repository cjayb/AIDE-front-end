<template>
    <transition name="fade" mode="out-in">
        <v-card style="width: 100%" :key="selectedModel">
            <v-list-item style="background: #607d8b; color: #fff">
                <v-list-item-content>
                    <v-row>
                        <v-col data-test="header-mode" cols="10">
                            Mode: {{ this.selectedModel.mode }}
                        </v-col>
                        <v-col cols="2" style="color: #fff">
                            <v-btn data-test="accept-btn" color="#4CAF50" dark x-small>
                                Accept
                            </v-btn>
                            <v-btn data-test="reject-btn" color="#D11515" dark x-small>
                                Reject
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </v-list-item>
            <v-list-item style="background: #f5f5f5; color: #fff">
                <v-list-item-content>
                    <v-row style="background: #f5f5f5">
                        <v-col data-test="patient-name" cols="3">
                            Name: {{ selectedExecutionMetaData.PatientsName }}
                        </v-col>
                        <v-col data-test="patient-age" cols="3">
                            Age: {{ selectedExecutionMetaData.PatientsAge }}
                        </v-col>
                        <v-col data-test="patient-id" cols="3">
                            Patient Id: {{ selectedExecutionMetaData.PatientID }}
                        </v-col>
                        <v-col data-test="patient-sex" cols="3">
                            Sex: {{ selectedExecutionMetaData.PatientsSex }}
                        </v-col>
                    </v-row>
                </v-list-item-content>
            </v-list-item>
        </v-card>
    </transition>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";

@Component({})
export default class Header extends Vue {
    selectedExecutionMetaData = {};
    selectedModel = {};

    created(): void {
        EventBus.$on("selectTask", (execution: any) => {
            this.selectedExecutionMetaData =
                execution.output.destinations[0].study.series[0].metadata;
            this.selectedModel = execution.model;
        });
    }
}
</script>
