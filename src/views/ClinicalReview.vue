<template>
    <v-container style="max-width: 100%">
        <!-- Header Bar -->
        <v-row
            ><v-col cols="12"><Header /></v-col
        ></v-row>
        <v-row>
            <!-- Task List -->
            <v-col cols="2">
                <Tasks />
            </v-col>
            <!-- Viewer -->
            <v-col cols="8"><DicomViewer :key="$route.path" /></v-col>
            <!-- Metadata -->
            <v-col cols="2">
                <Metadata />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DicomViewer from "../components/Shared/DicomViewer.vue";
import Header from "../components/ClinicalReview/Header.vue";
import Tasks from "../components/ClinicalReview/Tasks.vue";
import Metadata from "../components/ClinicalReview/Metadata.vue";

@Component({
    components: {
        DicomViewer,
        Header,
        Tasks,
        Metadata,
    },
})
export default class ClinicalReview extends Vue {
    // Declared as component data
}
</script>
