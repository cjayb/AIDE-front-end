<template>
    <v-container style="max-width: 100%; background: #fff" v-if="applicationResult != null">
        <AppRepoHeader :application="applicationResult.results[0]"></AppRepoHeader>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import AppRepoHeader from "../Shared/AppRepoHeader.vue";
import { ApplicationResult } from "@/models/ApplicationResult";

@Component({
    components: {
        AppRepoHeader,
    },
})
export default class DetailView extends Vue {
    applicationResult: ApplicationResult | null = null;
}
</script>
