<template>
    <v-row style="border: 1px solid #eeeeee; margin-bottom: 0px">
        <v-col
            cols="2"
            style="color: #23212a; font-weight: bold; font-size: 24px; line-height: 40px"
            data-cy="name"
            >{{ application.name }}</v-col
        >
        <v-divider vertical></v-divider>
        <v-col
            cols="2"
            style="color: #615f69; font-weight: bold; font-size: 24px; line-height: 40px"
            data-cy="developers"
            >{{ application.developers }}</v-col
        >
        <v-divider vertical></v-divider>
        <v-col cols="2" data-cy="version-selector"
            ><v-select
                dense
                hide-details
                v-model="selected_version.application_version_id"
                :items="application.versions"
                @change="selectVersion()"
                item-text="version"
                item-value="application_version_id"
                label="Version"
                outlined
                data-cy="version-filter"
            ></v-select
        ></v-col>
        <v-divider vertical></v-divider>
        <!-- <v-col cols="2"
            ><v-chip dark color="#615F69" data-cy="deployed-version" v-bind:key="speciality"
                >V1.0 deployed</v-chip
            ></v-col
        > -->
        <v-spacer></v-spacer>
        <v-col cols="2"
            ><v-img
                v-if="application.certification.certifications.includes('ce')"
                data-cy="ce-logo"
                contain
                class="mx-auto"
                src="@/assets/CE.png"
                style="float: right"
                height="40px" />
            <v-img
                v-if="application.certification.certifications.includes('ukca')"
                data-cy="ukca-logo"
                contain
                class="mx-auto"
                src="@/assets/UKCA.png"
                style="float: right"
                height="40px" />
            <v-img
                v-if="application.certification.certifications.includes('fda')"
                data-cy="fda-logo"
                contain
                class="mx-auto"
                src="@/assets/FDA.png"
                style="float: right"
                height="40px"
        /></v-col>
        <v-col cols="2"><v-btn disabled dark color="#2196F3">Configure & Deploy</v-btn></v-col>
    </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { EventBus } from "@/event-bus";
import { ApplicationDetail } from "@/models/ApplicationResult";

export interface SelectedVersion {
    application_version_id: string | (string | null)[];
}

@Component({
    components: {},
})
export default class DetailActionBar extends Vue {
    @Prop() application!: ApplicationDetail;
    selected_version: SelectedVersion = {
        application_version_id: "",
    };

    mounted() {
        this.selected_version.application_version_id = this.$route.query.application_version_id;

        EventBus.$on("selectVersion", (application_id: string, application_version_id: string) => {
            this.selected_version.application_version_id = application_version_id;
        });
    }

    selectVersion(): void {
        EventBus.$emit(
            "selectVersion",
            this.application.id,
            this.selected_version.application_version_id,
        );
        this.$router.push({
            name: "ApplicationRepositoryDetail",
            params: { application_id: this.application.id },
            query: { application_version_id: this.selected_version.application_version_id },
        });
    }
}
</script>
