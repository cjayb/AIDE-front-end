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
                v-for="item in items"
                :key="item.name"
                link
                :to="{ name: 'ClinicalReviewViewer', params: { study_id: item.study_id } }"
            >
                <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.date }}</v-list-item-subtitle>
                    <v-list-item-subtitle>{{ item.model }}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </v-list></v-container
    >
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
@Component({})
export default class Tasks extends Vue {
    items = [
        {
            name: "Patient A",
            date: "14/07/2021",
            model: "Model A",
            study_id: "1.3.6.1.4.1.14519.5.2.1.7009.2403.194158539675615867024676990849",
        },
        {
            name: "Patient B",
            date: "14/07/2021",
            model: "Model B",
            study_id: "1.3.6.1.4.1.14519.5.2.1.7009.2403.300468367115324750799216325524",
        },
        {
            name: "Patient C",
            date: "14/07/2021",
            model: "Model C",
            study_id: "1.3.6.1.4.1.25403.345050719074.3824.20170126085406.1",
        },
    ];
}
</script>
