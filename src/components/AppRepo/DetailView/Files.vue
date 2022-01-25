<template>
    <v-col cols="12">
        <v-row><h2>Files</h2></v-row>
        <v-row justify="start" data-cy="specification-table" v-if="application.files">
            <v-col v-for="file in application.files" :key="file" md="auto">
                <v-hover v-slot="{ hover }">
                    <v-card
                        class="mx-auto my-5"
                        :elevation="hover ? 12 : 0"
                        width="160px"
                        height="160px"
                        :class="{ 'on-hover': hover }"
                        style="background: #f5f5f5"
                        data-cy="file-card"
                        @click="$window.open(file.url)"
                    >
                        <v-row
                            justify="center"
                            class="px-0 py-0 mx-0 my-0"
                            data-cy="input-types-icon"
                        >
                            <v-icon size="80" v-if="file.label == 'clinical-safety-case'"
                                >mdi-briefcase</v-icon
                            >
                            <v-icon size="80" v-else-if="file.label == 'datasheet-for-datasets'"
                                >mdi-book-open-page-variant</v-icon
                            >
                            <v-icon size="80" v-else-if="file.label == 'declaration-of-conformity'"
                                >mdi-marker-check</v-icon
                            >
                            <v-icon size="80" v-else-if="file.label == 'instructions-for-use'"
                                >mdi-alert-circle</v-icon
                            >
                            <v-icon size="80" v-else-if="file.label == 'model-card'"
                                >mdi-card-text</v-icon
                            >
                            <v-icon size="80" v-else-if="file.label == 'research-protocol'"
                                >mdi-magnify</v-icon
                            >
                            <v-icon size="80" v-else-if="file.label == 'technical-file'"
                                >mdi-cog</v-icon
                            >
                            <v-icon size="80" v-else>mdi-dots-horizontal-circle</v-icon>
                        </v-row>
                        <v-row justify="center" class="px-0 py-0 mx-0 my-0">
                            <v-card-title
                                class="px-3 py-0 mx-0 my-0 fileTitle"
                                data-cy="input-types-title"
                                >{{ file.label | formatFileTitle }}</v-card-title
                            >
                        </v-row>
                    </v-card>
                </v-hover>
            </v-col>
        </v-row>
        <v-row v-else><p>No files uploaded</p></v-row>
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
<style>
.fileTitle {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    white-space: normal;
    text-transform: capitalize;
    word-break: break-word;
}
</style>
