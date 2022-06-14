<template>
    <v-col cols="12">
        <v-row><h2 data-cy="versions-title">Version History</h2></v-row>
        <v-row>
            <v-col md="12">
                <v-simple-table data-cy="versions">
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th width="33%" class="text-left">Version</th>
                                <th class="text-left">Created</th>
                                <th class="text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="version in sortedVersions" :key="version">
                                <td data-cy="history-version">{{ version.version_string }}</td>
                                <td data-cy="version-date">
                                    {{ version.createdAt | formatDate }}
                                </td>
                                <td>
                                    <v-btn
                                        data-cy="goto-version"
                                        small
                                        color="primary"
                                        @click="viewDetails(application.application_id, version.id)"
                                        >Go to version</v-btn
                                    >
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
    </v-col>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import moment from "moment";
import { EventBus } from "@/event-bus";
import { Prop } from "vue-property-decorator";
import { Application } from "@/models/AppRepo/Application";

@Component({
    components: {},
})
export default class VersionHistory extends Vue {
    @Prop() application!: Application;

    get sortedVersions() {
        return this.application.versions.sort((a, b) => {
            return moment(b.createdAt).unix() - moment(a.createdAt).unix();
        });
    }

    viewDetails(id: string, application_version_id: string): void {
        EventBus.$emit("selectVersion", id, application_version_id);
        this.$router.push({
            name: "ApplicationRepositoryDetail",
            params: { application_id: id },
            query: { application_version_id: application_version_id },
        });
    }
}
</script>
