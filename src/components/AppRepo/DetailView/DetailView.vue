<template>
    <v-container style="max-width: 100%; background: #fff" v-if="application != null">
        <AppRepoHeader :application="application"></AppRepoHeader>
        <v-row v-if="loading">
            <v-progress-linear indeterminate></v-progress-linear>
        </v-row>
        <DetailActionBar :application="application"></DetailActionBar>
        <v-container
            style="max-width: 100%; height: calc(100vh - 210px); overflow: auto"
            data-cy="detail-sub-module"
        >
            <v-container style="max-width: 75%">
                <DetailHeader :application="application"></DetailHeader>
                <v-tabs v-model="tab">
                    <v-tab>{{ application.name }} Overview</v-tab>
                    <!-- <v-tab>Model Card</v-tab> -->
                </v-tabs>
                <v-tabs-items v-model="tab">
                    <v-tab-item>
                        <IntendedUse :application="application"></IntendedUse>
                        <ModelDetails :application="application"></ModelDetails>
                        <Certification :application="application"></Certification>
                        <SystemRequirements :application="application"></SystemRequirements>
                        <Files :application="application"></Files>
                        <VersionHistory :application="application"></VersionHistory>
                        <AboutTheDeveloper :application="application"></AboutTheDeveloper>
                    </v-tab-item>
                    <!-- <v-tab-item>No Data</v-tab-item> -->
                </v-tabs-items>
            </v-container>
        </v-container>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";
import AppRepoHeader from "../Shared/AppRepoHeader.vue";
import DetailActionBar from "../DetailView/DetailActionBar.vue";
import DetailHeader from "../DetailView/DetailHeader.vue";
import IntendedUse from "../DetailView/IntendedUse.vue";
import ModelDetails from "../DetailView/ModelDetails.vue";
import Certification from "../DetailView/Certification.vue";
import SystemRequirements from "../DetailView/SystemRequirements.vue";
import Files from "../DetailView/Files.vue";
import VersionHistory from "../DetailView/VersionHistory.vue";
import AboutTheDeveloper from "../DetailView/AboutTheDeveloper.vue";

import { getApplication } from "../../../api/ApplicationService";
import { ApplicationDetail } from "@/models/ApplicationResult";

@Component({
    components: {
        AppRepoHeader,
        DetailActionBar,
        DetailHeader,
        IntendedUse,
        ModelDetails,
        Certification,
        SystemRequirements,
        Files,
        VersionHistory,
        AboutTheDeveloper,
    },
})
export default class DetailView extends Vue {
    loading = true;
    application: ApplicationDetail | null = null;
    tab = null;

    async created(): Promise<void> {
        const application_id = this.$route.params.application_id;
        const application_version_id = this.$route.query.application_version_id;
        this.updateSelectedVersion(application_id, application_version_id);

        EventBus.$on("selectVersion", (application_id: string, application_version_id: string) => {
            this.updateSelectedVersion(application_id, application_version_id);
        });
    }

    async updateSelectedVersion(
        application_id: string,
        application_version_id: string | (string | null)[],
    ): Promise<void> {
        this.loading = true;
        await getApplication(application_id, application_version_id)
            .then((application: ApplicationDetail) => {
                this.loading = false;
                this.application = application;
            })
            .catch((err) => {
                console.log(err);
                this.loading = false;
            });
    }
}
</script>
<style>
.custom-card {
    height: 130px;
    width: 130px;
    background-color: #f5f5f5 !important;
}
.custom-card .v-card__title {
    font-size: 0.9rem;
    line-height: 1rem;
}
</style>
