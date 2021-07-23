<template>
    <v-container
        ><v-list-item>
            <v-list-item-content>
                <v-list-item-title class="text-h6"> Tasks </v-list-item-title>
                <v-list-item-subtitle> subtext </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-text-field label="Search Tasks" placeholder="Search Tasks" outlined></v-text-field>

        <v-divider></v-divider>

        <v-list dense nav>
            <v-list-item
                v-for="item in tasks"
                :key="item.execution_uid"
                link
                :to="{
                    name: 'ClinicalReviewViewer',
                    params: { study_id: item.output.destinations[0].study.study_uid },
                }"
            >
                <v-list-item-content>
                    <v-list-item-title>{{
                        item.output.destinations[0].study.series[0].metadata.PatientsName
                    }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                        item.timestamp.inference_finished
                    }}</v-list-item-subtitle>
                    <v-list-item-subtitle>{{ item.model.model_name }}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </v-list></v-container
    >
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { getAllExecutions } from "../../api/ExecutionService";

@Component({})
export default class Tasks extends Vue {
    tasks = [];

    async created(): Promise<void> {
        this.tasks = await getAllExecutions("1", "10", "false");
    }
}
</script>
