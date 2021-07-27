<template>
    <v-container style="max-width: 100%">
        <v-row>
            <!-- Task List -->
            <v-col cols="2">
                <Tasks />
            </v-col>
            <!-- Viewer -->
            <v-col cols="10">
                <v-row><Header /></v-row>
                <v-row>
                    <v-col cols="9">
                        <DicomViewer :key="$route.path" />
                    </v-col>
                    <v-col cols="3">
                        <Metadata />
                    </v-col>
                </v-row>
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
