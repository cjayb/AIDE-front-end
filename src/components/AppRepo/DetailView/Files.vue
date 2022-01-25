<template>
    <v-col cols="12">
        <v-row><h2>Files</h2></v-row>
        <v-row justify="start" data-cy="specification-table" v-if="application.files">
            <v-col v-for="file in application.files" :key="file" md="auto">
                <v-card
                    class="mx-auto my-5"
                    :elevation="0"
                    width="160px"
                    height="160px"
                    :class="{ 'on-hover': hover }"
                    style="background: #f5f5f5"
                    data-cy="file-card"
                >
                    <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                        <v-icon size="80" data-cy="input-types-icon">mdi-import</v-icon>
                    </v-row>
                    <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                        <v-card-title class="px-0 py-0 mx-0 my-0" data-cy="input-types-title">{{
                            file.label
                        }}</v-card-title>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-row><p>No files uploaded</p></v-row>
    </v-col>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { ApplicationDetail } from "@/models/ApplicationResult";

@Component({
    components: {},
})
export default class Files extends Vue {
    @Prop() application!: ApplicationDetail;
}
</script>
